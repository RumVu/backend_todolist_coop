# Cấu trúc Backend (NestJS + Prisma)

Hệ thống được thiết kế theo chuẩn **Modular Architecture** + **Repository Pattern**:

- **Controller Layer**: Tiếp nhận HTTP Request, chạy Guards, Pipes (Validate).
- **Service Layer**: Trái tim nghiệp vụ (Business Logic). Không được phép trực tiếp gọi ORM.
- **Repository Layer**: Trừu tượng hoá các câu lệnh thao tác Database (Prisma). Dễ test và dễ thay thế DB sau này.
- **Common Layer**: Nắm trọn hệ sinh thái Decorators, Guards, Pipes, Interceptors toàn cục.
