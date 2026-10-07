import { resolve } from 'node:path';

/** Public path the API serves uploaded files under (see main.ts). */
export const UPLOADS_URL_PREFIX = '/api/uploads';

/** UPLOADS_DIR is relative to where the API starts (apps/api); defaults to ./uploads. */
export function resolveUploadsDir(value: string | undefined) {
  return resolve(value || 'uploads');
}
