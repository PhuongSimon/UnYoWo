import {
  BadRequestException,
  Catch,
  HttpStatus,
  PayloadTooLargeException,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { MulterModuleOptions } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiError } from '../../../common/api-error.js';
import { AVATAR_MAX_BYTES, AVATAR_MIME_TYPES } from './avatar-image.js';

export const AVATAR_FIELD = 'avatar';

/**
 * Without a storage option multer keeps the file in memory, and it stops reading the body as soon
 * as a limit is hit, so an oversized upload never fills it. The MIME check is only a cheap early
 * reject; processAvatar checks the actual bytes.
 */
export const avatarUploadOptions: MulterModuleOptions = {
  limits: { fileSize: AVATAR_MAX_BYTES, files: 1, fields: 0, parts: 1 },
  fileFilter: (_req, file, callback) => {
    if (AVATAR_MIME_TYPES.includes(file.mimetype)) return callback(null, true);
    callback(new ApiError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'AVATAR_UNSUPPORTED_TYPE'), false);
  },
};

/** Turns multer's generic limit errors into the API's error codes. */
@Catch(PayloadTooLargeException, BadRequestException)
export class AvatarUploadErrorFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException | BadRequestException, host: ArgumentsHost) {
    const error =
      exception instanceof PayloadTooLargeException
        ? new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, 'AVATAR_TOO_LARGE', { maxBytes: AVATAR_MAX_BYTES })
        : new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_INVALID');
    host.switchToHttp().getResponse<Response>().status(error.getStatus()).json(error.getResponse());
  }
}
