import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @MinLength(5)
    @MaxLength(80)
    @ApiProperty({ example: 'user@example.com' })
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    @ApiProperty({ example: 'Jane Doe' })
    name!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @ApiProperty({ example: 'janedoe' })
    username!: string;

    @IsOptional()
    @IsString()
    @MinLength(7)
    @MaxLength(20)
    @ApiProperty({ example: '+84123456789', required: false })
    phoneNum?: string;
}
