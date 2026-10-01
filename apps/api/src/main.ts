import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { ApiError } from './common/api-error.js';

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
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
