import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTasksGroupDto {
  @ApiProperty({ description: 'Tên của danh sách công việc', example: 'Dự án Mobile App' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả chi tiết', example: 'Viết API cho mobile, deal deadline T10', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
