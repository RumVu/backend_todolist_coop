# Bách Khoa Toàn Thư: Backend TodoList Co-op Capabilities

Tài liệu này tổng hợp **danh mục sức mạnh** hiện tại của toàn bộ hệ thống Backend. Được xây dựng trên nền tảng **NestJS**, **Prisma**, **PostgreSQL** và **Redis**, hệ thống không chỉ dừng ở REST API cơ bản mà còn sở hữu kiến trúc Microservices & Real-time ở đẳng cấp Production.

---

## 🔐 1. Lõi Bảo Mật Xác Thực (Auth & Security Core)
- **JWT Authentication Flow**: Access Token (1h) & Refresh Token (7d). Có khả năng làm mới phiên đăng nhập thông minh (`/auth/refresh`).
- **State Recovery (`/auth/me`)**: Lấy lại toàn bộ thông tin User, Quyền hạn (Roles, Permissions) tức khắc khi F5 web.
- **RBAC (Role-Based Access Control)**:
  - `AdminGuard`: Giới hạn truy cập cho vai trò Super Admin (Vào màn hình Dashboard thống kê).
  - `RolesGuard` & `JwtAuthGuard`: Được cấu hình toàn diện.
- **Thực thể Bảo vệ Toàn Cầu**:
  - `ThrottlerGuard`: Chống DDoS tự động, giới hạn **100 Requests/phút** cho mỗi IP.
  - `WsJwtGuard`: Bảo vệ cả cổng Socket.IO, đá ngay các kết nối Websocket không truyền Token hợp lệ.

## 👥 2. Hệ Quản Trị Tổ Chức (Workspaces & Group Management)
- **Cấu Trúc Phân Cấp (Hierarchy)**: `Owner` > `Admin` > `Editor` > `Viewer`.
- **Tạo và Quản lý Group**: Hỗ trợ tạo không gian làm việc tách biệt.
- **Nghiệp vụ Mời Đồng Đội (`/tasks-group/:id/members`)**: Thêm người qua Email. Không cho phép cướp quyền Owner.
- **Nghiệp vụ Xoá Nợ (Kick/Promote)**: Hệ thống logic khắt khe chỉ cho phép Owner phong chức cho người khác, Owner hoặc Admin mới có quyền Kick thành viên quậy phá. Tránh tình trạng Admin kick lẫn nhau.

## 📝 3. Hệ Điều Hành Công Việc (Tasks Engine)
- **Full CRUD Entity**: Tạo (Create), Xem lưới lọc (Read), Cập nhật (Update), Bẻ lái sang người khác (Assign). 
- **Siêu Phân Trang (Pagination & Querying)**: Khả năng lấy dữ liệu phân đoạn (`skip`/`take`) thông qua `PaginationQueryDto` với các tham số siêu cấp `?page=1&limit=10&search...`. Cực kỳ tiết kiệm RAM của CSDL khi số lượng Lịch trình vượt mốc hàng triệu records.

## 🚀 4. Hệ Thống Động Cơ Tức Thời (Real-Time WebSockets)
- **Giao thức ws://**: Tích hợp Socket.io ở dải cổng `http://localhost:6969/realtime`.
- **Room Booking (`joinGroup`)**: Tự động đưa Frontend vào đúng "đường hầm" Group mà họ đang coi. Tách biệt hoàn toàn tín hiệu của Group A với Group B.
- **Live Event Sync**: Khi Tasks được Prisma lưu thành công vào CSDL (Qua hàm Create/Update/Delete), Backend lập tức kích hoạt súng Emit (`taskCreated`, `taskUpdated`, `taskDeleted`) bắn thẳng dữ liệu "tươi" sang Frontend của các thành viên khác để tự reload mà không cần Load lại trang.

## 📨 5. Tầng Nhiệm Vụ Ngầm (Queue & Microservices)
- **Hàng đợi Redis (BullMQ)**: Trang bị `email-queue`. Đối với các hành động tốn I/O lớn như Gửi Email Bàn Giao Việc (SendGrid/Nodemailer), tiến trình sẽ được vứt sang chạy nền thay vì làm kẹt REST API.
- **NestJS Microservices Hybrid**: Backend không chỉ chạy HTTP Server thông thường mà còn "lắng nghe bằng tai" qua cầu nối **Redis Transporter** (`Transport.REDIS`). Sẵn sàng đoán nhận các tín hiệu `MessagePattern` (`ping_check`) hoặc `EventPattern` từ các dự án Microservices đàn em.

## 📁 6. Hệ Thống Kho Bãi (Storage & Uploads)
- **Multer Integration**: API `/files/upload` cho phép bốc tệp đính kèm lên máy chủ Server (Giới hạn tối đa 5MB, format .png/.jpg/.gif).
- **Static Assets Serving**: Trực tiếp cung cấp URL lưu trữ đường dẫn ảnh từ thư mục nội bộ (e.g., `http://localhost:6969/uploads/avatar.png`) thông qua `NestExpressApplication`.

## ✨ 7. Lớp Phủ Sơn Cao Cấp (Interceptors & Filters)
- Hệ thống Response được bọc thép bởi `ResponseInterceptor`: Cứ API nào gọi là chắc kèo trải đúng JSON chuẩn `{ statusCode, message, data }`.
- `HttpExceptionFilter`: Đón lõng toàn bộ lỗi từ Prisma hoặc Class-validator, biến nó thành cấu trúc Error JSON gọn gàng, có giấu Stack trace đàng hoàng khi lên Production.
- `TrimStringPipe`: Quét tự động cắt cúp các chuỗi string dư thừa do người dùng gõ khoảng trắng ở đầu hoặc cuối.

## 🐳 8. Quái Vật Đóng Gói (DevOps & CI/CD)
- **Github Actions (CI)**: Tiến trình Robot dò mìn tự động sẽ chọc vào Github Repository mỗi khi có Push/PR. Tiến hành `npm i`, xả `npm run lint` để kiểm tra Code sạch, gõ lệnh biên dịch tĩnh `npx tsc`, cuối cùng quạt qua `npx jest` để chắc chắn không một API nào gãy.
- **Docker Compose**: Với file cấu hình tinh xảo, gõ `docker compose up -d` ➡️ Sinh ra Mạng Lưới Nội Bộ ➡️ Khởi động CSDL PostgreSQL 15 ➡️ Khởi động cỗ máy nhắn tin Redis 7 ➡️ Bật app NestjS ➡️ Kết nối ngầm tự động trong 30 giây.
- **Prisma Migrations**: Quản trị bằng tay lịch sử Table CSDL `prisma/migrations`. Giúp chuyển môi trường an toàn và "Trôi Về Quá Khứ" lập tức khi cấu trúc Model gãy.

---
> Kết luận: Đây không còn là Backend - Đây là Tổ Hợp Công Tác Phân Tán (Distributed Co-op Engine)! Mọi luồng API chạy ở mức độ mượt mà nhất. 🌟
