import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeywordService {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async expandKeywords(keywords: string[]): Promise<{ query: string }> {
    void this.configService.get<string>('llm.apiKey');
    const query = keywords.join(' ');
    return { query };
  }
}
