import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({ example: 1 })
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({ example: 10 })
    limit?: number;
}
