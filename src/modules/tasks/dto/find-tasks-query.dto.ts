import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class FindTasksQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'ID của Workspace/Group',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  groupId!: string;
}
