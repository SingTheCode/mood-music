# Vitest Configuration Learnings

## Setup Pattern
- vitest.config.ts: Use `@vitejs/plugin-react-swc` (NOT @vitejs/plugin-react)
- globals: true enables describe/it/expect without imports
- jsdom environment for DOM testing
- setupFiles points to test-setup.ts for global setup

## Test Utils Pattern
- createTestQueryClient: QueryClient with retry:false, gcTime:Infinity
- createWrapper: Returns Wrapper component with QueryClientProvider
- renderWithProviders: Custom render function that applies wrapper automatically

## requestAnimationFrame Mock
- Use vi.stubGlobal for RAF/CAF mocking
- RAF callback delayed by 16ms (60fps simulation)
- Essential for physics-based UI tests (floating bubble animations)

## TypeScript Integration
- Add "vitest/globals" to tsconfig.json types array
- Enables type inference for describe/it/expect without imports
- Strict mode compatible

## Wave 1 Completion Summary

### Test Infrastructure
- Vitest: jsdom environment, globals enabled, setupFiles for cleanup + RAF mock
- Jest: ts-jest transformer, moduleNameMapper for @ alias resolution
- Test utils: QueryClient wrapper pattern for TanStack Query isolation

### Environment Configuration
- Server: YOUTUBE_API_KEY, LLM_API_KEY, LLM_MODEL, PORT
- Client: VITE_API_BASE_URL
- All .env.example files use placeholders (no real secrets)

### Shared Types Pattern
- JSDoc comments on all interface properties (MANDATORY per AGENTS.md)
- Enum-based types for constrained values (FeedbackReaction, SubscriptionTier, AdType)
- Interface-based types for complex objects (FeedbackEntry, SubscriptionInfo, AdRewardResult)

### Keyword Constants
- 36 total keywords across 5 categories
- Structure: { id, label, category, color }
- Color mapping: Tailwind bg-* classes for UI consistency
- KEYWORDS_BY_CATEGORY helper for category-based filtering

### shadcn/ui Installation
- Use `npx shadcn@latest` (NOT deprecated shadcn-ui)
- Components auto-installed to @/shared/components/ui/
- Aliases configured in components.json
