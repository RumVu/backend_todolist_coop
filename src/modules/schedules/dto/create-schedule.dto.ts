import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ description: 'The ID of the task this reminder belongs to' })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({ description: 'When to send the reminder' })
  @IsDateString()
  @IsNotEmpty()
  remindAt: string;

  @ApiProperty({
    description: 'Type of reminder (EMAIL, WEBSOCKET)',
    default: 'EMAIL',
  })
  @IsString()
  @IsOptional()
  type?: string;
}
