import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  @ApiProperty({ required: false, example: '+84123456789' })
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
