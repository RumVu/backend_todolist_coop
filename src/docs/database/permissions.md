# Ma trận Phân quyền (Permissions)

## 1. Global Roles (User.roles)
- `admin`: Quyền quản trị tối cao của ứng dụng. Có thể thao tác tất cả API, khoá tài khoản, xem logs.
- `editor`: Quyền nhân viên / Quản lý dự án. Có thể truy cập chức năng bình thường.
- `viewer`: Có thể đọc tin tức, xem nội dung công khai.

## 2. Group Roles (GroupMember.role)
- `admin`: Tương đương Owner trong nhóm. (Được đổi tên Group, xoá Group, Mời người).
- `editor`: Thuộc nhóm, có thể Tạo Task, Cập nhật tiến độ Task, Giao việc. Không được mời người.
- `viewer`: Chỉ nhìn thấy Task, hoàn toàn không được chỉnh sửa hay tick hoàn thành.
