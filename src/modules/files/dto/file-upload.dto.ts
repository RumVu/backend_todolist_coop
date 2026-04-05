import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload (Max 5MB, PNG/JPEG/JPG/GIF)',
  })
  file: any;
}
