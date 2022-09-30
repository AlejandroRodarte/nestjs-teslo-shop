import { v4 as uuid } from 'uuid';
import { DiskStorageOptions } from 'multer';

export const imageFileNamer: DiskStorageOptions['filename'] = (
  req: Express.Request,
  file,
  callback,
) => {
  const splitOriginalName = file.originalname.split('.');
  const fileExtension = splitOriginalName[splitOriginalName.length - 1];
  const fileName = `${uuid()}.${fileExtension}`;
  return callback(null, fileName);
};
