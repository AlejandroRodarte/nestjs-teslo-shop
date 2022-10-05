import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiMultipartFormDataOptions } from '../interfaces/api-multipart-form-data-options.interface';
import { schemaObjectMapper } from '../mappers/schema-object.mapper';

export const ApiMultipartFormData = (options: ApiMultipartFormDataOptions) => {
  const properties: Record<string, SchemaObject | ReferenceObject> = {};

  for (const key in options.properties)
    properties[key] = schemaObjectMapper[options.properties[key]];

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties,
      },
    }),
  );
};
