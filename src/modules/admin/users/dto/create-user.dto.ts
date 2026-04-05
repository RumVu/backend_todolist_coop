import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Admin User', description: 'Real name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin_user', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@ex.com', description: 'Unique email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Temporary password' })
  @IsString()
  @MinLength(6)
  password: string;
}
