import { existsSync } from 'node:fs';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { LocalAvatarStorage } from './avatar-storage.js';

describe('LocalAvatarStorage', () => {
  let root: string;
  let storage: LocalAvatarStorage;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'unyowo-uploads-'));
    storage = new LocalAvatarStorage(new ConfigService({ UPLOADS_DIR: root }));
  });

  afterEach(() => rm(root, { recursive: true, force: true }));

  it('saves under a random name and deletes its own files', async () => {
    const url = await storage.save(Buffer.from('webp'));

    expect(url).toMatch(/^\/api\/uploads\/avatars\/[0-9a-f-]{36}\.webp$/);
    expect(await readdir(join(root, 'avatars'))).toHaveLength(1);

    await storage.remove(url);
    expect(await readdir(join(root, 'avatars'))).toHaveLength(0);
  });

  it('never deletes anything outside the avatars it created', async () => {
    const outside = join(root, 'keep.txt');
    await writeFile(outside, 'keep');

    for (const url of [
      'https://lh3.googleusercontent.com/a/photo',
      '/api/uploads/avatars/../keep.txt',
      '/api/uploads/avatars/%2e%2e%2fkeep.txt',
      `/api/uploads/avatars/${'a'.repeat(36)}.webp/../../keep.txt`,
      null,
    ]) {
      await storage.remove(url);
    }

    expect(existsSync(outside)).toBe(true);
  });
});
