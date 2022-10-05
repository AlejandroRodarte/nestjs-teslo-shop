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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ACCEPTED_IMAGE_FILE_EXTENSIONS } from './constants/accepted-image-file-extensions.constants';
import { ACCEPTED_IMAGE_MIME_TYPES } from './constants/accepted-image-mime-types.constants';
import { FilesService } from './files.service';
import { imageFileFilter, imageFileNamer } from './helpers';
import { UploadProductImageResponseDto } from './dto/responses/upload-product-image-response.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ApiFileResponse } from 'src/common/decorators/api-file-response.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private readonly _hostApi = this.configService.get<string>('host.api');

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  @Get('product/:imageFilename')
  @Auth({ validRoles: [UserRole.USER] })
  @ApiBearerAuth('JWT-Auth')
  @ApiParam({
    name: 'imageFilename',
    description: 'Image Filename (with extension)',
    required: true,
  })
  @ApiFileResponse({
    acceptedMimeTypes: ['image/png', 'image/gif', 'image/jpg'],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. Image does not exist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have the privilege to access this resource',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
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
  @Auth({ validRoles: [UserRole.USER] })
  @ApiBearerAuth('JWT-Auth')
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Image has been uploaded into the application. Secure URL to access the image returned',
    type: UploadProductImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have the privilege to access this resource',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
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
