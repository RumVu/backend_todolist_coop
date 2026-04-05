import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(80)
  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  @ApiPropertyOptional({ example: '+84123456789' })
  phoneNum?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @ApiProperty({ example: 'janedoe' })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  @ApiProperty({ example: 's3cr3tPa$$' })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  @ApiProperty({ example: 's3cr3tPa$$' })
  confirmPassword!: string;
}
