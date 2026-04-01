# OpenAPI Specification
Toàn bộ tài liệu quy chuẩn API của hệ thống tự động sinh bởi `@nestjs/swagger`.
Bạn có thể mở giao diện tương tác (Swagger UI) để test trực tiếp tại: 
**`http://localhost:6969/api/docs`**

## Cấu Hình Swagger Decorators:
- Dùng `@ApiTags()` ở trước mỗi file Controller.
- Dùng `@ApiOperation({ summary: 'Mô tả ngắn' })` đằng trước endpoint.
- Gắn thẻ `@ApiBearerAuth()` để xuất hiện biểu tượng khoá bảo vệ (Yêu cầu JWT Guard Token).
- Các Class DTO được sử dụng `@ApiProperty` để Swagger nhặt tham số dựng Request Body Model.
