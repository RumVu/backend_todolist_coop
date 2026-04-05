import { ApiProperty } from '@nestjs/swagger';

export class Admin {
  @ApiProperty({ example: 'uuid-admin-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Super User', description: 'Admin name' })
  name: string;

  @ApiProperty({ example: 'admin@system.com', description: 'Admin email' })
  email: string;

  @ApiProperty({ example: 'MANAGER', description: 'Administrative role level' })
  role: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Creation date',
  })
  createdAt: Date;
}
