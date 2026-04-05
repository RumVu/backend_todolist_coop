import { ApiProperty } from '@nestjs/swagger';

export class Report {
  @ApiProperty({ example: 'uuid-report-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Monthly Task Analysis', description: 'Title' })
  title: string;

  @ApiProperty({
    example: { totalTasks: 100, completed: 80 },
    description: 'Generated JSON data',
  })
  data: any;

  @ApiProperty({ example: 'uuid-author', description: 'Author user ID' })
  authorId: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Creation date',
  })
  createdAt: Date;
}
