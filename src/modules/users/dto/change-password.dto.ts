import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Mật khẩu hiện tại của bạn' })
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải dài ít nhất 6 ký tự' })
  @MaxLength(100)
  @ApiProperty({ description: 'Mật khẩu mới' })
  newPassword!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Xác nhận lại mật khẩu mới' })
  confirmNewPassword!: string;
}
