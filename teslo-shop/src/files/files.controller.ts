import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { ACCEPTED_IMAGE_FILE_EXTENSIONS } from './constants/accepted-image-file-extensions.constants';
import { ACCEPTED_IMAGE_MIME_TYPES } from './constants/accepted-image-mime-types.constants';
import { FilesService } from './files.service';
import { imageFileFilter, imageFileNamer } from './helpers';
import { UploadProductImageResponseDto } from './dto/responses/upload-product-image-response.dto';

@Controller('files')
export class FilesController {
  private readonly _hostApi = this.configService.get<string>('host.api');

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  @Get('product/:imageFilename')
  findProductImage(
    @Res() res: Response,
    @Param('imageFilename') imageFilename: string,
  ): void {
    const path = this.filesService.getProductImagePathByFilename(imageFilename);
    return res.sendFile(path);
  }

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
  uploadProductImage(
    @UploadedFile('file') file: Express.Multer.File,
  ): UploadProductImageResponseDto {
    if (!file)
      throw new BadRequestException(
        `Please provide an image file. Accepted file extensions are ${ACCEPTED_IMAGE_FILE_EXTENSIONS.join(
          ', ',
        )}. Accepted MIME types are ${ACCEPTED_IMAGE_MIME_TYPES.join(', ')}`,
      );
    const secureUrl = `${this._hostApi}/files/product/${file.filename}`;
    return new UploadProductImageResponseDto(secureUrl);
  }
}
