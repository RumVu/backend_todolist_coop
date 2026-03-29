import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Trạng thái hoạt động của tài khoản (Cho phép Admin Ban / Unban)', required: false })
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Danh sách quyền (roles) của tài khoản (Cho phép Admin thăng chức / giáng chức)', required: false })
  roles?: string[];
}
