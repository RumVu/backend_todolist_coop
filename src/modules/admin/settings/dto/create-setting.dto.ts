import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({ example: 'auth.bcryptSaltRounds', description: 'Unique setting key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: '10', description: 'Setting value as string' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'Rounds for password hashing', description: 'Optional description' })
  @IsString()
  @IsOptional()
  description?: string;
}
