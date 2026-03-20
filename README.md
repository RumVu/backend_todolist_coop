# Backend TodoList

Backend API built with NestJS for a TodoList-style system. The codebase currently exposes a small working surface for authentication and health checks, while several other modules remain scaffolded for future implementation.

## Current status

- Working modules: `health`, `auth`
- Scaffolded modules: `tasks`, `users`, `roles`, `permissions`, `reports`, `schedules`, `tasks_group`, and several `admin/*` modules
- Persistence: in-memory repository for auth users
- Authentication: simple bearer token generated from user id and email

## Requirements

- Node.js 20+ recommended
- npm 10+

## Setup

```bash
npm install
```

## Run locally

```bash
npm run start:dev
```

The server listens on `http://localhost:3000` by default.

## Available endpoints

### Root

- `GET /` -> returns `Hello World!`

### Health

- `GET /health`
- `GET /health/:id`
- `DELETE /health/:id`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Example auth payloads

### Register

```json
{
  "email": "tester@example.com",
  "name": "Tester",
  "username": "tester01",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

### Login

```json
{
  "email": "tester@example.com",
  "password": "secret123"
}
```

To call `GET /auth/me`, send the token returned by register or login:

```http
Authorization: Bearer <accessToken>
```

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run lint
npm run test
npm run test:e2e
```

## Testing

```bash
npm test
npm run test:e2e
```

Current automated coverage includes:

- unit tests for `AuthService`
- controller/module smoke tests
- e2e tests for root, auth, and health routes

## Next recommended steps

- replace the in-memory auth repository with a real database layer
- replace the current token format with real JWT access and refresh tokens
- mount and implement the scaffolded business modules
- add Swagger or OpenAPI documentation once the routes stabilize
