import { randomBytes } from 'node:crypto';
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { RequestLang, type Lang } from '../../common/lang.decorator.js';
import { AuthService, type Session } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { GoogleOAuthService } from './services/google-oauth.service.js';
import { TokenService, type AccessTokenPayload, type ClientInfo } from './services/token.service.js';

const REFRESH_COOKIE = 'refresh_token';
const OAUTH_STATE_COOKIE = 'oauth_state';

@Throttle({ default: { limit: 20, ttl: 60_000 } })
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly isProd: boolean;
  private readonly webUrl: string;

  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    private readonly google: GoogleOAuthService,
    config: ConfigService,
  ) {
    this.isProd = config.get('NODE_ENV') === 'production';
    this.webUrl = config.getOrThrow<string>('WEB_URL');
  }

  @Post('register')
  register(@Body() dto: RegisterDto, @RequestLang() lang: Lang, @Req() req: Request) {
    return this.auth.register(dto, lang, this.clientInfo(req));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @RequestLang() lang: Lang,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.sendSession(res, await this.auth.login(dto, lang, this.clientInfo(req)));
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: ForgotPasswordDto, @RequestLang() lang: Lang) {
    await this.auth.forgotPassword(dto.email, lang);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('otp/resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendOtp(@Body() dto: SendOtpDto, @RequestLang() lang: Lang) {
    await this.auth.resendOtp(dto, lang);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.verifyOtp(dto, this.clientInfo(req));
    return 'resetToken' in result ? result : this.sendSession(res, result);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auth.resetPassword(dto);
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const session = await this.auth.refresh(this.readRefreshCookie(req), this.clientInfo(req));
      return this.sendSession(res, session);
    } catch (error) {
      res.clearCookie(REFRESH_COOKIE, this.refreshCookieOptions());
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(this.readRefreshCookie(req));
    res.clearCookie(REFRESH_COOKIE, this.refreshCookieOptions());
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AccessTokenPayload) {
    return this.auth.me(user.sub);
  }

  @Get('google')
  googleStart(@Res() res: Response) {
    if (!this.google.enabled) return res.redirect(this.googleResultUrl('google_not_configured'));

    const state = randomBytes(24).toString('base64url');
    res.cookie(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProd,
      path: '/api/auth/google',
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect(this.google.buildAuthUrl(state));
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const expectedState = (req.cookies as Record<string, string | undefined>)[OAUTH_STATE_COOKIE];
    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/api/auth/google' });

    if (error || !code || !state || state !== expectedState) {
      return res.redirect(this.googleResultUrl(error ?? 'invalid_state'));
    }

    try {
      const profile = await this.google.exchangeCode(code);
      const session = await this.auth.loginWithGoogle(profile, this.clientInfo(req));
      this.setRefreshCookie(res, session.refreshToken);
      return res.redirect(this.googleResultUrl());
    } catch (err) {
      this.logger.error('Google sign-in failed', err as Error);
      return res.redirect(this.googleResultUrl('google_failed'));
    }
  }

  private sendSession(res: Response, session: Session) {
    this.setRefreshCookie(res, session.refreshToken);
    return { accessToken: session.accessToken, user: session.user };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, { ...this.refreshCookieOptions(), maxAge: this.tokens.refreshTtlMs });
  }

  private refreshCookieOptions(): CookieOptions {
    return { httpOnly: true, sameSite: 'lax', secure: this.isProd, path: '/api/auth' };
  }

  private readRefreshCookie(req: Request) {
    return (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];
  }

  private clientInfo(req: Request): ClientInfo {
    return { userAgent: req.headers['user-agent'], ipAddress: req.ip };
  }

  private googleResultUrl(error?: string) {
    const url = new URL('/auth/google/callback', this.webUrl);
    if (error) url.searchParams.set('error', error);
    return url.toString();
  }
}
