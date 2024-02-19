import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

/**
 * Common file upload interceptor
 */
export const fileInterceptor = FileFieldsInterceptor(
  [{ name: 'file', maxCount: 3 }],
  {
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (mimeTypes.includes(file.mimetype)) cb(null, true);
      else {
        cb(new BadRequestException('Invalid File Type'));
      }
    },
    limits: { fileSize: 10000000 },
  },
);
