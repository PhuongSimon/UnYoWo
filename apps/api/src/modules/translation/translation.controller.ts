import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { TranslateDto } from './dto/translate.dto.js';
import { TranslationService } from './translation.service.js';

@UseGuards(JwtAuthGuard)
@Controller('translate')
export class TranslationController {
  constructor(private readonly translation: TranslationService) {}

  // Every request may spend the free providers' daily quota, so keep it to a human pace.
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post()
  @HttpCode(HttpStatus.OK)
  translate(@Body() dto: TranslateDto) {
    return this.translation.translate(dto);
  }
}
