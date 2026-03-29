import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfileDto extends PartialType(PickType(CreateUserDto, ['name', 'phoneNum'] as const)) {
  // Chỉ cho phép người dùng tự đổi Tên hiển thị và Số điện thoại.
  // Các field nhạy cảm như email, username, password, roles, isActive bị chặn đứt.
}
