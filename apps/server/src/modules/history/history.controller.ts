import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll(@Headers('x-user-id') userId: string) {
    return this.historyService.getByUserId(userId || 'anonymous');
  }

  @Post()
  create(@Headers('x-user-id') userId: string, @Body() body: { keywords: string[]; playlistId: string }) {
    return this.historyService.saveEntry(userId || 'anonymous', {
      keywords: body.keywords,
      playlistId: body.playlistId,
      createdAt: new Date().toISOString(),
    });
  }
}
