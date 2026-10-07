import sharp from 'sharp';
import { AVATAR_MAX_BYTES, AVATAR_OUTPUT_SIDE, processAvatar, sniffImageFormat } from './avatar-image.js';

const image = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: '#e17346' } });

const rejectsWith = (buffer: Buffer, code: string) =>
  expect(processAvatar(buffer)).rejects.toMatchObject({ response: { code } });

describe('sniffImageFormat', () => {
  it('reads the format from the bytes, not from a name or MIME type', async () => {
    expect(sniffImageFormat(await image(8, 8).jpeg().toBuffer())).toBe('jpeg');
    expect(sniffImageFormat(await image(8, 8).png().toBuffer())).toBe('png');
    expect(sniffImageFormat(await image(8, 8).webp().toBuffer())).toBe('webp');
    expect(sniffImageFormat(Buffer.from('GIF89a'))).toBeNull();
    expect(sniffImageFormat(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
  });
});

describe('processAvatar', () => {
  it('re-encodes JPEG, PNG and WebP into a square WebP', async () => {
    for (const input of [image(640, 480).jpeg(), image(300, 900).png(), image(512, 512).webp()]) {
      const output = await processAvatar(await input.toBuffer());
      const meta = await sharp(output).metadata();

      expect(meta).toMatchObject({ format: 'webp', width: AVATAR_OUTPUT_SIDE, height: AVATAR_OUTPUT_SIDE });
    }
  });

  it('drops EXIF data such as the camera owner or GPS position', async () => {
    const input = await image(400, 400)
      .withExif({ IFD0: { Copyright: 'secret owner', Artist: 'secret owner' } })
      .jpeg()
      .toBuffer();
    expect((await sharp(input).metadata()).exif).toBeDefined();

    const output = await processAvatar(input);

    expect((await sharp(output).metadata()).exif).toBeUndefined();
    expect(output.includes('secret owner')).toBe(false);
  });

  it('rejects files that are not JPEG, PNG or WebP even though the decoder could read them', async () => {
    await rejectsWith(await image(100, 100).gif().toBuffer(), 'AVATAR_UNSUPPORTED_TYPE');
    await rejectsWith(await image(100, 100).tiff().toBuffer(), 'AVATAR_UNSUPPORTED_TYPE');
    await rejectsWith(
      Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
      'AVATAR_UNSUPPORTED_TYPE',
    );
    await rejectsWith(Buffer.from('<?php echo "hi"; ?>'), 'AVATAR_UNSUPPORTED_TYPE');
  });

  it('rejects a file that only starts like an image', async () => {
    const png = await image(200, 200).png().toBuffer();

    await rejectsWith(png.subarray(0, png.length / 2), 'AVATAR_INVALID');
    await rejectsWith(Buffer.concat([png.subarray(0, 8), Buffer.from('<html><script>alert(1)</script></html>')]), 'AVATAR_INVALID');
  });

  it('rejects images that are too small or too large in pixels', async () => {
    await rejectsWith(await image(32, 32).png().toBuffer(), 'AVATAR_DIMENSIONS');
    await rejectsWith(await image(5000, 100).png().toBuffer(), 'AVATAR_DIMENSIONS');
  });

  it('rejects an empty or oversized file before decoding it', async () => {
    await rejectsWith(Buffer.alloc(0), 'AVATAR_REQUIRED');

    const oversized = Buffer.alloc(AVATAR_MAX_BYTES + 1);
    (await image(8, 8).png().toBuffer()).copy(oversized);
    await rejectsWith(oversized, 'AVATAR_TOO_LARGE');
  });
});
