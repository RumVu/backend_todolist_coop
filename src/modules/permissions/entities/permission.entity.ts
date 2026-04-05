import { ApiProperty } from '@nestjs/swagger';

export class Permission {
  @ApiProperty({ example: 'uuid-perm-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'users:read', description: 'Unique permission name' })
  name: string;

  @ApiProperty({ example: 'Read access to user profiles', description: 'Optional description', required: false })
  description?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update date' })
  updatedAt: Date;
}
