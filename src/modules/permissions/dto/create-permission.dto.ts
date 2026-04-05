import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'users:read',
    description: 'Unique name of the permission',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Allows reading user profiles',
    description: 'Description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
