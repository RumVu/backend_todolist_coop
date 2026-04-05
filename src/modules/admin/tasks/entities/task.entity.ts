import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 'uuid-task-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({
    example: 'Complete Project Documentation',
    description: 'Task title',
  })
  title: string;

  @ApiProperty({ example: 'TODO', description: 'Status' })
  status: string;

  @ApiProperty({ example: 'MEDIUM', description: 'Priority' })
  priority: string;

  @ApiProperty({ example: 'uuid-group', description: 'Group ID' })
  groupId: string;

  @ApiProperty({ example: 'uuid-user', description: 'Creator ID' })
  creatorId: string;

  @ApiProperty({
    example: 'uuid-assignee',
    description: 'Assignee ID',
    required: false,
  })
  assigneeId?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Creation date',
  })
  createdAt: Date;
}
