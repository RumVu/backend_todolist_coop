import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { APP_DEFAULTS } from '../constants/app.constant';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: APP_DEFAULTS.PAGINATION.DEFAULT_PAGE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = APP_DEFAULTS.PAGINATION.DEFAULT_PAGE;

  @ApiProperty({ required: false, default: APP_DEFAULTS.PAGINATION.DEFAULT_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_DEFAULTS.PAGINATION.MAX_LIMIT)
  limit?: number = APP_DEFAULTS.PAGINATION.DEFAULT_LIMIT;

  @ApiProperty({ required: false, description: 'Search term for query' })
  @IsOptional()
  @IsString()
  search?: string;
}
