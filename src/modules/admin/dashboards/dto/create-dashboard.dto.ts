import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateDashboardDto {
  @ApiProperty({ example: 'Main Admin View', description: 'Dashboard title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: { layout: 'grid', theme: 'dark' },
    description: 'Dashboard configuration',
  })
  @IsObject()
  @IsOptional()
  config?: any;
}
