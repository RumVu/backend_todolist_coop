import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin User', description: 'Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'super_admin', description: 'Administrative role' })
  @IsString()
  @IsOptional()
  role?: string;
}
