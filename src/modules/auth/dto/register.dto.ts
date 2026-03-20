import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  email!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(80)
  name!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phoneNum?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  confirmPassword!: string;
}
