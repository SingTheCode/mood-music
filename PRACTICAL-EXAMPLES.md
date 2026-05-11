# Practical TDD Examples: Keyword Domain

Complete working examples for the keyword domain to use as templates.

---

## 1. Pure Function: Keyword Combination

### Implementation First (TDD Red Phase)

```typescript
// src/domains/keyword/utils/keywordCombination.ts
/**
 * Combines 2-4 emotion keywords into a YouTube search query
 * @param keywords - Array of 2-4 emotion/situation keywords
 * @returns Optimized YouTube search query string
 */
export const combineKeywordsToQuery = (keywords: string[]): string => {
  if (keywords.length < 2 || keywords.length > 4) {
    throw new Error('Keywords must be between 2 and 4');
  }
  
  // TODO: Implement
  return '';
};
```

### Test First (TDD Green Phase)

```typescript
// src/domains/keyword/utils/__tests__/keywordCombination.test.ts
import { describe, it, expect } from 'vitest';
import { combineKeywordsToQuery } from '../keywordCombination';

describe('combineKeywordsToQuery', () => {
  describe('valid inputs', () => {
    it('should combine 2 keywords', () => {
      const result = combineKeywordsToQuery(['calm', 'night']);
      expect(result).toContain('calm');
      expect(result).toContain('night');
    });

    it('should combine 3 keywords', () => {
      const result = combineKeywordsToQuery(['lo-fi', 'study', 'rain']);
      expect(result).toContain('lo-fi');
      expect(result).toContain('study');
      expect(result).toContain('rain');
    });

    it('should combine 4 keywords', () => {
      const result = combineKeywordsToQuery(['chill', 'evening', 'coffee', 'work']);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should lowercase keywords', () => {
      const result = combineKeywordsToQuery(['CALM', 'NIGHT']);
      expect(result).not.toContain('CALM');
      expect(result).not.toContain('NIGHT');
    });

    it('should add music-related terms', () => {
      const result = combineKeywordsToQuery(['calm', 'night']);
      expect(result.toLowerCase()).toMatch(/music|beat|track|song|playlist/i);
    });
  });

  describe('invalid inputs', () => {
    it('should throw if less than 2 keywords', () => {
      expect(() => combineKeywordsToQuery(['calm'])).toThrow(
        'Keywords must be between 2 and 4'
      );
    });

    it('should throw if more than 4 keywords', () => {
      expect(() => 
        combineKeywordsToQuery(['a', 'b', 'c', 'd', 'e'])
      ).toThrow('Keywords must be between 2 and 4');
    });

    it('should throw if empty array', () => {
      expect(() => combineKeywordsToQuery([])).toThrow();
    });
  });
});
```

### Implementation (TDD Green Phase)

```typescript
// src/domains/keyword/utils/keywordCombination.ts
export const combineKeywordsToQuery = (keywords: string[]): string => {
  if (keywords.length < 2 || keywords.length > 4) {
    throw new Error('Keywords must be between 2 and 4');
  }

  const normalized = keywords.map(k => k.toLowerCase().trim());
  const query = normalized.join(' ');
  
  // Add music context
  const musicTerms = ['music', 'playlist', 'mix', 'beats'];
  const randomTerm = musicTerms[Math.floor(Math.random() * musicTerms.length)];
  
  return `${query} ${randomTerm}`;
};
```

---

## 2. API Function: YouTube Search

### Test Setup

```typescript
// src/domains/player/apis/__tests__/youtube.api.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchYouTube } from '../youtube.api';

// Mock fetch globally
global.fetch = vi.fn();

describe('searchYouTube', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful search', () => {
    it('should return video results', async () => {
      const mockResponse = {
        items: [
          {
            id: { videoId: 'abc123' },
            snippet: {
              title: 'Lo-fi beats to study to',
              description: 'Chill lo-fi music',
              thumbnails: { default: { url: 'https://...' } },
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await searchYouTube('lo-fi study');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id.videoId).toBe('abc123');
    });

    it('should include music category filter', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await searchYouTube('test query');

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(callUrl).toContain('videoCategoryId=10'); // Music category
    });

    it('should limit results to 20', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await searchYouTube('test');

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(callUrl).toContain('maxResults=20');
    });
  });

  describe('error handling', () => {
    it('should throw on quota exceeded (403)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      } as Response);

      await expect(searchYouTube('test')).rejects.toThrow(
        'YouTube API quota exceeded'
      );
    });

    it('should throw on other API errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(searchYouTube('test')).rejects.toThrow(
        'YouTube API error'
      );
    });

    it('should throw on network error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(searchYouTube('test')).rejects.toThrow('Network error');
    });
  });
});
```

### Implementation

```typescript
// src/domains/player/apis/youtube.api.ts
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeSearchResult {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: { default: { url: string } };
    };
  }>;
}

export const searchYouTube = async (query: string): Promise<YouTubeSearchResult> => {
  const url = new URL(`${YOUTUBE_API_BASE}/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoCategoryId', '10'); // Music
  url.searchParams.set('maxResults', '20');
  url.searchParams.set('key', import.meta.env.VITE_YOUTUBE_API_KEY);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('YouTube API quota exceeded');
    }
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  return response.json();
};
```

---

## 3. Hook: useSearchYouTube with TanStack Query

### Test

```typescript
// src/domains/player/hooks/__tests__/useSearchYouTube.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchYouTube } from '../useSearchYouTube';
import { Wrapper } from '@/test/setup';
import * as youtubeApi from '../../apis/youtube.api';

vi.mock('../../apis/youtube.api');

describe('useSearchYouTube', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading states', () => {
    it('should start in loading state', () => {
      vi.mocked(youtubeApi.searchYouTube).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useSearchYouTube('test'), {
        wrapper: Wrapper,
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when query is empty', () => {
      const { result } = renderHook(() => useSearchYouTube(''), {
        wrapper: Wrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(youtubeApi.searchYouTube).not.toHaveBeenCalled();
    });
  });

  describe('successful fetch', () => {
    it('should fetch and return results', async () => {
      const mockResults = {
        items: [
          {
            id: { videoId: 'abc123' },
            snippet: { title: 'Lo-fi beats', description: '', thumbnails: { default: { url: '' } } },
          },
        ],
      };

      vi.mocked(youtubeApi.searchYouTube).mockResolvedValue(mockResults);

      const { result } = renderHook(() => useSearchYouTube('lo-fi'), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResults);
    });

    it('should cache results for 30 minutes', async () => {
      const mockResults = { items: [] };
      vi.mocked(youtubeApi.searchYouTube).mockResolvedValue(mockResults);

      const { result: result1 } = renderHook(() => useSearchYouTube('test'), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second call should use cache
      const { result: result2 } = renderHook(() => useSearchYouTube('test'), {
        wrapper: Wrapper,
      });

      // Should be instant (no loading state)
      expect(result2.current.data).toEqual(mockResults);
      expect(youtubeApi.searchYouTube).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle quota exceeded error', async () => {
      vi.mocked(youtubeApi.searchYouTube).mockRejectedValue(
        new Error('YouTube API quota exceeded')
      );

      const { result } = renderHook(() => useSearchYouTube('test'), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('YouTube API quota exceeded');
    });
  });
});
```

### Implementation

```typescript
// src/domains/player/hooks/useSearchYouTube.ts
import { useQuery } from '@tanstack/react-query';
import { searchYouTube } from '../apis/youtube.api';
import { playerQueryKeys } from '../constants/queryKeys';

export const useSearchYouTube = (query: string) => {
  return useQuery({
    queryKey: playerQueryKeys.search(query),
    queryFn: () => searchYouTube(query),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: query.length > 0,
  });
};
```

---

## 4. NestJS Service: Keyword Expansion

### Test

```typescript
// src/modules/keyword/keyword.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import OpenAI from 'openai';
import { KeywordService } from './keyword.service';

describe('KeywordService', () => {
  let service: KeywordService;
  let openaiMock: ReturnType<typeof createMock<OpenAI>>;

  beforeEach(async () => {
    openaiMock = createMock<OpenAI>({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'lo-fi\nchill\nambient\nrain\nstudying',
                },
              },
            ],
          }),
        },
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordService,
        {
          provide: OpenAI,
          useValue: openaiMock,
        },
      ],
    }).compile();

    service = module.get<KeywordService>(KeywordService);
  });

  describe('expandKeywords', () => {
    it('should expand keywords using OpenAI', async () => {
      const result = await service.expandKeywords(['calm', 'night']);

      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-3.5-turbo',
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('calm'),
            }),
          ]),
        })
      );

      expect(result).toContain('lo-fi');
      expect(result).toHaveLength(5);
    });

    it('should handle OpenAI errors', async () => {
      openaiMock.chat.completions.create = jest.fn().mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      await expect(service.expandKeywords(['test'])).rejects.toThrow(
        'API rate limit exceeded'
      );
    });

    it('should validate keyword count', async () => {
      await expect(service.expandKeywords(['only-one'])).rejects.toThrow(
        'Keywords must be between 2 and 4'
      );
    });
  });
});
```

### Implementation

```typescript
// src/modules/keyword/keyword.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class KeywordService {
  constructor(private readonly openai: OpenAI) {}

  async expandKeywords(keywords: string[]): Promise<string[]> {
    if (keywords.length < 2 || keywords.length > 4) {
      throw new BadRequestException('Keywords must be between 2 and 4');
    }

    const prompt = `Given these emotion/mood keywords: ${keywords.join(', ')}, suggest 5 related YouTube music search terms. Return only the terms, one per line, no numbering.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content || '';
    return content
      .split('\n')
      .map(term => term.trim())
      .filter(term => term.length > 0);
  }
}
```

---

## 5. Matter.js Component: FloatingBubbles

### Test

```typescript
// src/domains/keyword/components/__tests__/FloatingBubbles.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingBubbles } from '../FloatingBubbles';

describe('FloatingBubbles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render canvas element', () => {
    const { container } = render(<FloatingBubbles keywords={['calm', 'night']} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<FloatingBubbles keywords={['calm', 'night']} />);
    expect(() => unmount()).not.toThrow();
  });

  it('should handle empty keywords', () => {
    const { container } = render(<FloatingBubbles keywords={[]} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should update when keywords change', () => {
    const { rerender } = render(<FloatingBubbles keywords={['calm']} />);
    expect(() => {
      rerender(<FloatingBubbles keywords={['calm', 'night']} />);
    }).not.toThrow();
  });
});
```

### Implementation

```typescript
// src/domains/keyword/components/FloatingBubbles.tsx
import { useRef, useEffect } from 'react';
import * as Matter from 'matter-js';

interface FloatingBubblesProps {
  keywords: string[];
}

export const FloatingBubbles = ({ keywords }: FloatingBubblesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0.5;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });

    const runner = Matter.Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;

    // Create bubbles for each keyword
    keywords.forEach((keyword, index) => {
      const body = Matter.Bodies.circle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        20 + Math.random() * 10,
        { restitution: 0.9 }
      );
      Matter.World.add(world, body);
    });

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.context.clearRect(0, 0, render.options.width, render.options.height);
    };
  }, [keywords]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};
```

---

## Key Takeaways

1. **Test First**: Write tests before implementation
2. **Mock External Dependencies**: Never call real APIs in tests
3. **Use Dependency Injection**: Makes mocking easier
4. **Test Error Paths**: Not just happy paths
5. **Keep Tests Isolated**: Each test should be independent
6. **Use Fixtures**: Reusable mock data
7. **Test Cleanup**: Verify resources are released

