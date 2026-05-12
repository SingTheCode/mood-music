import { Controller, Get, Post, Headers, Query } from '@nestjs/common';
import { DailyLimitService } from './daily-limit.service';

@Controller('daily-limit')
export class DailyLimitController {
  constructor(private readonly dailyLimitService: DailyLimitService) {}

  @Get()
  getLimit(@Headers('x-user-id') userId: string, @Query('date') date: string) {
    return this.dailyLimitService.getByUserId(userId || 'anonymous', date);
  }

  @Post('increment')
  increment(@Headers('x-user-id') userId: string) {
    return this.dailyLimitService.increment(userId || 'anonymous');
  }
}
