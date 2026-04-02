import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

export const storageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

@ApiTags('Files & Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  
  @Post('upload')
  @ApiOperation({ summary: 'Upload một tấm ảnh lên máy chủ (Avatar, Bằng chứng...)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig }))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB MAX
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any
  ) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return {
      message: 'Upload file thành công',
      data: {
        url: fileUrl,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }
}
