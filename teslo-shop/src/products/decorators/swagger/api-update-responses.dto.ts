import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FlattenedImagesProductResponseDto } from 'src/products/dto/responses/objects/product/flattened-images-product-response.dto';

export const ApiUpdateResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Product with :index has been updated in the database',
      type: FlattenedImagesProductResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. DTO validations failed, or some of the SQL constraints failed',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User in not authenticated',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User does not have the privileges to access this resource',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Product :id was not found in the database',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
