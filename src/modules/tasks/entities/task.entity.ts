import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 'uuid-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Buy groceries', description: 'Task title' })
  title: string;

  @ApiProperty({
    example: 'Milk, Eggs, Bread',
    description: 'Task description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'TODO', description: 'Current status' })
  status: string;

  @ApiProperty({ example: 'MEDIUM', description: 'Priority level' })
  priority: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Due date',
    required: false,
  })
  dueDate?: Date;

  @ApiProperty({
    example: 'uuid-group',
    description: 'The group this task belongs to',
  })
  groupId: string;

  @ApiProperty({
    example: 'uuid-creator',
    description: 'The user who created this task',
  })
  creatorId: string;

  @ApiProperty({
    example: 'uuid-assignee',
    description: 'The user assigned to this task',
    required: false,
  })
  assigneeId?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
