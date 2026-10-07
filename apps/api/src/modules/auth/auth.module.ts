import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { MailModule } from '../../infrastructure/mail/mail.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { OtpCodesRepository } from './repositories/otp-codes.repository.js';
import { PrismaOtpCodesRepository } from './repositories/prisma-otp-codes.repository.js';
import { PrismaRefreshTokensRepository } from './repositories/prisma-refresh-tokens.repository.js';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository.js';
import { GoogleOAuthService } from './services/google-oauth.service.js';
import { OtpService } from './services/otp.service.js';
import { PasswordService } from './services/password.service.js';
import { TokenService } from './services/token.service.js';
import { TurnstileService } from './services/turnstile.service.js';

@Module({
  imports: [
    MailModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_ACCESS_TTL') ?? '15m') as NonNullable<
            JwtModuleOptions['signOptions']
          >['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    TokenService,
    PasswordService,
    TurnstileService,
    GoogleOAuthService,
    JwtAuthGuard,
    { provide: OtpCodesRepository, useClass: PrismaOtpCodesRepository },
    { provide: RefreshTokensRepository, useClass: PrismaRefreshTokensRepository },
  ],
  exports: [JwtAuthGuard, TokenService, PasswordService, OtpCodesRepository],
})
export class AuthModule {}
