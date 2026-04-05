import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponse {
  @ApiProperty({ example: 'job-12345', description: 'Internal job ID from the Redis queue' })
  jobId: string;

  @ApiProperty({ example: 'Email queued successfully', description: 'Status message' })
  message: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'When the request was processed' })
  timestamp: Date;
}
