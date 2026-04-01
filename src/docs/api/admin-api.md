# Core ADMIN APIs (Yêu cầu `RolesGuard(Role.ADMIN)`)

## 1. /api/admin/users
- `GET /`: Trả mảng User + Pagination (page, limit) thông qua `PaginationQueryDto`.
- `PATCH /:id/toggle-lock`: Đóng rầm (ban) tài khoản. Đổi cờ `isActive`.
- `PATCH /:id/roles`: Uỷ quyền tài khoản hoặc Giáng chức.

## 2. /api/admin/system
- `GET /health-check`: Trả về tài nguyên máy. Đã tích hợp `$queryRawUnsafe('SELECT 1')` check Prisma.
- `GET /stats`: Count() Group, Task..
