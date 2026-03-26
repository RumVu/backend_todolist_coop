import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  @ApiProperty({ example: 's3cr3tPa$$' })
  password!: string;
}
