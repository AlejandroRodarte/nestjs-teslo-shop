import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { MultipartType } from '../enums/multipart-type.enum';

type SchemaObjectMapper = { [k in MultipartType]: SchemaObject };

export const schemaObjectMapper: SchemaObjectMapper = {
  file: {
    type: 'string',
    format: 'binary',
  },
  integer: {
    type: 'integer',
  },
  string: {
    type: 'string',
  },
};
