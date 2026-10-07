import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolveUploadsDir, UPLOADS_URL_PREFIX } from '../../../config/uploads.js';

export abstract class AvatarStorage {
  /** Stores a processed avatar and returns the URL the web app loads it from. */
  abstract save(image: Buffer): Promise<string>;
  /** Deletes an avatar this storage created; other URLs (a Google photo, null) are ignored. */
  abstract remove(url: string | null): Promise<void>;
}

// Only names this storage generates match, so a stored URL can never point the delete outside the folder.
const OWN_AVATAR_URL = new RegExp(`^${UPLOADS_URL_PREFIX}/avatars/([0-9a-f-]{36}\\.webp)$`);

@Injectable()
export class LocalAvatarStorage extends AvatarStorage {
  private readonly dir: string;

  constructor(config: ConfigService) {
    super();
    this.dir = join(resolveUploadsDir(config.get<string>('UPLOADS_DIR')), 'avatars');
  }

  async save(image: Buffer) {
    await mkdir(this.dir, { recursive: true });
    const name = `${randomUUID()}.webp`;
    await writeFile(join(this.dir, name), image, { flag: 'wx' });
    return `${UPLOADS_URL_PREFIX}/avatars/${name}`;
  }

  async remove(url: string | null) {
    const name = url?.match(OWN_AVATAR_URL)?.[1];
    if (name) await rm(join(this.dir, name), { force: true });
  }
}
