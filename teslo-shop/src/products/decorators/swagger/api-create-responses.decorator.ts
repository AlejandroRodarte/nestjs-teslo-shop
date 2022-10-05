import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FlattenedImagesProductResponseDto } from 'src/products/dto/responses/objects/product/flattened-images-product-response.dto';

export const ApiCreateResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'A product was created in the database',
      type: FlattenedImagesProductResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. Incoming data failed validation or SQL constraints were unmet',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User is not unauthenticated',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'User is not allowed to access this resources. Valid roles are: user',
    }),
  );
};
