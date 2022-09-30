import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getProductImagePathByFilename(imageFilename: string): string {
    const path = join(
      __dirname,
      '..',
      '..',
      'static',
      'uploads',
      'products',
      imageFilename,
    );

    if (!existsSync(path))
      throw new BadRequestException(
        `Product image ${imageFilename} does not exist`,
      );

    return path;
  }
}
