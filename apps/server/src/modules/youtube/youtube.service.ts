import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface YoutubeSearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

@Injectable()
export class YoutubeService {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async searchVideos(query: string): Promise<YoutubeSearchResult[]> {
    void this.configService.get<string>('youtube.apiKey');
    void query;
    return [];
  }
}
