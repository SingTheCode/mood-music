import { Injectable, Inject } from '@nestjs/common';
import type { ExpandKeywordsResponse } from '@mood-music/shared-types';

/**
 * 키워드 확장 서비스
 * LLM을 사용하여 감정 키워드를 YouTube 검색 쿼리로 변환합니다.
 */
@Injectable()
export class KeywordService {
  private cache = new Map<string, { result: ExpandKeywordsResponse; timestamp: number }>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간
  private readonly LLM_TIMEOUT = 2000; // 2초

  constructor(@Inject('OPENAI_CLIENT') private openaiClient: any) {}

  /**
   * 감정 키워드를 YouTube 검색 쿼리로 확장합니다.
   * @param keywords 감정 키워드 배열 (2~4개)
   * @returns YouTube 검색 최적화 쿼리
   */
  async expandKeywords(keywords: string[]): Promise<ExpandKeywordsResponse> {
    const cacheKey = this.getCacheKey(keywords);

    // 캐시 확인
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    try {
      const query = await this.callLLM(keywords);
      const result: ExpandKeywordsResponse = { query };
      this.cache.set(cacheKey, { result, timestamp: Date.now() });
      return result;
    } catch (error) {
      const query = this.getFallbackQuery(keywords);
      return { query };
    }
  }

  private async callLLM(keywords: string[]): Promise<string> {
    const prompt = `Convert these Korean emotion keywords to an optimized YouTube music search query in English. Return only the query string, no explanation.

Keywords: ${keywords.join(', ')}

Requirements:
- Use music genre keywords (lo-fi, ambient, jazz, classical, etc.)
- Include mood descriptors (chill, energetic, melancholic, etc.)
- Keep it concise (3-5 words max)
- Make it YouTube search friendly`;

    const timeoutId = setTimeout(() => {
      throw new Error('LLM timeout');
    }, this.LLM_TIMEOUT);

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
      });

      clearTimeout(timeoutId);
      return response.choices[0].message.content.trim();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getFallbackQuery(keywords: string[]): string {
    const genreMap: Record<string, string> = {
      잔잔한: 'lo-fi chill',
      신나는: 'upbeat energetic',
      우울한: 'melancholic sad',
      설레는: 'exciting uplifting',
      그리운: 'nostalgic ambient',
      차분한: 'calm peaceful',
      활기찬: 'vibrant energetic',
      몽환적: 'dreamy ethereal',
      강렬한: 'intense powerful',
      편안한: 'cozy comfortable',
    };

    const genres = keywords
      .map(k => genreMap[k] || 'music')
      .slice(0, 2)
      .join(' ');

    return genres || 'relaxing music';
  }

  private getCacheKey(keywords: string[]): string {
    return [...keywords].sort().join('|');
  }
}
