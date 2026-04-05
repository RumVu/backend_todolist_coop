import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsUUID, IsOptional } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'Project Analysis', description: 'Title of the report' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: { totalTasks: 50, completed: 40 }, description: 'JSON report data' })
  @IsObject()
  @IsNotEmpty()
  data: any;

  @ApiProperty({ example: 'uuid-author', description: 'Author user ID', required: false })
  @IsUUID()
  @IsOptional()
  authorId?: string;
}
