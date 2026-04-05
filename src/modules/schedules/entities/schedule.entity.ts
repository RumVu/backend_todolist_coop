import { ApiProperty } from '@nestjs/swagger';

export class Schedule {
  @ApiProperty({ example: 'uuid-sched-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({ example: 'uuid-task', description: 'Associated task ID' })
  taskId: string;

  @ApiProperty({ example: '2023-12-31T09:00:00Z', description: 'When to remind' })
  remindAt: Date;

  @ApiProperty({ example: 'EMAIL', description: 'Notification channel' })
  type: string;

  @ApiProperty({ example: false, description: 'Whether the reminder has been processed' })
  isProcessed: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;
}
