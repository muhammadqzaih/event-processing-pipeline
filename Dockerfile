FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY src/infrastructure/prisma ./src/infrastructure/prisma

RUN npm ci

COPY src ./src

RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma.config.ts ./
COPY src/infrastructure/prisma ./src/infrastructure/prisma

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/src/presentation/docs ./src/presentation/docs
COPY --from=build /app/src/presentation/routes ./src/presentation/routes

FROM runtime AS api
EXPOSE 3000
CMD ["node", "dist/server.js"]

FROM runtime AS worker
CMD ["node", "dist/workerStarter.js"]
