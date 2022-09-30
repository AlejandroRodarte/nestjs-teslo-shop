import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ACCEPTED_IMAGE_FILE_EXTENSIONS } from '../constants/accepted-image-file-extensions.constants';
import { ACCEPTED_IMAGE_MIME_TYPES } from '../constants/accepted-image-mime-types.constants';

export const imageFileFilter: MulterOptions['fileFilter'] = (
  req: Express.Request,
  file,
  callback,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const splitOriginalName = file.originalname.split('.');
  const fileExtension = splitOriginalName[splitOriginalName.length - 1];
  const mimeType = file.mimetype;

  const acceptFile =
    ACCEPTED_IMAGE_FILE_EXTENSIONS.includes(fileExtension) &&
    ACCEPTED_IMAGE_MIME_TYPES.includes(mimeType);

  callback(null, acceptFile);
};
