# Cấu trúc Data Models

1. **User Model**: Quản lý tài khoản (Auth/JWT), nắm mật khẩu và Global Role.
2. **RefreshToken Model**: Lưu thông tin phiên đăng nhập. (Có cờ Revoke dùng để Force Log-out).
3. **TaskGroup Model**: Đại diện cho 1 dự án (Project/Workspace). Sinh ra bởi 1 Owner.
4. **GroupMember Model**: Bảng pivot (N-N) kết nối User vào Group kèm theo Role (Nhóm quyền).
5. **Task Model**: Công việc con nằm trong Group. Được gắn vòng đời (TODO -> IN_PROGRESS -> DONE). Mức độ khẩn cấp (LOW, MEDIUM, HIGH). Đính kèm người tạo `creatorId` và người thực thi `assigneeId`.
