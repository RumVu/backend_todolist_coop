# Backend TodoList Co-op Capabilities

This document provides a comprehensive overview of the current backend system's capabilities. Built on **NestJS**, **Prisma**, **PostgreSQL**, and **Redis**, the system is designed to provide professional-grade REST APIs, real-time synchronization, and microservices integration.

---

## 1. Authentication and Security Core
- **JWT Authentication Flow**: Access Tokens (1h) and Refresh Tokens (7d) implementation with automated token rotation (`/auth/refresh`).
- **State Recovery (`/auth/me`)**: Instant retrieval of user profile, roles, and permissions to maintain application state.
- **RBAC (Role-Based Access Control)**:
    - `AdminGuard`: Restricts access to administrative and reporting dashboards.
    - `RolesGuard` & `JwtAuthGuard`: Global and route-level protection.
- **Global Security Middlewares**:
    - `ThrottlerGuard`: Built-in DDoS protection, limiting requests to **100 requests per minute** per IP.
    - `WsJwtGuard`: Token validation enforced on the WebSocket gateway.

## 2. Organization and Group Management
- **Hierarchical Permission Structure**: Implementation of `Owner`, `Admin`, `Editor`, and `Viewer` roles.
- **Workspace Management**: Logical separation of collaborative spaces (Groups).
- **Member Management (`/tasks-group/:id/members`)**: Email-based invitations and permission management.
- **Access Logic**: Strict enforcement of group management rules (Kick/Promote) only accessible to permitted roles (Owner/Admin).

## 3. Task Management Engine
- **Full CRUD Entity Operations**: Standardized Task lifecycle management (Create, Read, Update, Delete/Remove).
- **Advanced Pagination and Querying**: Efficient data retrieval using `PaginationQueryDto` with support for `page`, `limit`, and search parameters. Optimized for processing high volumes of records.

## 4. Real-Time Synchronization
- **WebSocket Integration**: Socket.io implementation on the `/realtime` namespace.
- **Room Isolation (`joinGroup`)**: Dynamic room joining to ensure users only receive updates relevant to their active group.
- **Live Event Sync**: Immediate emission of synchronization events (`taskCreated`, `taskUpdated`, `taskDeleted`) upon database changes to ensure consistent state across all clients.

## 5. Background Tasks and Microservices
- **Redis Queueing (BullMQ)**: Background processing for resource-intensive tasks (e.g., email notifications) to maintain API responsiveness.
- **Hybrid Microservice Architecture**: Support for inter-service communication through **Redis Transporter** (`Transport.REDIS`). Implementation of `MessagePattern` and `EventPattern` for modular architecture.

## 6. File and Storage Management
- **Multer Integration**: Secure file upload API (`/files/upload`) with strict validation (File size limit: 5MB, supported formats: .png, .jpg, .gif).
- **Static Assets Serving**: Efficient serving of uploaded assets (e.g., user avatars) directly via `NestExpressApplication`.

## 7. Global Optimization and Filters
- **Standardized Responses**: `ResponseInterceptor` ensures consistent JSON response structure (`{ statusCode, message, data }`).
- **Exception Filtering**: `HttpExceptionFilter` transforms system and database exceptions into clean, user-friendly JSON responses while masking sensitive stack traces in production.
- **Automated Data Sanitization**: `TrimStringPipe` automatically trims whitespace from incoming request strings.

## 8. Deployment and DevOps
- **CI/CD Integration**: GitHub Actions workflows for automated testing, linting (`npm run lint`), and build verification (`npx tsc`).
- **Containerization (Docker Compose)**: Full environment orchestration including PostgreSQL, Redis, and the NestJS application with automated network discovery and connectivity.
- **Database Migrations**: Managed database schema versioning through Prisma Migrations to ensure consistent environments.

---

*Conclusion: The Backend Coop platform is a robust, distributed engine designed for performance, security, and collaborative workflow management.*


first, we need to access the terminal by that code: npm start:dev
second,we need to access the terminal by that code: npx --yes cloudflared tunnel --url http://localhost:6969
third,we need to access the browser by that code: https://localhost:6969