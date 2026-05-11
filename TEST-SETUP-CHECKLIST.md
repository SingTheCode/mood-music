# Test Setup Checklist for Mood Music App

## Phase 1: Project Configuration (Before Writing Tests)

### Frontend (apps/client)

- [ ] **Vitest Setup**
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
  ```
  - [ ] Create `vitest.config.ts` with path aliases
  - [ ] Create `src/test/setup.ts` with global mocks
  - [ ] Add test scripts to `package.json`

- [ ] **Path Aliases**
  - [ ] Verify `tsconfig.json` has `paths: { "@/*": ["src/*"] }`
  - [ ] Verify `vitest.config.ts` has matching `resolve.alias`
  - [ ] Test: `import { something } from '@/domains/keyword'` works

- [ ] **TanStack Query Test Wrapper**
  - [ ] Create `src/test/setup.ts` with `createTestQueryClient()`
  - [ ] Create `Wrapper` component for `renderHook`
  - [ ] Disable retries in test config

- [ ] **Matter.js Mocking**
  - [ ] Mock `requestAnimationFrame` in setup
  - [ ] Create `advanceFrames()` helper
  - [ ] Mock canvas context methods

### Backend (apps/server)

- [ ] **NestJS Testing Module**
  - [ ] Verify Jest is configured (comes with NestJS)
  - [ ] Create test database/fixtures
  - [ ] Set up `Test.createTestingModule` pattern

- [ ] **OpenAI Mocking**
  - [ ] Install `@golevelup/ts-jest` for `createMock`
  - [ ] Create mock OpenAI provider
  - [ ] Test: Mock can be injected via DI

- [ ] **YouTube API Mocking**
  - [ ] Create mock YouTube API responses
  - [ ] Test: Quota tracking works

---

## Phase 2: Test File Structure

### Frontend

```
apps/client/src/
├── test/
│   ├── setup.ts                    # Global mocks, QueryClient wrapper
│   ├── mswHandlers.ts              # MSW handlers (optional)
│   └── fixtures/                   # Mock data
│       ├── keywords.ts
│       ├── youtube.ts
│       └── history.ts
├── domains/
│   ├── keyword/
│   │   ├── components/
│   │   │   ├── FloatingBubbles.tsx
│   │   │   └── __tests__/
│   │   │       └── FloatingBubbles.test.tsx
│   │   ├── hooks/
│   │   │   ├── useKeywordSelection.ts
│   │   │   └── __tests__/
│   │   │       └── useKeywordSelection.test.ts
│   │   ├── utils/
│   │   │   ├── keywordCombination.ts
│   │   │   └── __tests__/
│   │   │       └── keywordCombination.test.ts
│   │   └── apis/
│   │       ├── keyword.api.ts
│   │       └── __tests__/
│   │           └── keyword.api.test.ts
│   ├── player/
│   │   ├── hooks/
│   │   │   ├── useSearchYouTube.ts
│   │   │   └── __tests__/
│   │   │       └── useSearchYouTube.test.ts
│   │   └── apis/
│   │       ├── youtube.api.ts
│   │       └── __tests__/
│   │           └── youtube.api.test.ts
│   └── history/
│       ├── hooks/
│       │   ├── useSaveHistory.ts
│       │   └── __tests__/
│       │       └── useSaveHistory.test.ts
│       └── utils/
│           ├── historyStorage.ts
│           └── __tests__/
│               └── historyStorage.test.ts
```

### Backend

```
apps/server/src/
├── modules/
│   ├── keyword/
│   │   ├── keyword.service.ts
│   │   ├── keyword.service.spec.ts
│   │   ├── keyword.controller.ts
│   │   ├── keyword.controller.spec.ts
│   │   └── __mocks__/
│   │       └── openai.mock.ts
│   ├── youtube/
│   │   ├── youtube.service.ts
│   │   ├── youtube.service.spec.ts
│   │   └── __mocks__/
│   │       └── youtube.mock.ts
│   └── history/
│       ├── history.service.ts
│       └── history.service.spec.ts
└── test/
    ├── fixtures/
    │   ├── keywords.fixture.ts
    │   ├── youtube.fixture.ts
    │   └── history.fixture.ts
    └── helpers/
        └── test-module.helper.ts
```

---

## Phase 3: Test Writing Order (TDD)

### Week 1: Utilities & Pure Functions

1. **Frontend Utils** (no dependencies)
   - [ ] `keywordCombination.test.ts` - Combine keywords into search query
   - [ ] `historyStorage.test.ts` - LocalStorage CRUD operations
   - [ ] `youtubeUrlParser.test.ts` - Extract video ID from URL

2. **Backend Utils**
   - [ ] `quotaCalculator.test.ts` - Calculate API quota usage
   - [ ] `keywordExpander.test.ts` - Transform keywords to search terms

### Week 2: API Functions & Hooks

3. **Frontend API Functions**
   - [ ] `youtube.api.test.ts` - Mock YouTube API calls
   - [ ] `keyword.api.test.ts` - Mock OpenAI keyword expansion

4. **Frontend Hooks**
   - [ ] `useSearchYouTube.test.ts` - Query hook with TanStack Query
   - [ ] `useSaveHistory.test.ts` - Mutation hook
   - [ ] `useKeywordSelection.test.ts` - State management hook

5. **Backend Services**
   - [ ] `keyword.service.spec.ts` - OpenAI integration
   - [ ] `youtube.service.spec.ts` - YouTube API integration
   - [ ] `history.service.spec.ts` - Database operations

### Week 3: Components & Integration

6. **Frontend Components**
   - [ ] `FloatingBubbles.test.tsx` - Matter.js physics component
   - [ ] `KeywordChip.test.tsx` - Simple UI component
   - [ ] `PlayerPage.test.tsx` - Page integration

7. **Backend Controllers & E2E**
   - [ ] `keyword.controller.spec.ts` - HTTP endpoints
   - [ ] E2E tests - Full user flows

---

## Phase 4: Coverage Targets

| Layer | Target | Priority |
|-------|--------|----------|
| Utils | 100% | High |
| Hooks | 80%+ | High |
| API functions | 80%+ | High |
| Components | 70%+ | Medium |
| Services | 80%+ | High |
| Controllers | 60%+ | Medium |

---

## Phase 5: CI/CD Integration

- [ ] Add test scripts to GitHub Actions
- [ ] Fail build if coverage drops below threshold
- [ ] Run tests on every PR
- [ ] Generate coverage reports

---

## Quick Start Commands

```bash
# Frontend
npm run test:client              # Run tests once
npm run test:watch              # Watch mode
npm run test:coverage           # Coverage report
npm run typecheck:client        # Type checking

# Backend
npm run test:server             # Run tests once
npm run test:e2e                # E2E tests
npm run typecheck:server        # Type checking

# All
npm run lint                    # ESLint
npm run format                  # Prettier
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Path aliases not resolving | Sync `tsconfig.json` and `vitest.config.ts` |
| Tests hang on matter.js | Mock `requestAnimationFrame` in setup |
| QueryClient shared between tests | Create new client per test |
| OpenAI mock not working | Use dependency injection, not hardcoded `new OpenAI()` |
| YouTube quota exceeded in tests | Mock all API calls, never call real API |
| Canvas rendering fails | Mock canvas context in jsdom |

