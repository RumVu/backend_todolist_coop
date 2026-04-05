import { ApiProperty } from '@nestjs/swagger';

export class Dashboard {
  @ApiProperty({ example: 'uuid-dash-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Main Admin Dashboard', description: 'Dashboard title' })
  title: string;

  @ApiProperty({ example: { widgets: ['users', 'tasks'] }, description: 'Dashboard configuration' })
  config: any;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;
}
