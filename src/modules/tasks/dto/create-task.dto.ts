import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID của danh sách công việc (Group)',
    example: 'uuid-group-123',
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @ApiProperty({ description: 'Tiêu đề công việc', example: 'Viết API Tasks' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Mô tả chi tiết', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Hạn chót công việc', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    description: 'Độ ưu tiên',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Trạng thái công việc',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ description: 'Ai làm', required: false })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
