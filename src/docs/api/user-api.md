# Core USER APIs

## 1. /api/auth/* (Bất biến)
- `POST /login`: Lấy AccessToken & RefreshToken.
- `POST /register`: Tạo Account mới có mã UUID.
- `POST /refresh`: Làm mới token tự động.

## 2. /api/users/* (Tuỳ biến)
- `GET /me`: Trả về Profile.
- `PATCH /profile`: Đổi Name. Đi qua Pipe TrimStringPipe để dẹp dấu cách thừa. Cấm đổi Email.

## 3. /api/tasks-group/* (Group Workspaces)
- `POST /`: Nhả về ID Group mới do mình trị vì.
- `GET /`: Danh sách list task.

## 4. /api/tasks/* (Tasks Items)
- `POST /`: Phải kèm GroupID.
- Thao tác chi tiết qua ID UUID với Guard kiểm tra `Chính Xác User Đang Trỏ` so với Chủ, Editor hoặc Người giao Việc. Cấm tiệt Viewer.
