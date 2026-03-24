# Webhook Pipeline — Event Processing System

A production-grade, event-driven webhook processing system built with Node.js, TypeScript, and Clean Architecture. It allows you to create pipelines that ingest webhook payloads, process them through configurable actions (transform, filter, enrich), and deliver results to subscribers — all powered by a background worker with retry logic.

Live API: [http://20.199.168.229:3000/docs](http://20.199.168.229:3000/docs)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Features

- Pipeline Management — Create, update, and delete pipelines with unique webhook keys
- Action Execution — Chain multiple actions per pipeline: `transform`, `filter`, and `enrich`
- Subscriber Delivery — Fan-out processed payloads to multiple subscriber URLs via HTTP POST
- Background Worker — Asynchronous job processing using BullMQ with full retry support
- Retry Logic — Exponential backoff retry mechanism for failed deliveries
- Auth System — JWT-based authentication protecting all pipeline management routes
- Job Tracking — Full visibility into job status and per-subscriber delivery results
- API Versioning — All endpoints versioned under `/api/v1` to prevent breaking client integrations
- Swagger Docs — Auto-generated, interactive API documentation
- Dockerized — Full containerized setup for local development and production

---

## Architecture

This project draws ideas from both Clean Architecture and Feature Architecture — not a strict implementation of either, but a deliberate blend of both. From Clean Architecture it takes the concept of layered separation, where each layer has a clear responsibility and dependencies only flow inward — the Domain knows nothing about the outside world, and the Infrastructure knows nothing about business rules. 

```
+---------------------------------------------------+
|                  Presentation                     |
|    Controllers · Routes · Middleware · Docs       |
|             Validators · Common                   |
+---------------------------------------------------+
|                  Application                      |
|    Features (CQRS) · DTOs · Mappers · Mediator    |
|          Contracts · Common (AppError)            |
+---------------------------------------------------+
|                    Domain                         |
|         Entities · Repositories · tokens          |
+---------------------------------------------------+
|                Infrastructure                     |
|  database · prisma · repositories · services      |
|                    worker                         |
+---------------------------------------------------+
|               Cross-cutting                       |
|    Config (index · swagger) · DI (container)      |
+---------------------------------------------------+
```

The Domain layer defines the core business contracts — entities and repository interfaces — with zero knowledge of how they are implemented. The Infrastructure layer provides the concrete implementations behind those interfaces, meaning the business logic never depends on Prisma, BullMQ, or any external technology directly. Swapping the database or the queue is a matter of writing a new implementation file, not touching a single line of business logic.

---

## Design Decisions

### 1. Clean Architecture Influence

- The project is structured using Clean Architecture principles with clear separation between Domain, Application, Infrastructure, and Presentation layers
- Related code is co-located, so you can reason about a feature in isolation without jumping between six folders
- Each layer has a single responsibility and depends only on the layers below it
- Business logic lives in the Domain and Application layers, completely independent of frameworks and external tools
- This makes the system highly maintainable, testable, and easy to evolve over time

### 2. CQRS and Mediator Pattern

- Commands (write operations) and Queries (read operations) are separated in the application layer
- Each handler has a single responsibility — it does one thing and does it well, eliminating "fat services" that grow uncontrollably over time
- Each handler is completely isolated, which makes unit testing straightforward with no hidden dependencies to mock
- The Mediator pattern decouples callers from handlers — the controller just dispatches a command or query without knowing which service handles it

### 3. Strategy Pattern for Action Executors

- Each action type (`transform`, `filter`, `enrich`) is its own executor class with a shared interface
- At runtime, the worker resolves the correct strategy based on the action type — no `if/else` chains
- Adding a new action type means creating a new strategy class with zero modification to existing code
- This is the Open/Closed Principle in practice — open for extension, closed for modification

### 4. Repository Pattern and Interface Abstraction

- Every repository is defined as an interface in the Domain layer and implemented in Infrastructure
- Services depend on the interface, never the concrete class — the application doesn't care whether data comes from SQL Server, PostgreSQL, or an in-memory store
- Swapping the database is a one-file change, not a refactor of business logic

### 5. Global Exception Handling and Standardized API Responses

- A centralized `errorHandler` middleware catches all thrown errors across the entire application
- The `AppError` class provides typed factory methods (`AppError.notFound()`, `AppError.unauthorized()`, etc.) that map to consistent HTTP response shapes
- Every error response looks the same — clients can rely on a predictable `{ message, statusCode }` contract
- No unhandled error ever reaches the client as a raw stack trace

### 6. DTO Pattern for Requests and Responses

- Data Transfer Objects are used at every layer boundary — request DTOs are validated before reaching services
- Response DTOs shape what gets returned to clients, so internal implementation details never leak out
- The API contract is fully decoupled from the database schema — you can rename a database column without touching a single API response

### 7. Infrastructure Isolation

- All infrastructure concerns — database, queue, JWT, bcrypt, HTTP client — live in the `infrastructure/` layer behind interfaces
- Swapping Redis for RabbitMQ, or BullMQ for a cloud queue like SQS, is isolated to one file with zero impact on business logic
- This is the Dependency Inversion Principle applied at the architecture level

### 8. Environment-based Configuration (Config Pattern)

- All configuration is centralized in `src/Config/index.ts`, which reads from environment variables once at startup
- No `process.env` calls scattered across the codebase — one place to look, one place to change
- Prevents hardcoded values, keeps secrets manageable, and allows different behavior per environment without touching code

### 9. Schema Validation with Zod

- Zod schemas validate all input at the controller layer before any business logic executes
- Type-safe and composable — schemas double as both runtime validators and TypeScript type definitions
- Validation errors are caught by the global error handler and returned as structured `400 Bad Request` responses
- Invalid data never reaches the service layer

### 10. API Versioning

- All routes are prefixed with `/api/v1` so future breaking changes can be introduced under `/api/v2` without affecting existing clients
- Skipping versioning early and paying for it later is a common mistake — this project treats it as a first-class concern from day one

### 11. Swagger For Documentation

- API documentation is auto-generated from JSDoc annotations on route files — always in sync with the actual code
- No separate documentation file to maintain, no risk of docs going stale
- The Swagger UI is served directly from the API server at `/docs`

---

## Tech Stack

| Technology | Why |
|---|---|
| Node.js + TypeScript | Type safety at compile time eliminates entire categories of runtime bugs. TypeScript's decorator support enables clean dependency injection patterns that would be verbose in plain JavaScript. |
| Express.js | Minimal, unopinionated HTTP framework. Its middleware pipeline maps naturally to Clean Architecture's layered approach — each middleware is a single-responsibility concern. |
| Prisma ORM (v7) | Type-safe database client with auto-generated types from the schema. Migration management is first-class. The query builder eliminates raw SQL while remaining readable and debuggable. |
| SQL Server (MSSQL) | Enterprise-grade relational database with strong ACID guarantees. Chosen for its robust transaction support, which is critical when creating jobs and queuing them atomically without risking inconsistent state. |
| Redis | In-memory data store used as the BullMQ backend. Provides sub-millisecond job persistence with pub/sub capabilities. Essential for the retry queue's delayed job scheduling. |
| BullMQ | Production-grade job queue built on Redis. Provides job prioritization, concurrency control, retry logic with backoff, and job lifecycle events out of the box. Far more reliable than a naive setTimeout approach and battle-tested for high-throughput workloads. |
| TSyringe | Lightweight dependency injection container from Microsoft. Enables constructor injection via decorators (`@injectable`, `@inject`), making services fully testable and loosely coupled without manual wiring. |
| JWT (jsonwebtoken) | Stateless authentication tokens. The server doesn't need to store session state — the token carries all identity information. Scales horizontally without a shared session store. |
| Bcrypt | Industry standard for password hashing with a configurable cost factor. Unlike MD5 or SHA, bcrypt is intentionally slow to brute-force — a critical property for password security. |
| Zod | TypeScript-first schema validation. Schemas double as both runtime validators and TypeScript type definitions — you define the shape once and get both validation and type inference for free. |
| Docker + Docker Compose | Containerization ensures the application runs identically across every environment — a developer's laptop, CI, and production. Docker Compose orchestrates multi-service startup with health checks and dependency ordering. |
| GitHub Actions | Native CI/CD for GitHub repositories. Tight integration means no external CI service to maintain, and the workflow files live in the repository alongside the code. |
| Azure VM | Full control over the production environment. Unlike PaaS solutions, a VM allows fine-grained configuration of networking, memory limits, and service orchestration without vendor-specific abstractions. |
| Swagger / OpenAPI | Living documentation that is always accurate because it is generated from code annotations. Eliminates the "docs are outdated" problem that plagues manually maintained API references. |
| Helmet.js | Secures Express apps by setting HTTP security headers (XSS protection, content type sniffing prevention, etc.) with a single line. Security by default, opt-out where needed. |

---

## Database Schema


![Database Schema](./docs/database-schema.png)

Key relationships:

- A User owns many Pipelines
- A Pipeline has many Actions, Subscribers, and Jobs
- A Job has many JobDeliveries (one per subscriber)
- Actions are ordered and executed sequentially per job
- JobDeliveries track per-subscriber delivery status and retry attempts

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Git

### Clone the repository

```bash
git clone https://github.com/muhammadqzaih/event-processing-pipeline.git
cd event-processing-pipeline
```

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

---

## Running with Docker

The entire stack (API, Worker, SQL Server, Redis, Migrations) runs with a single command.

### Start everything

```bash
docker-compose up --build
```

### What happens automatically

1. SQL Server starts and waits until healthy
2. Redis starts and waits until healthy
3. The migrate container runs all pending Prisma migrations, then exits
4. The api starts on port `3000` after migrations complete
5. The worker starts processing jobs after migrations complete

### Access the API

```
http://localhost:3000/docs
```

### Stop everything

```bash
docker-compose down
```

### Stop and wipe the database

```bash
docker-compose down -v
```

### Useful commands

```bash
# View logs for a specific service
docker-compose logs -f api
docker-compose logs -f worker

# Check running containers
docker-compose ps

# Rebuild a specific service
docker-compose build --no-cache api
```

---

## CI/CD Pipeline

This project uses GitHub Actions for CI/CD and deploys to an Azure VM.

### Pipeline Overview

```
Push to main
     |
     v
+---------------------+
|   CI — build.yml    |
|                     |
|  Checkout code      |
|  Login Docker Hub   |
|  Build API image    |
|  Build Worker image |
|  Build Migrate image|
|  Push to Hub        |
+----------+----------+
           | on success
           v
+---------------------+
|   CD — deploy.yml   |
|                     |
|  SSH into Azure     |
|  Write .env file    |
|  Pull new images    |
|  docker compose     |
|  down then up       |
|  Prune old images   |
+---------------------+
```



### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `VM_HOST` | Azure VM public IP |
| `VM_USERNAME` | VM SSH username |
| `VM_SSH_KEY` | Private SSH key contents |
| `DATABASE_URL` | SQL Server connection string |
| `SA_PASSWORD` | SQL Server SA password |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `1d`) |
| `MAX_RETRY_ATTEMPTS` | Worker max retries |
| `RETRY_DELAY_MS` | Worker retry delay |
| `SERVER_URL` | Public API URL for Swagger |

---

## API Documentation

Interactive Swagger UI is available at:

Local: [http://localhost:3000/docs](http://localhost:3000/docs)

Production: [http://20.199.168.229:3000/docs](http://20.199.168.229:3000/docs)

<!-- Add your Swagger UI screenshot here -->
![Swagger UI](./docs/swagger-screenshot.png)

<!-- Add your Swagger endpoints screenshot here -->
![API Endpoints](./docs/swagger-endpoints.png)

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login and get JWT token |
| POST | `/api/v1/pipelines` | Yes | Create a pipeline |
| GET | `/api/v1/pipelines` | Yes | List all pipelines |
| GET | `/api/v1/pipelines/:id` | Yes | Get pipeline by ID |
| PATCH | `/api/v1/pipelines/:id` | Yes | Update pipeline |
| DELETE | `/api/v1/pipelines/:id` | Yes | Delete pipeline |
| POST | `/api/v1/actions` | Yes | Add action to pipeline |
| GET | `/api/v1/actions/pipeline/:id` | Yes | List actions for pipeline |
| PATCH | `/api/v1/actions/:id` | Yes | Update action |
| DELETE | `/api/v1/actions/:id` | Yes | Delete action |
| POST | `/api/v1/subscribers` | Yes | Add subscriber to pipeline |
| GET | `/api/v1/subscribers/pipeline/:id` | Yes | List subscribers |
| PATCH | `/api/v1/subscribers/:id` | Yes | Update subscriber |
| DELETE | `/api/v1/subscribers/:id` | Yes | Delete subscriber |
| POST | `/api/v1/pipelines/:id/webhooks` | No | Ingest webhook payload |
| GET | `/api/v1/jobs/:id` | Yes | Get job with deliveries |
| GET | `/api/v1/jobs/pipeline/:id` | Yes | List jobs for pipeline |

### Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Environment Variables

```dotenv
# Server
PORT=3000
NODE_ENV=production
SERVER_URL=http://localhost:3000

# Database
DATABASE_URL=sqlserver://localhost:1433;database=webhook;user=sa;password=YourPass;trustServerCertificate=true

# SQL Server
SA_PASSWORD=YourStrongPassword!

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# Worker
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY_MS=5000
```

---

## Project Structure

```
src/
├── Application/
│   ├── Contracts/             # Application-level interfaces and contracts
│   ├── DTOs/                  # Request/Response data transfer objects
│   ├── Features/              # CQRS handlers (commands + queries)
│   ├── Mappers/               # Entity to DTO mappers
│   └── Mediator/              # Mediator implementation for dispatching commands/queries
├── Common/
│   ├── AppError.ts            # Typed error factory (notFound, unauthorized, etc.)
│   └── express.d.ts           # Express type augmentations
├── Config/
│   ├── index.ts               # Centralized config (reads from env, no scattered process.env)
│   └── swagger.ts             # Swagger/OpenAPI setup
├── DI/
│   └── container.ts           # TSyringe dependency injection container
├── Domain/
│   ├── Entities/              # Core business entities (interfaces)
│   ├── Repositories/          # Repository interfaces (implemented in Infrastructure)
│   └── tokens.ts              # DI injection tokens
├── Infrastructure/
│   ├── database/              # Database connection setup
│   ├── prisma/                # Prisma schema, migrations, and client config
│   ├── repositories/          # Prisma repository implementations
│   ├── services/              # Bcrypt, JWT, HTTP client implementations
│   └── worker/                # BullMQ worker and job processor
├── presentation/
│   ├── Common/                # Shared presentation utilities
│   ├── Controllers/           # Express route controllers
│   ├── Docs/                  # Swagger JSDoc annotations
│   ├── Middleware/            # Auth, validation, global error handler
│   ├── Routes/                # Express routers
│   └── Validators/            # Zod validation schemas
├── app.ts                     # Express app setup
├── express.d.ts               # Root-level Express type extensions
├── server.ts                  # API entry point
└── workerStarter.ts           # Worker entry point
```

---

## How It Works — End to End

```
External System
      |
      | POST /api/v1/pipelines/:id/webhooks
      v
   API Server
      | Creates Job (status: pending)
      | Pushes jobId to BullMQ queue
      | Returns 202 Accepted immediately
      v
   BullMQ Queue (Redis)
      |
      v
   Worker Process
      | Picks up job
      | Fetches pipeline actions
      | Executes actions in order:
      |   Transform: reshape payload fields
      |   Filter: reject payload if conditions fail
      |   Enrich: add metadata, timestamps
      | For each subscriber:
      |   HTTP POST processed payload
      |   Record delivery result
      |   On failure: schedule retry with backoff
      v
   Job status: completed or failed
   Delivery status: delivered or failed
```

---

## Author

Muhammad Qzaih
- GitHub: [@muhammadqzaih](https://github.com/muhammadqzaih)

---

## License

This project is licensed under the ISC License.