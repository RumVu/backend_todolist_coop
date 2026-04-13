# Test Cases & Verification Guide

Tài liệu này dùng để kiểm tra nhanh project theo 2 cách:

1. Chạy automated tests để xác minh build, unit, và e2e.
2. Chạy manual API scenarios để reviewer hoặc teammate tự thử các flow chính theo nhu cầu.

## 1. Prerequisites

- Node.js `>= 22`
- Docker / Docker Compose
- Port mặc định:
  - API: `6969`
  - PostgreSQL: `6699`
  - Redis: `6379`

## 2. Environment Setup

Khởi động hạ tầng local:

```bash
docker compose up -d
```

Cài dependencies, generate Prisma client, migrate và seed dữ liệu:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

Chạy ứng dụng:

```bash
npm run start:dev
```

Swagger UI:

```text
http://localhost:6969/api/docs
```

## 3. Automated Verification

Chạy theo thứ tự này nếu muốn xác minh toàn bộ project:

```bash
npm run build
npm test -- --runInBand
npm run test:e2e
npm run lint
```

Kỳ vọng:

| Command | Expected result |
| --- | --- |
| `npm run build` | Build thành công |
| `npm test -- --runInBand` | Toàn bộ unit/controller/service specs pass |
| `npm run test:e2e` | 4 e2e suites pass |
| `npm run lint` | Không có lint error |

Nếu muốn debug test e2e shutdown/open handles:

```bash
npm run test:e2e -- --detectOpenHandles
```

## 4. Seeded Accounts

Sau khi chạy seed hoặc e2e bootstrap, có thể dùng tài khoản admin mặc định:

```text
Email: admin@ex.com
Password: admin123
```

## 5. Response Envelope

Hầu hết API trả về dạng:

```json
{
  "statusCode": 200,
  "message": "Business message",
  "data": {}
}
```

Khi lỗi:

```json
{
  "statusCode": 400,
  "message": "Validation or business error",
  "errors": [],
  "timestamp": "2026-04-06T00:00:00.000Z"
}
```

## 6. Manual API Test Cases

### TC-01 Register a new user

- Endpoint: `POST /api/auth/register`
- Purpose: tạo tài khoản mới với role mặc định `user`

Request:

```json
{
  "email": "manual1@ex.com",
  "name": "Manual Tester",
  "username": "manualtester",
  "password": "secret123",
  "confirmPassword": "secret123",
  "phoneNum": "+84123456789"
}
```

Expected:

- HTTP `201`
- `message = "User registered successfully"`
- `tokens.accessToken` và `tokens.refreshToken` tồn tại

### TC-02 Login with existing account

- Endpoint: `POST /api/auth/login`

Request:

```json
{
  "email": "manual1@ex.com",
  "password": "secret123"
}
```

Expected:

- HTTP `201`
- `message = "Login successful"`
- nhận được `accessToken` và `refreshToken`

### TC-03 Get current profile

- Endpoint: `GET /api/auth/me`
- Header: `Authorization: Bearer <accessToken>`

Expected:

- HTTP `200`
- trả về đúng email vừa đăng nhập

### TC-04 Refresh token

- Endpoint: `POST /api/auth/refresh`

Request:

```json
{
  "refreshToken": "<refreshToken>"
}
```

Expected:

- HTTP `201`
- `message = "Token refreshed"`
- access token mới được cấp

### TC-05 Create a task group

- Endpoint: `POST /api/tasks-group`
- Header: `Authorization: Bearer <accessToken>`

Request:

```json
{
  "name": "Recruiter Demo Workspace",
  "description": "Workspace created during manual verification"
}
```

Expected:

- HTTP `201`
- trả về `id` của group

### TC-06 Create a task inside a group

- Endpoint: `POST /api/tasks`
- Header: `Authorization: Bearer <accessToken>`

Request:

```json
{
  "title": "Ship CV-ready backend",
  "description": "Manual verification task",
  "priority": "HIGH",
  "groupId": "<groupId>"
}
```

Expected:

- HTTP `201`
- task được tạo với `status = "TODO"` hoặc giá trị mặc định hiện tại

Payload có thể gửi:

```json
{
  "title": "Ship CV-ready backend",
  "description": "Manual verification task",
  "priority": "HIGH",
  "status": "TODO",
  "groupId": "<groupId>"
}
```

### TC-07 List tasks by group

- Endpoint: `GET /api/tasks?groupId=<groupId>`
- Header: `Authorization: Bearer <accessToken>`

Expected:

- HTTP `200`
- `data` là mảng
- chứa task đã tạo ở TC-06

Các alias hiện backend cũng chấp nhận:

- `GET /api/tasks?workspaceId=<groupId>`
- `GET /api/tasks?taskGroupId=<groupId>`
- `GET /api/tasks?id=<groupId>`

### TC-07A Update task status and verify persistence

- Endpoint: `PATCH /api/tasks/:id`
- Header: `Authorization: Bearer <accessToken>`

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

Expected:

- HTTP `200`
- `data.status = "IN_PROGRESS"`
- gọi lại `GET /api/tasks/:id` vẫn phải thấy `status = "IN_PROGRESS"`
- gọi lại `GET /api/tasks?groupId=<groupId>` vẫn phải thấy task đó có `status = "IN_PROGRESS"`

### TC-08 Admin creates a user

- Login bằng admin seed account trước
- Endpoint: `POST /api/users`
- Header: `Authorization: Bearer <adminAccessToken>`

Request:

```json
{
  "email": "reviewer-user@ex.com",
  "name": "Reviewer User",
  "username": "revieweruser",
  "phoneNum": "+84987654321",
  "password": "secret123"
}
```

Expected:

- HTTP `201`
- user mới được tạo

### TC-09 Admin reads and updates user

- Endpoint:
  - `GET /api/users`
  - `GET /api/users/:id`
  - `PATCH /api/users/:id`

Update payload:

```json
{
  "name": "Reviewer User Updated"
}
```

Expected:

- list user thành công
- lấy chi tiết đúng theo `id`
- update trả về tên mới

### TC-10 Negative cases

Các case nên thử thêm khi review:

- Register với `confirmPassword` không khớp -> kỳ vọng `400`
- Gọi `/api/auth/me` không có bearer token -> kỳ vọng `401`
- Gọi `/api/users` bằng token user thường -> kỳ vọng `403`
- Gọi `/api/tasks?groupId=...` với group không thuộc user -> kỳ vọng `403` hoặc `404` tuỳ trạng thái dữ liệu

## 7. Automated Coverage Map

Automated tests hiện cover các flow chính sau:

| Area | Coverage |
| --- | --- |
| App bootstrap | Redirect root sang docs |
| Auth | register, login, me, refresh, logout |
| Users | admin create/list/get/update/delete |
| Workflow | register -> create group -> create task -> list task |

## 8. Reviewer Shortcuts

Nếu chỉ có 2-3 phút để review project:

1. Chạy `npm run build`
2. Chạy `npm run test:e2e`
3. Mở `http://localhost:6969/api/docs`
4. Thử `POST /api/auth/login` với `admin@ex.com / admin123`
5. Thử `GET /api/users` với bearer token admin
