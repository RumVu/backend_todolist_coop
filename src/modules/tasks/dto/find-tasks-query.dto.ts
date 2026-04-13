import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class FindTasksQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'ID của Workspace/Group',
    example: '862a1991-01bf-40bd-87d4-3016abdf25ba',
  })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Alias cũ cho groupId dùng từ mobile client',
    example: '862a1991-01bf-40bd-87d4-3016abdf25ba',
  })
  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @ApiPropertyOptional({
    description: 'Alias cũ cho groupId',
    example: '862a1991-01bf-40bd-87d4-3016abdf25ba',
  })
  @IsOptional()
  @IsUUID()
  taskGroupId?: string;

  @ApiPropertyOptional({
    description: 'Alias dự phòng cho groupId',
    example: '862a1991-01bf-40bd-87d4-3016abdf25ba',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Alias text cho client cũ',
    example: '862a1991-01bf-40bd-87d4-3016abdf25ba',
  })
  @IsOptional()
  @IsString()
  workspace?: string;

  @ApiPropertyOptional({
    description: 'Group id đã được resolve từ các alias',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  get resolvedGroupId(): string {
    return (
      this.groupId ||
      this.workspaceId ||
      this.taskGroupId ||
      this.id ||
      this.workspace ||
      ''
    );
  }
}
