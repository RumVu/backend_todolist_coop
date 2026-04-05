import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ example: 'uuid-role-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'admin', description: 'The unique role name' })
  name: string;

  @ApiProperty({ example: 'Full system management access', description: 'Optional description', required: false })
  description?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update date' })
  updatedAt: Date;
}
