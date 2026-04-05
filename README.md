# Coop Backend

NestJS + Prisma backend cho hệ thống quản lý công việc cộng tác. Project tập trung vào các flow đủ mạnh để demo năng lực backend thực chiến: JWT auth, RBAC, quản lý user, workspace/task, validation, Swagger, unit tests và e2e tests với PostgreSQL thật.

## What this project shows

- Xây dựng API theo module với NestJS 11
- Prisma + PostgreSQL cho dữ liệu nghiệp vụ
- JWT access/refresh token flow
- RBAC với `admin` và `user`
- Workspace (`tasks-group`) + task CRUD flow
- Swagger docs tại `/api/docs`
- Unit test và e2e test để verify luồng chính

## Tech Stack

- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT / Passport
- class-validator / class-transformer
- Swagger / OpenAPI
- Jest / Supertest

Redis, Bull, WebSocket, Schedule modules vẫn có mặt trong codebase để mở rộng, nhưng luồng core hiện tại không còn phụ thuộc Redis để build và test local.

## Quick Start

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Install and prepare database

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 3. Run the server

```bash
npm run start:dev
```

Server mặc định:

```text
http://localhost:6969
```

Swagger:

```text
http://localhost:6969/api/docs
```

## Test & Verification

Các lệnh verify chính:

```bash
npm run build
npm test -- --runInBand
npm run test:e2e
npm run lint
```

Tài liệu test case chi tiết:

- [src/docs/testing/test-cases.md](/Users/rumvu/Documents/backend_todolist/backend_todolist_coop/src/docs/testing/test-cases.md)

## GitHub Checklist

Trước khi public repo:

- dùng `.env.example` thay vì đẩy file `.env` thật
- bảo đảm đã commit `package-lock.json`
- không commit `node_modules/`, `dist/`, `coverage/`
- thêm screenshots Swagger hoặc sequence test nếu muốn repo nổi bật hơn trên CV

## Seeded Admin Account

```text
Email: admin@ex.com
Password: admin123
```

## Main API Areas

- `/api/auth`: register, login, refresh, logout, me
- `/api/users`: admin CRUD + profile/password flows
- `/api/tasks-group`: workspace/group management
- `/api/tasks`: task CRUD, assignment, listing by group
- `/api/admin/*`: admin-facing modules

## Project Structure

```text
src/
├── app.module.ts
├── app.setup.ts
├── common/
├── config/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tasks/
│   ├── tasks_group/
│   ├── admin/
│   └── ...
└── docs/
```

## Verified Status

Tại thời điểm cập nhật README này, project đã được verify với:

- `npm run build`
- `npm test -- --runInBand`
- `npm run test:e2e`
- `npm run lint`

## Notes

- File `.env` local đang trỏ tới PostgreSQL tại `localhost:6699`
- Root path `/` redirect sang `/api/docs`
- Response API dùng envelope chung: `statusCode`, `message`, `data`
