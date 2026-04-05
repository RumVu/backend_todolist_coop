import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MemberRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export class AddMemberDto {
  @ApiProperty({
    description: 'Email của người dùng muốn mời vào nhóm',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Vai trò (Quyền hạn) trong nhóm',
    enum: MemberRole,
    default: MemberRole.EDITOR,
  })
  @IsEnum(MemberRole)
  role: MemberRole;
}
