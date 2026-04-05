# 📊 Coop Backend - Enterprise TodoList & Management System

A high-performance, scalable backend built with **NestJS 11** and **Prisma**, designed for collaborative task management and administrative oversight. This project demonstrates a production-grade architecture featuring JWT authentication, Role-Based Access Control (RBAC), and background job processing.

---

## 🛠️ Tech Stack & Infrastructure

- **Framework**: [NestJS](https://nestjs.com/) (V11) - Scalable Node.js architecture.
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/).
- **Cache & Queue**: [Redis](https://redis.io/) + [BullMQ](https://github.com/OptimalBits/bull) for high-reliability background jobs.
- **Security**: [Passport.js](https://www.passportjs.org/) + [JWT](https://jwt.io/) (Access / Rotation Refresh Tokens).
- **Validation**: [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer).
- **Documentation**: [Swagger / OpenAPI](https://swagger.io/) via `@nestjs/swagger`.
- **Infrastructure**: [Docker](https://www.docker.com/) & [Docker Compose].

---

## ✨ Key Features

### 🔐 Advanced Security & Auth
- **JWT Authentication**: Secure login with short-lived access tokens and persistent refresh token rotation.
- **RBAC (Role-Based Access Control)**: Granular permissions enforced via guards (`JwtAuthGuard`, `RolesGuard`, `AdminGuard`).
- **User Groups**: Collaborative workspaces where members can be assigned specific roles (Owner, Member).

### 📋 Task & Project Management
- **Hierarchical Tasks**: Organize tasks within Groups/Projects.
- **Priority & Status**: Real-time tracking of task states (TODO, IN_PROGRESS, DONE) and priorities (LOW to URGENT).
- **Reminders & Schedules**: Background notification system powered by Redis and Bull.

### 🛡️ Administrative Control Plane
Dedicated `/api/admin` namespace for system governance:
- **Real-time Analytics**: Dashboard stats for global task completion rates and user activity.
- **System Settings**: Hot-swappable global configuration (Maintenance mode, feature toggles).
- **Moderation**: Full oversight of system-wide tasks, reports, and user accounts.

---

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+

### 2. Infrastructure Setup
Spin up the database and Redis cache:
```bash
docker compose up -d
```

### 3. Application Setup
```bash
# Install dependencies
npm install

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate dev

# Seed Initial Data (Roles, Permissions, Admin User)
npx prisma db seed
```

### 4. Running the App
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 5. API Documentation
Once running, visit the interactive Swagger UI at:  
👉 `http://localhost:6969/api/docs`

---

## 🧪 Testing

The project maintains a healthy testing suite focused on core business logic:
- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`

---

## 📁 System Architecture Overview

```text
src/
├── common/           # Global guards, filters, decorators, Prisma service
├── config/           # Centralized configuration (Auth, DB, Redis)
├── modules/          # Domain-driven modules
│   ├── auth/         # Login, Register, Token rotation logic
│   ├── admin/        # Administrative sub-modules and dashboards
│   ├── tasks/        # Core task CRUD and assignment logic
│   ├── notifications/# Redis/Bull background job processing
│   └── ...           # Roles, Permissions, Schedules, Files, etc.
└── main.ts           # Bootstrapping with Swagger and Global Pipes
```
