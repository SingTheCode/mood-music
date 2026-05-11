import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { YouTubeService } from './youtube.service';

@Module({
  controllers: [YoutubeController],
  providers: [YouTubeService],
  exports: [YouTubeService],
})
export class YoutubeModule {}
