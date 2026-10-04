import { Controller, Get, HttpStatus, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ContentService } from './content.service.js';
import { ListItemsQuery } from './dto/list-items.query.js';

const setIdPipe = new ParseUUIDPipe({ exceptionFactory: () => new ApiError(HttpStatus.NOT_FOUND, 'SET_NOT_FOUND') });

@UseGuards(JwtAuthGuard)
@Controller('learning-sets')
export class LearningSetsController {
  constructor(private readonly content: ContentService) {}

  @Get(':id/items')
  listItems(@Param('id', setIdPipe) id: string, @Query() query: ListItemsQuery) {
    return this.content.listItems(id, query.page, query.pageSize);
  }
}
