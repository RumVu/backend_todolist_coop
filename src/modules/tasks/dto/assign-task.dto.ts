import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({
    description: 'ID của User được gán việc',
    example: 'uuid-user-123',
  })
  @IsNotEmpty()
  @IsUUID()
  assigneeId: string;
}
