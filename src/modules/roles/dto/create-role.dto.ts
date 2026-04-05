import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Full system access',
    description: 'Description of the role',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['users:read', 'tasks:write'],
    description: 'Array of permission names or IDs to link to this role',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionNames?: string[];
}
