import { ApiProperty } from '@nestjs/swagger';

export class TasksGroup {
  @ApiProperty({ example: 'uuid-group-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'Work Tasks', description: 'Name of the task list' })
  name: string;

  @ApiProperty({ example: 'Professional and team-related tasks', description: 'Optional description', required: false })
  description?: string;

  @ApiProperty({ example: 'uuid-owner', description: 'The user who owns this group' })
  ownerId: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update date' })
  updatedAt: Date;
}
