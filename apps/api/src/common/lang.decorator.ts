import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type Lang = 'vi' | 'en';

export const RequestLang = createParamDecorator((_data: unknown, ctx: ExecutionContext): Lang => {
  const header = ctx.switchToHttp().getRequest<Request>().headers['accept-language'] ?? '';
  return header.toLowerCase().startsWith('vi') ? 'vi' : 'en';
});
