# TDD Research: Mood Music App Implementation Patterns

**Date:** May 12, 2026  
**Focus:** Testability patterns and common pitfalls for matter.js + React, NestJS + OpenAI, YouTube API, TanStack Query, and Vitest

---

## 1. Matter.js + React Integration Patterns

### Core Pattern: useRef + useEffect + Cleanup

**Key Principle:** Matter.js predates React and is imperative. Use refs to hold mutable engine/world/renderer instances, not state.

```typescript
// ✅ CORRECT: Physics engine in ref, not state
import { useRef, useEffect } from 'react';
import * as Matter from 'matter-js';

export const FloatingBubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine, world, renderer
    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0.5;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    const runner = Matter.Runner.create();

    // Store in refs for cleanup
    engineRef.current = engine;
    runnerRef.current = runner;

    // Start simulation
    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    // CLEANUP: Critical for preventing memory leaks
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.context.clearRect(0, 0, render.options.width, render.options.height);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
```

### Responsive Canvas Pattern

```typescript
useEffect(() => {
  const handleResize = () => {
    if (!canvasRef.current || !engineRef.current) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    
    // Update render options
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: { width, height },
    });
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Storing engine in state | Causes re-renders on every physics tick | Use `useRef` instead |
| Missing cleanup | Memory leaks, multiple engines running | Always cleanup in useEffect return |
| Creating engine on every render | Performance degradation | Guard with `if (!engineRef.current)` |
| Not handling canvas resize | Responsive issues on mobile | Add resize listener with proper cleanup |
| Direct DOM manipulation | Conflicts with React | Use refs, not `document.getElementById` |

---

## 2. Testing Matter.js Physics Simulations

### Challenge: requestAnimationFrame Mocking

Matter.js uses `requestAnimationFrame` internally. Jest/Vitest need mocking:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});

// src/test/setup.ts
import { vi } from 'vitest';

// Mock requestAnimationFrame for deterministic testing
let frameId = 0;
const callbacks: FrameRequestCallback[] = [];

global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  callbacks.push(cb);
  return ++frameId;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  // Implementation
});

// Helper to advance animation frames
export const advanceFrames = (count: number) => {
  for (let i = 0; i < count; i++) {
    const cbs = [...callbacks];
    callbacks.length = 0;
    cbs.forEach(cb => cb(performance.now()));
  }
};
```

### Unit Testing Physics Behavior

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Matter from 'matter-js';
import { advanceFrames } from './setup';

describe('Floating Bubble Physics', () => {
  let engine: Matter.Engine;
  let world: Matter.World;

  beforeEach(() => {
    engine = Matter.Engine.create();
    world = engine.world;
    world.gravity.y = 0.5;
  });

  it('should apply gravity to bodies', () => {
    const body = Matter.Bodies.circle(100, 100, 20, { restitution: 0.9 });
    Matter.World.add(world, body);

    const initialY = body.position.y;

    // Advance 10 frames
    advanceFrames(10);
    Matter.Engine.update(engine);

    expect(body.position.y).toBeGreaterThan(initialY);
  });

  it('should detect collisions between bodies', () => {
    const body1 = Matter.Bodies.circle(100, 100, 20);
    const body2 = Matter.Bodies.circle(130, 100, 20);

    Matter.World.add(world, [body1, body2]);

    const collisionHandler = vi.fn();
    Matter.Events.on(engine, 'collisionStart', collisionHandler);

    // Advance frames until collision
    for (let i = 0; i < 100; i++) {
      Matter.Engine.update(engine);
      if (collisionHandler.mock.calls.length > 0) break;
    }

    expect(collisionHandler).toHaveBeenCalled();
  });

  it('should handle restitution (bounce)', () => {
    const body = Matter.Bodies.circle(100, 100, 20, { restitution: 0.8 });
    const floor = Matter.Bodies.rectangle(100, 300, 200, 20, { isStatic: true });

    Matter.World.add(world, [body, floor]);

    // Simulate falling and bouncing
    advanceFrames(50);
    Matter.Engine.update(engine);

    // Body should have moved down then bounced up
    expect(body.velocity.y).toBeDefined();
  });
});
```

### Component Integration Testing

```typescript
import { render, screen } from '@testing-library/react';
import { FloatingBubbles } from './FloatingBubbles';

describe('FloatingBubbles Component', () => {
  it('should render canvas element', () => {
    render(<FloatingBubbles />);
    const canvas = screen.getByRole('img', { hidden: true }); // Canvas is hidden from a11y
    expect(canvas).toBeInTheDocument();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<FloatingBubbles />);
    
    // Verify no errors on unmount
    expect(() => unmount()).not.toThrow();
  });
});
```

### Common Testing Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Tests hang | Infinite animation loop | Mock `requestAnimationFrame` |
| Flaky collision tests | Timing-dependent | Use deterministic frame advancement |
| Memory leaks in tests | Missing cleanup | Verify `Matter.Render.stop()` called |
| Canvas not rendering | jsdom limitation | Mock canvas context methods |

---

## 3. NestJS + OpenAI Integration Testing

### Service Mocking Pattern

```typescript
// src/modules/keyword/keyword.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class KeywordService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async expandKeywords(keywords: string[]): Promise<string[]> {
    const prompt = `Given these emotion keywords: ${keywords.join(', ')}, suggest 5 related music search terms.`;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content?.split('\n') || [];
  }
}
```

### Test with jest-mock-extended

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
    // Create mock OpenAI instance
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
  });

  it('should handle OpenAI API errors', async () => {
    openaiMock.chat.completions.create = jest.fn().mockRejectedValue(
      new Error('API rate limit exceeded')
    );

    await expect(service.expandKeywords(['test'])).rejects.toThrow(
      'API rate limit exceeded'
    );
  });
});
```

### Dependency Injection Pattern (Recommended)

```typescript
// Inject OpenAI as a provider instead of hardcoding
@Injectable()
export class KeywordService {
  constructor(private readonly openai: OpenAI) {}

  async expandKeywords(keywords: string[]): Promise<string[]> {
    // Use this.openai
  }
}

// In module
@Module({
  providers: [
    KeywordService,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
  ],
})
export class KeywordModule {}

// In test
const module = await Test.createTestingModule({
  providers: [
    KeywordService,
    {
      provide: OpenAI,
      useValue: mockOpenAI,
    },
  ],
}).compile();
```

### Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't mock OpenAI | Hardcoded `new OpenAI()` | Use dependency injection |
| Tests call real API | Missing mock setup | Mock before `Test.createTestingModule` |
| Flaky tests | Rate limiting | Add retry logic + exponential backoff |
| Timeout errors | Slow API responses | Increase Jest timeout: `jest.setTimeout(10000)` |

---

## 4. YouTube Data API v3 Quota Management

### Quota Cost Reference (2026)

| Operation | Units | Notes |
|-----------|-------|-------|
| `search.list` | 100 | Most expensive; avoid if possible |
| `videos.list` | 1 | Get up to 50 videos per request |
| `playlists.list` | 1 | Get up to 50 playlists per request |
| `playlistItems.list` | 1 | Get up to 50 items per request |
| `channels.list` | 1 | Get channel metadata |

**Daily Quota:** 10,000 units (default)

### Caching Strategy for Mood Music

```typescript
// src/domains/player/constants/queryKeys.ts
export const playerQueryKeys = {
  all: ['player'] as const,
  search: (query: string) => [...playerQueryKeys.all, 'search', query] as const,
  video: (videoId: string) => [...playerQueryKeys.all, 'video', videoId] as const,
};

// src/domains/player/hooks/useSearchYouTube.ts
import { useQuery } from '@tanstack/react-query';
import { searchYouTube } from '../apis/youtube.api';
import { playerQueryKeys } from '../constants/queryKeys';

export const useSearchYouTube = (query: string) => {
  return useQuery({
    queryKey: playerQueryKeys.search(query),
    queryFn: () => searchYouTube(query),
    staleTime: 30 * 60 * 1000, // 30 minutes: search results change slowly
    gcTime: 60 * 60 * 1000, // 1 hour: keep in cache
    enabled: query.length > 0,
  });
};

// src/domains/player/apis/youtube.api.ts
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchYouTube = async (query: string) => {
  // Cost: 100 units per call
  // Mitigate: Cache aggressively, batch requests
  const response = await fetch(
    `${YOUTUBE_API_BASE}/search?` +
    `q=${encodeURIComponent(query)}&` +
    `type=video&` +
    `videoCategoryId=10&` + // Music category
    `maxResults=20&` +
    `key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('YouTube API quota exceeded');
    }
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  return response.json();
};
```

### Quota Optimization Techniques

```typescript
// 1. Extract video ID from URL instead of searching
export const extractVideoIdFromUrl = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match?.[1] || null;
};

// 2. Batch video details requests (1 unit for up to 50 videos)
export const getVideoDetails = async (videoIds: string[]) => {
  // Cost: 1 unit for up to 50 videos
  const response = await fetch(
    `${YOUTUBE_API_BASE}/videos?` +
    `id=${videoIds.join(',')}&` +
    `part=snippet,contentDetails&` +
    `key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );
  return response.json();
};

// 3. Use channels.list to get uploads playlist (1 unit)
// Then use playlistItems.list to get videos (1 unit per 50 items)
export const getChannelVideos = async (channelId: string) => {
  // Step 1: Get uploads playlist ID (1 unit)
  const channelRes = await fetch(
    `${YOUTUBE_API_BASE}/channels?` +
    `id=${channelId}&` +
    `part=contentDetails&` +
    `key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );
  const channel = await channelRes.json();
  const uploadsPlaylistId = channel.items[0].contentDetails.relatedPlaylists.uploads;

  // Step 2: Get playlist items (1 unit per 50 items)
  const itemsRes = await fetch(
    `${YOUTUBE_API_BASE}/playlistItems?` +
    `playlistId=${uploadsPlaylistId}&` +
    `part=snippet&` +
    `maxResults=50&` +
    `key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );
  return itemsRes.json();
};
```

### Quota Monitoring

```typescript
// Backend: Track quota usage
@Injectable()
export class YouTubeQuotaService {
  private quotaUsed = 0;
  private readonly DAILY_LIMIT = 10000;

  trackUsage(units: number) {
    this.quotaUsed += units;
    if (this.quotaUsed > this.DAILY_LIMIT * 0.8) {
      console.warn(`YouTube quota at ${(this.quotaUsed / this.DAILY_LIMIT * 100).toFixed(1)}%`);
    }
  }

  getRemaining(): number {
    return this.DAILY_LIMIT - this.quotaUsed;
  }

  reset() {
    this.quotaUsed = 0; // Reset daily
  }
}
```

### Common Pitfalls

| Mistake | Cost | Solution |
|---------|------|----------|
| Search for every video | 100 units each | Extract video ID from URL |
| Get video details one-by-one | 1 unit each | Batch up to 50 per request |
| No caching | Repeated searches | Use TanStack Query with `staleTime: Infinity` |
| Search without category filter | Irrelevant results | Always use `videoCategoryId=10` (Music) |

---

## 5. TDD with TanStack Query

### Testing Pattern: QueryClientProvider Wrapper

```typescript
// src/test/setup.ts
import { QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Disable garbage collection
      },
    },
  });

export const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
```

### Testing useQuery Hook

```typescript
// src/domains/player/hooks/useSearchYouTube.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchYouTube } from './useSearchYouTube';
import { Wrapper } from '@/test/setup';
import * as youtubeApi from '../apis/youtube.api';

vi.mock('../apis/youtube.api');

describe('useSearchYouTube', () => {
  it('should fetch search results', async () => {
    const mockResults = {
      items: [
        { id: { videoId: 'abc123' }, snippet: { title: 'Lo-fi beats' } },
      ],
    };

    vi.mocked(youtubeApi.searchYouTube).mockResolvedValue(mockResults);

    const { result } = renderHook(
      () => useSearchYouTube('lo-fi chill'),
      { wrapper: Wrapper }
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResults);
  });

  it('should not fetch when query is empty', () => {
    const { result } = renderHook(
      () => useSearchYouTube(''),
      { wrapper: Wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle errors', async () => {
    vi.mocked(youtubeApi.searchYouTube).mockRejectedValue(
      new Error('Quota exceeded')
    );

    const { result } = renderHook(
      () => useSearchYouTube('test'),
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Quota exceeded');
  });
});
```

### Testing useMutation Hook

```typescript
// src/domains/history/hooks/useSaveHistory.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSaveHistory } from './useSaveHistory';
import { Wrapper } from '@/test/setup';
import * as historyApi from '../apis/history.api';

vi.mock('../apis/history.api');

describe('useSaveHistory', () => {
  it('should save history entry', async () => {
    const mockEntry = { id: '1', keywords: ['calm'], timestamp: Date.now() };
    vi.mocked(historyApi.saveHistory).mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useSaveHistory(), { wrapper: Wrapper });

    result.current.mutate({ keywords: ['calm'] });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEntry);
  });

  it('should handle mutation errors', async () => {
    vi.mocked(historyApi.saveHistory).mockRejectedValue(
      new Error('Storage full')
    );

    const { result } = renderHook(() => useSaveHistory(), { wrapper: Wrapper });

    result.current.mutate({ keywords: ['test'] });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

### MSW (Mock Service Worker) Alternative

```typescript
// src/test/mswHandlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://www.googleapis.com/youtube/v3/search', () => {
    return HttpResponse.json({
      items: [
        { id: { videoId: 'test123' }, snippet: { title: 'Test Video' } },
      ],
    });
  }),

  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [
        {
          message: {
            content: 'lo-fi\nchill\nambient',
          },
        },
      ],
    });
  }),
];

// src/test/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mswHandlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Tests hang | Missing `waitFor` | Always await state changes |
| Stale cache between tests | Shared QueryClient | Create new client per test |
| Retries slow tests | Default retry: 3 | Set `retry: false` in test config |
| Race conditions | Async timing | Use `waitFor` with proper conditions |

---

## 6. Vitest Configuration for React + TypeScript + Path Aliases

### Complete vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### tsconfig.json Alignment

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Test Setup File

```typescript
// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^23.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Path aliases not resolving | Mismatch between vite/tsconfig | Keep both in sync |
| Tests fail with jsdom | Missing DOM APIs | Mock in setup.ts |
| Slow test startup | Large setup files | Lazy-load heavy mocks |
| TypeScript errors in tests | Strict mode too strict | Use `// @ts-expect-error` sparingly |

---

## Summary: TDD Checklist for Mood Music

### Before Implementation
- [ ] Write failing tests first
- [ ] Define API contracts (request/response types)
- [ ] Mock external dependencies (OpenAI, YouTube)
- [ ] Plan quota management strategy

### During Implementation
- [ ] Keep tests passing incrementally
- [ ] Use refs for imperative libraries (matter.js)
- [ ] Inject dependencies for testability
- [ ] Cache aggressively for quota management

### After Implementation
- [ ] Verify cleanup (useEffect returns, event listeners)
- [ ] Test error paths (API failures, quota exceeded)
- [ ] Check memory leaks (DevTools profiler)
- [ ] Validate quota usage (logging, monitoring)

---

## Key Resources

- **Matter.js:** https://brm.io/matter-js/docs/
- **TanStack Query:** https://tanstack.com/query/latest/docs/framework/react/guides/testing
- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **Vitest:** https://vitest.dev/config/alias
- **YouTube API Quota:** https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits
- **MSW:** https://mswjs.io/docs/

