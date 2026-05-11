# TDD Implementation Roadmap: Mood Music App

**Complete guide from research to production-ready code.**

---

## 📋 What You Have

Four comprehensive documents in your project root:

1. **TDD-RESEARCH.md** (6,500+ lines)
   - Deep dive into all 6 topics
   - Real code examples
   - Common pitfalls & solutions
   - Official resource links

2. **TEST-SETUP-CHECKLIST.md**
   - Phase-by-phase setup
   - File structure templates
   - 3-week test writing schedule
   - Coverage targets

3. **PRACTICAL-EXAMPLES.md**
   - 5 complete working examples
   - Keyword combination (pure function)
   - YouTube search (API function)
   - useSearchYouTube (TanStack Query hook)
   - KeywordService (NestJS + OpenAI)
   - FloatingBubbles (Matter.js component)

4. **QUICK-REFERENCE.md**
   - One-page cheat sheet
   - Critical patterns
   - Common pitfalls table
   - Commands & resources

---

## 🚀 Getting Started (Next 2 Hours)

### Step 1: Frontend Setup (30 min)

```bash
cd apps/client

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom

# Create test infrastructure
mkdir -p src/test
touch src/test/setup.ts
touch vitest.config.ts
```

**Copy from PRACTICAL-EXAMPLES.md:**
- `vitest.config.ts` configuration
- `src/test/setup.ts` with QueryClient wrapper and requestAnimationFrame mock

### Step 2: Backend Setup (30 min)

```bash
cd apps/server

# Install mocking library
npm install -D @golevelup/ts-jest

# Create test fixtures
mkdir -p src/test/fixtures
touch src/test/fixtures/keywords.fixture.ts
```

**Copy from PRACTICAL-EXAMPLES.md:**
- NestJS Test.createTestingModule pattern
- OpenAI mock setup

### Step 3: Write First Test (1 hour)

**Start with pure function (lowest risk):**

```bash
# Frontend
touch apps/client/src/domains/keyword/utils/keywordCombination.ts
touch apps/client/src/domains/keyword/utils/__tests__/keywordCombination.test.ts
```

Copy the complete example from PRACTICAL-EXAMPLES.md section 1.

Run:
```bash
npm run test:client -- keywordCombination.test.ts --watch
```

Watch it fail (Red) → Implement (Green) → Refactor (Refactor).

---

## 📅 3-Week Implementation Plan

### Week 1: Utilities & Pure Functions (100% Coverage)

**Frontend:**
- [ ] `keywordCombination.test.ts` ✅ (from PRACTICAL-EXAMPLES.md)
- [ ] `youtubeUrlParser.test.ts` - Extract video ID from URL
- [ ] `historyStorage.test.ts` - LocalStorage CRUD

**Backend:**
- [ ] `quotaCalculator.test.ts` - Calculate API units used
- [ ] `keywordExpander.test.ts` - Transform keywords

**Effort:** 2-3 hours per file. Pure functions = fast tests.

### Week 2: API Functions & Hooks (80%+ Coverage)

**Frontend:**
- [ ] `youtube.api.test.ts` ✅ (from PRACTICAL-EXAMPLES.md)
- [ ] `keyword.api.test.ts` - OpenAI keyword expansion
- [ ] `useSearchYouTube.test.ts` ✅ (from PRACTICAL-EXAMPLES.md)
- [ ] `useSaveHistory.test.ts` - Mutation hook

**Backend:**
- [ ] `keyword.service.spec.ts` ✅ (from PRACTICAL-EXAMPLES.md)
- [ ] `youtube.service.spec.ts` - YouTube API integration
- [ ] `history.service.spec.ts` - Database operations

**Effort:** 1-2 hours per test. Use mocks from PRACTICAL-EXAMPLES.md.

### Week 3: Components & Integration (70%+ Coverage)

**Frontend:**
- [ ] `FloatingBubbles.test.tsx` ✅ (from PRACTICAL-EXAMPLES.md)
- [ ] `KeywordChip.test.tsx` - Simple UI component
- [ ] `PlayerPage.test.tsx` - Page integration

**Backend:**
- [ ] `keyword.controller.spec.ts` - HTTP endpoints
- [ ] E2E tests - Full user flows

**Effort:** 2-3 hours per component. Most complex layer.

---

## 🎯 Critical Success Factors

### 1. Dependency Injection (NestJS)

**MUST DO:**
```typescript
// ✅ Testable
@Injectable()
export class KeywordService {
  constructor(private readonly openai: OpenAI) {}
}

// ❌ Untestable
@Injectable()
export class KeywordService {
  private openai = new OpenAI();
}
```

**Impact:** Without DI, you cannot mock OpenAI. Tests will call real API.

### 2. useRef for Matter.js (React)

**MUST DO:**
```typescript
// ✅ Correct
const engineRef = useRef<Matter.Engine | null>(null);
useEffect(() => {
  const engine = Matter.Engine.create();
  engineRef.current = engine;
  return () => Matter.Engine.clear(engine);
}, []);

// ❌ Wrong
const [engine, setEngine] = useState(null);
```

**Impact:** State causes re-renders on every physics tick. Performance disaster.

### 3. QueryClient Per Test (TanStack Query)

**MUST DO:**
```typescript
// ✅ Correct
export const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

export const Wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

// ❌ Wrong
const queryClient = new QueryClient(); // Shared across tests!
```

**Impact:** Shared cache causes flaky tests. Tests interfere with each other.

### 4. YouTube Quota Awareness

**MUST DO:**
- Extract video ID from URL (0 units) instead of searching (100 units)
- Batch video details requests (1 unit for 50 videos)
- Cache search results for 30 minutes
- Never call real YouTube API in tests

**Impact:** 10,000 units/day limit. Naive implementation burns through in ~10 requests.

### 5. Mock requestAnimationFrame (Matter.js Testing)

**MUST DO:**
```typescript
// In setup.ts
export const advanceFrames = (count: number) => {
  for (let i = 0; i < count; i++) {
    const cbs = [...callbacks];
    callbacks.length = 0;
    cbs.forEach(cb => cb(performance.now()));
  }
};

// In test
advanceFrames(10);
Matter.Engine.update(engine);
expect(body.position.y).toBeGreaterThan(initialY);
```

**Impact:** Without mocking, tests hang or timeout. With mocking, deterministic & fast.

### 6. Path Alias Sync (Vitest)

**MUST DO:**
```typescript
// vitest.config.ts
resolve: { alias: { '@': path.resolve(__dirname, './src') } }

// tsconfig.json
"paths": { "@/*": ["src/*"] }
```

**Impact:** Mismatched aliases cause import errors in tests.

---

## 🔍 Verification Checklist

Before moving to next layer, verify:

- [ ] All tests pass: `npm run test:client` / `npm run test:server`
- [ ] No console errors or warnings
- [ ] Coverage meets target (see TEST-SETUP-CHECKLIST.md)
- [ ] No `// @ts-ignore` or `as any` in new code
- [ ] Cleanup verified (useEffect returns, event listeners)
- [ ] Mocks never call real APIs
- [ ] No hardcoded dependencies

---

## 📊 Coverage Targets

| Layer | Target | Why |
|-------|--------|-----|
| Utils | 100% | Pure functions, easy to test |
| Hooks | 80%+ | Complex state, worth testing |
| API functions | 80%+ | External dependencies, must mock |
| Services | 80%+ | Business logic, critical |
| Components | 70%+ | UI testing is harder, 70% is good |
| Controllers | 60%+ | Mostly routing, less critical |

**Total target:** 75%+ project-wide coverage.

---

## 🚨 Common Mistakes to Avoid

| Mistake | Cost | Prevention |
|---------|------|-----------|
| Calling real YouTube API in tests | Quota burned, tests fail | Mock all API calls |
| Storing Matter.js engine in state | Performance degradation | Use useRef |
| Sharing QueryClient between tests | Flaky tests, hard to debug | Create new client per test |
| Hardcoding OpenAI in service | Can't mock, tests call real API | Use dependency injection |
| Forgetting useEffect cleanup | Memory leaks, tests hang | Always return cleanup function |
| Mismatched path aliases | Import errors in tests | Sync vitest.config.ts & tsconfig.json |
| Not mocking requestAnimationFrame | Tests hang or timeout | Mock in setup.ts |
| Testing implementation details | Brittle tests, hard to refactor | Test behavior, not internals |

---

## 📚 Document Reference

**When you need...**

| Need | Document | Section |
|------|----------|---------|
| Deep understanding of a topic | TDD-RESEARCH.md | Topic 1-6 |
| Setup instructions | TEST-SETUP-CHECKLIST.md | Phase 1-2 |
| Working code to copy | PRACTICAL-EXAMPLES.md | Section 1-5 |
| Quick lookup | QUICK-REFERENCE.md | Any section |
| Implementation plan | This file | 3-Week Plan |

---

## 🎓 Learning Path

1. **Read:** QUICK-REFERENCE.md (15 min)
2. **Understand:** TDD-RESEARCH.md sections 1-3 (1 hour)
3. **Setup:** TEST-SETUP-CHECKLIST.md Phase 1-2 (1 hour)
4. **Implement:** PRACTICAL-EXAMPLES.md section 1 (1 hour)
5. **Repeat:** Sections 2-5 of PRACTICAL-EXAMPLES.md (5 hours)
6. **Deep dive:** TDD-RESEARCH.md sections 4-6 (2 hours)

**Total:** ~10 hours to full competency.

---

## ✅ Success Criteria

You'll know you're doing TDD right when:

- ✅ Tests fail first (Red phase)
- ✅ Implementation makes tests pass (Green phase)
- ✅ Code is refactored without breaking tests (Refactor phase)
- ✅ No real API calls in tests
- ✅ Tests run in <100ms per file
- ✅ Coverage is 75%+
- ✅ New features start with failing tests
- ✅ Bugs are caught by tests before production

---

## 🔗 Next Steps

1. **Today:** Setup frontend & backend test infrastructure (2 hours)
2. **Tomorrow:** Write first 3 pure function tests (3 hours)
3. **This week:** Complete Week 1 utilities (10 hours)
4. **Next week:** Week 2 API functions & hooks (15 hours)
5. **Week 3:** Components & integration (15 hours)

**Total effort:** ~40 hours to full TDD coverage.

---

## 📞 Quick Help

**Tests hang?**
→ Check QUICK-REFERENCE.md "Common Pitfalls" → Mock requestAnimationFrame

**Can't mock OpenAI?**
→ Check PRACTICAL-EXAMPLES.md section 4 → Use dependency injection

**Path aliases not working?**
→ Check QUICK-REFERENCE.md section 6 → Sync vitest.config.ts & tsconfig.json

**YouTube quota exceeded?**
→ Check TDD-RESEARCH.md section 4 → Mock all API calls

**QueryClient shared between tests?**
→ Check PRACTICAL-EXAMPLES.md section 3 → Create new client per test

---

## 📖 Official Resources

- **Matter.js:** https://brm.io/matter-js/docs/
- **TanStack Query Testing:** https://tanstack.com/query/latest/docs/framework/react/guides/testing
- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **Vitest:** https://vitest.dev/
- **YouTube API Quota:** https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits

---

**Last Updated:** May 12, 2026  
**Status:** Ready for implementation  
**Confidence Level:** High (based on 2026 best practices)

