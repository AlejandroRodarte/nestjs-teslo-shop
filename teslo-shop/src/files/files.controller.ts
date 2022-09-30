import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ACCEPTED_IMAGE_FILE_EXTENSIONS } from './constants/accepted-image-file-extensions.constants';
import { ACCEPTED_IMAGE_MIME_TYPES } from './constants/accepted-image-mime-types.constants';
import { FilesService } from './files.service';
import { imageFileFilter, imageFileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './static/uploads/products',
        filename: imageFileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile('file') file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        `Please provide an image file. Accepted file extensions are ${ACCEPTED_IMAGE_FILE_EXTENSIONS.join(
          ', ',
        )}. Accepted MIME types are ${ACCEPTED_IMAGE_MIME_TYPES.join(', ')}`,
      );
    return file;
  }
}
