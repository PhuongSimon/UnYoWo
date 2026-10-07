import { HttpStatus } from '@nestjs/common';
import sharp, { type SharpOptions } from 'sharp';
import { ApiError } from '../../../common/api-error.js';

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MIN_SIDE = 64;
export const AVATAR_MAX_SIDE = 4096;
export const AVATAR_OUTPUT_SIDE = 256;
export const AVATAR_MIME_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'];

type AvatarFormat = 'jpeg' | 'png' | 'webp';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Decoding stops past this many pixels, so a tiny file that claims huge dimensions cannot exhaust memory.
// 'warning' also rejects truncated or slightly corrupt files instead of rendering them half-grey.
const DECODE_OPTIONS: SharpOptions = { limitInputPixels: AVATAR_MAX_SIDE * AVATAR_MAX_SIDE, failOn: 'warning' };

/** Reads the real format from the file's first bytes; the file name and MIME type come from the client and can lie. */
export function sniffImageFormat(buffer: Buffer): AvatarFormat | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)) return 'png';
  if (buffer.length >= 12 && buffer.toString('latin1', 0, 4) === 'RIFF' && buffer.toString('latin1', 8, 12) === 'WEBP') {
    return 'webp';
  }
  return null;
}

/**
 * Turns an uploaded file into a safe avatar: only real JPEG, PNG or WebP within the size
 * limits is accepted, then it is decoded and re-encoded as a square WebP. Re-encoding drops
 * EXIF (GPS location, camera serial) and anything smuggled after the image data.
 */
export async function processAvatar(buffer: Buffer): Promise<Buffer> {
  if (buffer.length === 0) throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_REQUIRED');
  if (buffer.length > AVATAR_MAX_BYTES) {
    throw new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, 'AVATAR_TOO_LARGE', { maxBytes: AVATAR_MAX_BYTES });
  }

  const format = sniffImageFormat(buffer);
  if (!format) throw new ApiError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'AVATAR_UNSUPPORTED_TYPE');

  const metadata = await sharp(buffer, DECODE_OPTIONS)
    .metadata()
    .catch(() => {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_INVALID');
    });
  if (metadata.format !== format || !metadata.width || !metadata.height) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_INVALID');
  }

  const shortSide = Math.min(metadata.width, metadata.height);
  const longSide = Math.max(metadata.width, metadata.height);
  if (shortSide < AVATAR_MIN_SIDE || longSide > AVATAR_MAX_SIDE) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_DIMENSIONS', { minSide: AVATAR_MIN_SIDE, maxSide: AVATAR_MAX_SIDE });
  }

  return sharp(buffer, DECODE_OPTIONS)
    .autoOrient()
    .resize(AVATAR_OUTPUT_SIDE, AVATAR_OUTPUT_SIDE, { fit: 'cover' })
    .webp({ quality: 82 })
    .toBuffer()
    .catch(() => {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_INVALID');
    });
}
