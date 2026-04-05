import { ApiProperty } from '@nestjs/swagger';

export class Report {
  @ApiProperty({ example: 'uuid-report-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Admin Global Analysis', description: 'Title' })
  title: string;

  @ApiProperty({ example: { totalUsers: 100, active: 80 }, description: 'Administrative report data' })
  data: any;

  @ApiProperty({ example: 'uuid-admin', description: 'Admin user ID' })
  authorId: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;
}
