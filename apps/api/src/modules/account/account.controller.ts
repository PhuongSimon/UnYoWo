import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { readRefreshCookie, REFRESH_COOKIE, refreshCookieOptions } from '../auth/refresh-cookie.js';
import type { AccessTokenPayload } from '../auth/services/token.service.js';
import { AccountService } from './account.service.js';
import { AVATAR_FIELD, AvatarUploadErrorFilter, avatarUploadOptions } from './avatar/avatar-upload.js';
import { ChangePasswordDto, DeleteAccountDto, UpdateProfileDto } from './dto/account.dto.js';

// Lives under /auth so the refresh cookie (path /api/auth) comes along with these requests
@UseGuards(JwtAuthGuard)
@Controller('auth/me')
export class AccountController {
  private readonly isProd: boolean;

  constructor(
    private readonly account: AccountService,
    config: ConfigService,
  ) {
    this.isProd = config.get('NODE_ENV') === 'production';
  }

  @Get()
  me(@CurrentUser() user: AccessTokenPayload) {
    return this.account.me(user.sub);
  }

  @Patch()
  update(@CurrentUser() user: AccessTokenPayload, @Body() dto: UpdateProfileDto) {
    return this.account.updateProfile(user.sub, dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Put('avatar')
  @UseInterceptors(FileInterceptor(AVATAR_FIELD, avatarUploadOptions))
  @UseFilters(AvatarUploadErrorFilter)
  updateAvatar(@CurrentUser() user: AccessTokenPayload, @UploadedFile() file: Express.Multer.File | undefined) {
    return this.account.updateAvatar(user.sub, file);
  }

  @Delete('avatar')
  removeAvatar(@CurrentUser() user: AccessTokenPayload) {
    return this.account.removeAvatar(user.sub);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@CurrentUser() user: AccessTokenPayload, @Body() dto: ChangePasswordDto, @Req() req: Request) {
    await this.account.changePassword(user.sub, dto, readRefreshCookie(req));
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: DeleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.account.deleteAccount(user.sub, dto);
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions(this.isProd));
  }
}
