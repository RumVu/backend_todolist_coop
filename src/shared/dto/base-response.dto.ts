import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Message status', example: 'Success' })
  message: string;

  @ApiProperty({ description: 'Response payload data' })
  data: T;
}
