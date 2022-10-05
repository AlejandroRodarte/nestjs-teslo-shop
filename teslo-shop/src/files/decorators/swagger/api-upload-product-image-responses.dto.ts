import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UploadProductImageResponseDto } from 'src/files/dto/responses/upload-product-image-response.dto';

export const ApiUploadProductImageResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description:
        'Image has been uploaded into the application. Secure URL to access the image returned',
      type: UploadProductImageResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User does not have the privilege to access this resource',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
