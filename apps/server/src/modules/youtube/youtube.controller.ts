import { Controller, Get, Query } from '@nestjs/common';
import { YouTubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YouTubeService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.youtubeService.search(query);
  }
}
