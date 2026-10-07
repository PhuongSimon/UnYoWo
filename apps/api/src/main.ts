import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { ApiError } from './common/api-error.js';
import { resolveUploadsDir, UPLOADS_URL_PREFIX } from './config/uploads.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.set('trust proxy', 'loopback');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new ApiError(HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', {
          fields: errors.map((e) => ({ field: e.property, rules: Object.keys(e.constraints ?? {}) })),
        }),
    }),
  );
  // Avatars are re-encoded images with random, never-reused names: cache them for good and
  // forbid the browser from sniffing or running anything else out of this folder.
  app.useStaticAssets(resolveUploadsDir(app.get(ConfigService).get<string>('UPLOADS_DIR')), {
    prefix: `${UPLOADS_URL_PREFIX}/`,
    index: false,
    dotfiles: 'deny',
    maxAge: '365d',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
    },
  });
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
