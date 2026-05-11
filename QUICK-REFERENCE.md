# TDD Quick Reference: Mood Music App

**One-page cheat sheet for the most critical patterns.**

---

## 1️⃣ Matter.js + React: The Pattern

```typescript
// ✅ DO: Use refs, cleanup in useEffect return
const engineRef = useRef<Matter.Engine | null>(null);

useEffect(() => {
  const engine = Matter.Engine.create();
  engineRef.current = engine;
  
  return () => {
    Matter.Engine.clear(engine);
    Matter.Render.stop(render);
  };
}, []);

// ❌ DON'T: Store engine in state
const [engine, setEngine] = useState(null); // Causes re-renders!
```

**Key:** Physics engines are imperative, not declarative. Use refs.

---

## 2️⃣ Testing Matter.js: Mock requestAnimationFrame

```typescript
// src/test/setup.ts
const callbacks: FrameRequestCallback[] = [];

global.requestAnimationFrame = vi.fn((cb) => {
  callbacks.push(cb);
  return ++frameId;
});

export const advanceFrames = (count: number) => {
  for (let i = 0; i < count; i++) {
    const cbs = [...callbacks];
    callbacks.length = 0;
    cbs.forEach(cb => cb(performance.now()));
  }
};

// In test:
advanceFrames(10);
Matter.Engine.update(engine);
expect(body.position.y).toBeGreaterThan(initialY);
```

**Key:** Deterministic frame advancement = no flaky tests.

---

## 3️⃣ NestJS + OpenAI: Dependency Injection

```typescript
// ✅ DO: Inject OpenAI
@Injectable()
export class KeywordService {
  constructor(private readonly openai: OpenAI) {}
}

// In module:
providers: [
  KeywordService,
  {
    provide: OpenAI,
    useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  },
]

// In test:
const module = await Test.createTestingModule({
  providers: [
    KeywordService,
    { provide: OpenAI, useValue: mockOpenAI },
  ],
}).compile();

// ❌ DON'T: Hardcode new OpenAI()
export class KeywordService {
  private openai = new OpenAI(); // Can't mock!
}
```

**Key:** DI = testable. Hardcoding = untestable.

---

## 4️⃣ YouTube API: Quota Management

| Operation | Cost | Strategy |
|-----------|------|----------|
| `search.list` | 100 units | Avoid. Extract video ID from URL instead. |
| `videos.list` | 1 unit (50 videos) | Batch requests. |
| `channels.list` | 1 unit | Get uploads playlist ID. |
| `playlistItems.list` | 1 unit (50 items) | Paginate efficiently. |

**Caching:**
```typescript
useQuery({
  queryKey: playerQueryKeys.search(query),
  queryFn: () => searchYouTube(query),
  staleTime: 30 * 60 * 1000,  // 30 min: search results stable
  gcTime: 60 * 60 * 1000,     // 1 hour: keep in memory
  enabled: query.length > 0,
});
```

**Key:** Cache aggressively. Search = 100 units. Avoid at all costs.

---

## 5️⃣ TanStack Query Testing: QueryClientProvider Wrapper

```typescript
// src/test/setup.ts
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

export const Wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

// In test:
const { result } = renderHook(() => useSearchYouTube('test'), {
  wrapper: Wrapper,
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

**Key:** New QueryClient per test. Disable retries. Always use `waitFor`.

---

## 6️⃣ Vitest Config: Path Aliases

```typescript
// vitest.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

**Key:** Keep vite and tsconfig in sync. Test both.

---

## Common Pitfalls & Fixes

| Pitfall | Fix |
|---------|-----|
| Tests hang on matter.js | Mock `requestAnimationFrame` |
| Can't mock OpenAI | Use dependency injection |
| QueryClient shared between tests | Create new client per test |
| Path aliases not resolving | Sync `vitest.config.ts` and `tsconfig.json` |
| YouTube quota exceeded in tests | Mock all API calls |
| Memory leaks in components | Verify cleanup in useEffect return |
| Flaky collision tests | Use deterministic frame advancement |
| Tests call real API | Mock before `Test.createTestingModule` |

---

## Test Writing Order (Priority)

1. **Utils** (100% coverage) - Pure functions, no dependencies
2. **API functions** (80%+ coverage) - Mock external APIs
3. **Hooks** (80%+ coverage) - Use QueryClientProvider wrapper
4. **Services** (80%+ coverage) - Use Test.createTestingModule
5. **Components** (70%+ coverage) - Integration tests
6. **Controllers** (60%+ coverage) - E2E tests

---

## Commands

```bash
# Frontend
npm run test:client              # Run once
npm run test:watch              # Watch mode
npm run test:coverage           # Coverage report

# Backend
npm run test:server             # Run once
npm run test:e2e                # E2E tests

# All
npm run lint && npm run format  # Code quality
```

---

## Critical Reminders

✅ **DO:**
- Write tests first (TDD)
- Mock external dependencies
- Use dependency injection
- Test error paths
- Cleanup resources
- Cache aggressively (YouTube)
- Use refs for imperative libraries

❌ **DON'T:**
- Call real APIs in tests
- Hardcode dependencies
- Store physics engines in state
- Share QueryClient between tests
- Forget useEffect cleanup
- Search YouTube without category filter
- Use `as any` or `as unknown as T`

---

## Resources

- **Matter.js Docs:** https://brm.io/matter-js/docs/
- **TanStack Query Testing:** https://tanstack.com/query/latest/docs/framework/react/guides/testing
- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **Vitest:** https://vitest.dev/
- **YouTube API Quota:** https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits

