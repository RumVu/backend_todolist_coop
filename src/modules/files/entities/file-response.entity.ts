import { ApiProperty } from '@nestjs/swagger';

export class FileResponse {
  @ApiProperty({
    example: 'Successfully uploaded',
    description: 'Status message',
  })
  message: string;

  @ApiProperty({
    example: {
      url: 'http://localhost:3000/uploads/uuid-filename.png',
      filename: 'uuid-filename.png',
      mimetype: 'image/png',
      size: 51200,
    },
    description: 'Detailed file metadata',
  })
  data: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}
