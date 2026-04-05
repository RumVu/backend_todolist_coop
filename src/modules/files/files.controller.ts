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
  Delete,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
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
  @ApiOperation({
    summary: 'Upload một tấm ảnh lên máy chủ (Avatar, Bằng chứng...)',
  })
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
    @Req() req: any,
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

  @Delete(':filename')
  @ApiOperation({ summary: 'Xoá một file đã upload khỏi máy chủ' })
  async deleteFile(@Param('filename') filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        return { message: 'Xoá file thành công' };
      } catch (err) {
        throw new Error(`Lỗi khi xoá file: ${err.message}`);
      }
    }
    throw new NotFoundException('Không tìm thấy file để xoá');
  }

  @Patch(':filename')
  @ApiOperation({ summary: 'Cập nhật (Thay thế) một file đã upload' })
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
  async updateFile(
    @Param('filename') oldFilename: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB MAX
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    // Xoá file cũ nếu tồn tại
    const oldFilePath = join(process.cwd(), 'uploads', oldFilename);
    if (fs.existsSync(oldFilePath)) {
      try {
        await fs.promises.unlink(oldFilePath);
      } catch (err) {
        console.error(`Không thể xoá file cũ: ${err.message}`);
      }
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return {
      message: 'Cập nhật file thành công (Đã thay thế file cũ)',
      data: {
        url: fileUrl,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }
}
