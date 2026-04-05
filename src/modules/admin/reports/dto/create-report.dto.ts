import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'Monthly Task Summary', description: 'Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: { totalTasks: 100, completedTasks: 80 },
    description: 'Report raw data as JSON',
  })
  @IsObject()
  @IsNotEmpty()
  data: any;

  @ApiProperty({ example: 'author-uuid', description: 'User ID of the author' })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
