import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FlattenedImagesProductResponseDto } from 'src/products/dto/responses/objects/product/flattened-images-product-response.dto';

export const ApiFindOneResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Product with :index has been fetched from the database',
      type: FlattenedImagesProductResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'An error occured while performing the SQL query',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Product :index was not found in the database',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
