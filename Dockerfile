
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci


COPY src/Infrastructure/prisma ./src/Infrastructure/prisma
COPY src ./src


RUN npx prisma generate --schema=src/Infrastructure/prisma/schema.prisma


RUN npm run build


FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production


COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma


COPY --from=build /app/src/presentation/Docs ./src/presentation/Docs
COPY --from=build /app/src/presentation/Routes ./src/presentation/Routes


FROM runtime AS api
EXPOSE 3000
CMD ["node", "dist/server.js"]


FROM runtime AS worker
CMD ["node", "dist/workerStarter.js"]


FROM runtime AS migrate
COPY src/Infrastructure/prisma ./src/Infrastructure/prisma
COPY prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
CMD ["node_modules/.bin/prisma", "migrate", "deploy", "--config=prisma.config.ts"]