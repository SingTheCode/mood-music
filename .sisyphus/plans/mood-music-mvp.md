# 무드뮤직 MVP 전체 구현

## TL;DR

> **Quick Summary**: 감정 키워드 기반 음악 추천 앱인토스 미니앱 MVP 전체 구현. 인프라(모노레포, 빌드, 타입)는 완성 상태이며, 비즈니스 로직 0%에서 US-01~US-08 전체를 TDD로 구현한다.
>
> **Deliverables**:
>
> - 플로팅 버블 키워드 선택 UI (matter.js 물리 시뮬레이션)
> - LLM 키워드 확장 서비스 (OpenAI GPT-4o-mini)
> - YouTube Data API v3 검색 + iframe 플레이어
> - 감정 히스토리 CRUD (Storage API)
> - 미니 리액션 피드백 시스템
> - 보상형 광고 + 프리미엄 구독 (인앱결제)
> - 생성형 AI 사전 고지 UI (앱인토스 정책 준수)
>
> **Estimated Effort**: Large (4주 MVP)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Test Setup → Keyword Service → YouTube Service → Player UI → Integration

---

## Context

### Original Request

PRD v1.0 (docs/PRD.md) 기반 무드뮤직 앱인토스 미니앱 MVP 전체 구현. 8개 유저 스토리(US-01~US-08) 스코프.

### Interview Summary

**Key Discussions**:

- LLM 프로바이더: OpenAI GPT-4o-mini (빠르고 저렴, 한국어→영문 변환에 충분)
- 테스트 전략: TDD (Red-Green-Refactor) — Vitest(client) + Jest(server)
- 물리 엔진: matter.js (풍부한 물리 효과, 번들 +60KB gzip)
- 인프라 상태: 100% 완성 (workspace, 빌드, 타입, 의존성 설치 완료)
- 구현 상태: 0% (모든 서비스/컴포넌트 스텁)

**Research Findings**:

- matter.js는 useRef 패턴 사용 (React state에 넣으면 무한 리렌더)
- TanStack Query 테스트: 매 테스트마다 새 QueryClient 필수 (공유 시 flaky)
- OpenAI 서비스: NestJS DI 토큰 패턴 (`@Inject('OPENAI_CLIENT')`) 사용해야 mocking 용이
- YouTube API: search.list = 100 units/call, 일 10,000 quota → 캐싱 필수
- jsdom에 requestAnimationFrame 없음 → vitest setup에서 mock 필요

### Metis Review

**Identified Gaps** (addressed):

- 물리 시뮬레이션 3계층 분리 필요 (상태머신 / 물리 유틸 / React 래퍼) → 태스크 분리 반영
- test-utils.ts 공용 래퍼 필요 (QueryClient wrapper) → Wave 1에 포함
- OpenAI DI 토큰 패턴 강제 → 서비스 구현 태스크에 명시
- YouTube API fixture 기반 테스트 → 테스트에서 실제 API 호출 금지 명시
- 앱인토스 SDK 실제 사용 가능 여부 불확실 → Mock 인터페이스로 추상화

---

## Work Objectives

### Core Objective

PRD US-01~US-08 전체를 TDD로 구현하여 앱인토스 검수 제출 가능한 MVP를 완성한다.

### Concrete Deliverables

- `apps/client/src/pages/HomePage.tsx` — 플로팅 버블 키워드 선택
- `apps/client/src/pages/PlayerPage.tsx` — YouTube iframe 플레이어 + 플레이리스트
- `apps/client/src/pages/HistoryPage.tsx` — 감정 히스토리 목록
- `apps/client/src/domains/keyword/` — 키워드 도메인 전체
- `apps/client/src/domains/player/` — 플레이어 도메인 전체
- `apps/client/src/domains/history/` — 히스토리 도메인 전체
- `apps/server/src/modules/keyword/keyword.service.ts` — LLM 키워드 확장
- `apps/server/src/modules/youtube/youtube.service.ts` — YouTube 검색 프록시
- `apps/server/src/modules/history/history.service.ts` — 히스토리 CRUD
- `apps/server/src/modules/auth/` — 토스 인증 Guard

### Definition of Done

- [ ] `npm run test:client` → ALL PASS
- [ ] `npm run test:server` → ALL PASS
- [ ] `npm run build:client` → 성공 (0 errors)
- [ ] `npm run build:server` → 성공 (0 errors)
- [ ] `npm run lint` → 0 errors
- [ ] 모든 US-01~US-08 수락 기준 충족

### Must Have

- 키워드 2~4개 선택 제한 (UX 핵심 제약)
- LLM 키워드 확장 → YouTube 검색 쿼리 변환
- YouTube iframe 재생 (앱인토스 유일 허용 iframe)
- `🤖 AI 추천` 배지 표시 (정책 필수)
- 최초 이용 시 AI 고지 바텀시트 (위반 시 3,000만원 과태료)
- 무료 유저 일 5회 제한
- 보상형 광고 시청 → 즉시 1회 추가
- TDD: 모든 비즈니스 로직에 테스트 선행

### Must NOT Have (Guardrails)

- 소셜 무드 매칭, B2B, WebSocket, ONNX, CLAP (PRD Non-Goals)
- 감정 캘린더 뷰 (v2 — 목록만 제공)
- 흔들어서 리셋 기능
- 컴포넌트 내부 비즈니스 로직 직접 작성 (hook/util 분리 필수)
- YouTube API 키 클라이언트 노출 (서버사이드만)
- LLM API 키 클라이언트 노출
- 키워드 5개 이상 선택 허용
- 인트로/로딩/팝업에 광고 노출
- matter.js Engine을 React state에 저장 (useRef 필수)
- 테스트에서 실제 YouTube/OpenAI API 호출
- barrel file (index.ts) 생성
- `as any`, `@ts-ignore` 사용

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: YES (Vitest + Jest 설치됨, 설정 파일 없음)
- **Automated tests**: TDD (Red-Green-Refactor)
- **Framework**: Vitest (client) + Jest (server)
- **TDD Flow**: Each task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **TUI/CLI**: Use Bash — Run command, validate output
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun/node REPL) — Import, call functions, compare output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — test infra + shared utilities):
├── Task 1: Vitest config + test-utils.ts [quick]
├── Task 2: Jest config + server test fixtures [quick]
├── Task 3: .env.example + environment docs [quick]
├── Task 4: Shared types 보강 (Feedback, Subscription, AdReward) [quick]
├── Task 5: 감정 키워드 상수 목록 정의 (30~50개) [quick]
└── Task 6: shadcn/ui 기본 컴포넌트 설치 (Button, Sheet, Dialog) [quick]

Wave 2 (Backend Services — core business logic):
├── Task 7: Auth module — 토스 로그인 Guard (depends: 2) [unspecified-high]
├── Task 8: KeywordService — LLM 키워드 확장 (depends: 2, 4, 5) [deep]
├── Task 9: YouTubeService — 검색 + 캐싱 (depends: 2, 4) [deep]
├── Task 10: HistoryService — CRUD (depends: 2, 4, 7) [unspecified-high]
└── Task 11: FeedbackService — 리액션 저장 (depends: 2, 4) [quick]

Wave 3 (Frontend Domains — UI + hooks):
├── Task 12: Keyword domain — 상태머신 + 물리 유틸 (depends: 1, 5) [deep]
├── Task 13: Keyword domain — FloatingBubble React 컴포넌트 (depends: 6, 12) [visual-engineering]
├── Task 14: Player domain — API client + hooks (depends: 1, 4, 9) [unspecified-high]
├── Task 15: Player domain — YouTube iframe 플레이어 UI (depends: 6, 14) [visual-engineering]
├── Task 16: History domain — hooks + API client (depends: 1, 4, 10) [quick]
├── Task 17: History domain — 히스토리 목록 UI (depends: 6, 16) [visual-engineering]
└── Task 18: Feedback — 미니 리액션 UI (depends: 6, 11) [quick]

Wave 4 (Pages + Monetization + Policy):
├── Task 19: HomePage — 키워드 선택 + 추천 받기 (depends: 13, 14) [visual-engineering]
├── Task 20: PlayerPage — 플레이리스트 재생 (depends: 15, 18) [visual-engineering]
├── Task 21: HistoryPage — 히스토리 목록 (depends: 17) [visual-engineering]
├── Task 22: AI 고지 바텀시트 + 배지 (depends: 6) [quick]
├── Task 23: 광고 모듈 — 보상형/전면/배너 (depends: 19) [unspecified-high]
├── Task 24: 프리미엄 구독 — 인앱결제 (depends: 7) [unspecified-high]
└── Task 25: 일 5회 제한 + 보상형 광고 연동 (depends: 23, 24) [unspecified-high]

Wave FINAL (Integration Verification — 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay
```

### Dependency Matrix

| Task  | Depends On | Blocks                 | Wave  |
| ----- | ---------- | ---------------------- | ----- |
| 1     | -          | 12, 14, 16             | 1     |
| 2     | -          | 7, 8, 9, 10, 11        | 1     |
| 3     | -          | -                      | 1     |
| 4     | -          | 8, 9, 10, 11, 14, 16   | 1     |
| 5     | -          | 8, 12                  | 1     |
| 6     | -          | 13, 15, 17, 18, 19, 22 | 1     |
| 7     | 2          | 10, 24                 | 2     |
| 8     | 2, 4, 5    | 19                     | 2     |
| 9     | 2, 4       | 14                     | 2     |
| 10    | 2, 4, 7    | 16                     | 2     |
| 11    | 2, 4       | 18                     | 2     |
| 12    | 1, 5       | 13                     | 3     |
| 13    | 6, 12      | 19                     | 3     |
| 14    | 1, 4, 9    | 15, 19                 | 3     |
| 15    | 6, 14      | 20                     | 3     |
| 16    | 1, 4, 10   | 17                     | 3     |
| 17    | 6, 16      | 21                     | 3     |
| 18    | 6, 11      | 20                     | 3     |
| 19    | 13, 14     | 23                     | 4     |
| 20    | 15, 18     | -                      | 4     |
| 21    | 17         | -                      | 4     |
| 22    | 6          | -                      | 4     |
| 23    | 19         | 25                     | 4     |
| 24    | 7          | 25                     | 4     |
| 25    | 23, 24     | -                      | 4     |
| F1-F4 | ALL        | -                      | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 6 tasks — T1-T6 → `quick`
- **Wave 2**: 5 tasks — T7 → `unspecified-high`, T8-T9 → `deep`, T10 → `unspecified-high`, T11 → `quick`
- **Wave 3**: 7 tasks — T12 → `deep`, T13 → `visual-engineering`, T14 → `unspecified-high`, T15 → `visual-engineering`, T16 → `quick`, T17 → `visual-engineering`, T18 → `quick`
- **Wave 4**: 7 tasks — T19-T21 → `visual-engineering`, T22 → `quick`, T23-T25 → `unspecified-high`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

### Wave 1: Foundation

- [ ] 1. Vitest 설정 + 프론트엔드 테스트 유틸리티

  **What to do**:
  - `apps/client/vitest.config.ts` 생성 (jsdom, globals, react plugin, @ alias)
  - `apps/client/src/test-setup.ts` 생성 (@testing-library/jest-dom/vitest, cleanup, requestAnimationFrame mock)
  - `apps/client/src/test-utils.ts` 생성 (createTestQueryClient, createWrapper, custom render)
  - `apps/client/tsconfig.json`에 vitest types 추가
  - 검증: `npm run test:client` 실행 시 "no test files" 메시지 (에러 아님)

  **Must NOT do**:
  - barrel file (index.ts) 생성 금지
  - 실제 테스트 케이스 작성 (이 태스크는 설정만)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 6)
  - **Blocks**: Tasks 12, 14, 16
  - **Blocked By**: None

  **References**:
  - `apps/client/package.json` — vitest, @testing-library/react, jsdom 의존성 확인
  - `apps/client/tsconfig.json` — baseUrl, paths 설정 참조하여 alias 일치시킬 것
  - `apps/client/vite.config.mts` — 기존 vite 설정과 일관성 유지

  **Acceptance Criteria**:
  - [ ] `apps/client/vitest.config.ts` 존재하고 jsdom environment 설정됨
  - [ ] `apps/client/src/test-setup.ts`에 cleanup + requestAnimationFrame mock 포함
  - [ ] `apps/client/src/test-utils.ts`에 createWrapper 함수 export
  - [ ] `npx vitest run --passWithNoTests` → exit code 0

  **QA Scenarios**:

  ```
  Scenario: Vitest 설정 정상 동작 확인
    Tool: Bash
    Preconditions: apps/client 디렉토리에 vitest.config.ts 존재
    Steps:
      1. cd apps/client && npx vitest run --passWithNoTests
      2. exit code 확인
    Expected Result: exit code 0, "no test files found" 또는 빈 결과 (에러 아님)
    Evidence: .sisyphus/evidence/task-1-vitest-config.txt

  Scenario: test-utils.ts import 가능 확인
    Tool: Bash
    Preconditions: test-utils.ts 파일 존재
    Steps:
      1. cd apps/client && npx tsx -e "import { createWrapper } from './src/test-utils'; console.log(typeof createWrapper)"
    Expected Result: "function" 출력
    Evidence: .sisyphus/evidence/task-1-test-utils-import.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `chore: 테스트 인프라 + 공유 상수 설정`
  - Files: `apps/client/vitest.config.ts`, `apps/client/src/test-setup.ts`, `apps/client/src/test-utils.ts`

- [ ] 2. Jest 설정 + 서버 테스트 픽스처

  **What to do**:
  - `apps/server/jest.config.ts` 생성 (ts-jest, moduleNameMapper for @ alias)
  - `apps/server/test/jest-e2e.json` 업데이트 (이미 존재하면 확인)
  - `apps/server/test/fixtures/` 디렉토리 생성
  - `apps/server/test/fixtures/youtube-search-response.json` — YouTube API 응답 샘플
  - `apps/server/test/fixtures/openai-keyword-response.json` — OpenAI 응답 샘플
  - 검증: `npm run test:server` 실행 시 "no test files" (에러 아님)

  **Must NOT do**:
  - 실제 테스트 케이스 작성
  - 실제 API 키 포함

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6)
  - **Blocks**: Tasks 7, 8, 9, 10, 11
  - **Blocked By**: None

  **References**:
  - `apps/server/package.json` — jest, ts-jest, @nestjs/testing 의존성 확인
  - `apps/server/tsconfig.json` — paths 설정 참조
  - `apps/server/test/jest-e2e.json` — 기존 E2E 설정 확인

  **Acceptance Criteria**:
  - [ ] `apps/server/jest.config.ts` 존재하고 ts-jest transformer 설정됨
  - [ ] `apps/server/test/fixtures/youtube-search-response.json` 존재 (유효한 YouTube API 응답 구조)
  - [ ] `apps/server/test/fixtures/openai-keyword-response.json` 존재 (유효한 OpenAI chat completion 구조)
  - [ ] `npx jest --passWithNoTests` → exit code 0

  **QA Scenarios**:

  ```
  Scenario: Jest 설정 정상 동작 확인
    Tool: Bash
    Preconditions: apps/server 디렉토리에 jest.config.ts 존재
    Steps:
      1. cd apps/server && npx jest --passWithNoTests
      2. exit code 확인
    Expected Result: exit code 0
    Evidence: .sisyphus/evidence/task-2-jest-config.txt

  Scenario: Fixture 파일 유효한 JSON 확인
    Tool: Bash
    Steps:
      1. cd apps/server && node -e "JSON.parse(require('fs').readFileSync('test/fixtures/youtube-search-response.json','utf8')); console.log('valid')"
      2. node -e "JSON.parse(require('fs').readFileSync('test/fixtures/openai-keyword-response.json','utf8')); console.log('valid')"
    Expected Result: 두 명령 모두 "valid" 출력
    Evidence: .sisyphus/evidence/task-2-fixtures-valid.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/server/jest.config.ts`, `apps/server/test/fixtures/*`

- [ ] 3. 환경변수 문서화 (.env.example)

  **What to do**:
  - `apps/server/.env.example` 생성 (YOUTUBE_API_KEY, LLM_API_KEY, LLM_MODEL, PORT)
  - `apps/client/.env.example` 생성 (VITE_API_BASE_URL)
  - 각 변수에 설명 주석 추가
  - `.gitignore`에 `.env` 패턴 확인 (이미 있을 것)

  **Must NOT do**:
  - 실제 API 키 값 포함
  - .env 파일 자체 생성 (example만)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6)
  - **Blocks**: None (documentation only)
  - **Blocked By**: None

  **References**:
  - `apps/server/src/config/configuration.ts` — 사용 중인 환경변수 목록 확인
  - `.gitignore` — .env 패턴 존재 여부 확인

  **Acceptance Criteria**:
  - [ ] `apps/server/.env.example` 존재하고 4개 이상 변수 정의
  - [ ] `apps/client/.env.example` 존재
  - [ ] 실제 API 키 값 미포함 (placeholder만)

  **QA Scenarios**:

  ```
  Scenario: .env.example 파일 존재 및 내용 확인
    Tool: Bash
    Steps:
      1. cat apps/server/.env.example | grep -c "="
      2. cat apps/client/.env.example | grep -c "="
    Expected Result: 서버 4개 이상, 클라이언트 1개 이상 변수
    Evidence: .sisyphus/evidence/task-3-env-example.txt

  Scenario: 실제 키 미포함 확인
    Tool: Bash
    Steps:
      1. grep -r "sk-" apps/server/.env.example || echo "no real keys"
      2. grep -r "AIza" apps/server/.env.example || echo "no real keys"
    Expected Result: "no real keys" 출력 (실제 OpenAI/Google 키 패턴 없음)
    Evidence: .sisyphus/evidence/task-3-no-secrets.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/server/.env.example`, `apps/client/.env.example`

- [ ] 4. Shared types 보강 (Feedback, Subscription, AdReward)

  **What to do**:
  - `packages/shared-types/src/feedback.ts` — FeedbackReaction enum (😐/🙂/😍), FeedbackEntry interface
  - `packages/shared-types/src/subscription.ts` — SubscriptionTier enum (FREE/PREMIUM), SubscriptionStatus
  - `packages/shared-types/src/ad.ts` — AdType enum (REWARDED/INTERSTITIAL/BANNER), AdRewardResult
  - `packages/shared-types/src/index.ts` 업데이트 — 새 타입 export 추가
  - 모든 interface 프로퍼티에 JSDoc 주석 필수

  **Must NOT do**:
  - 기존 keyword.ts, player.ts, history.ts 수정 (이미 정의됨)
  - 타입별 개별 파일 과도 분리 (역할별 파일로 그룹핑)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 8, 9, 10, 11, 14, 16
  - **Blocked By**: None

  **References**:
  - `packages/shared-types/src/keyword.ts` — 기존 타입 정의 패턴 (JSDoc 스타일) 참조
  - `packages/shared-types/src/index.ts` — barrel export 패턴 참조
  - `docs/PRD.md:95-118` — US-05 피드백, US-06 광고, US-07 구독 수락 기준

  **Acceptance Criteria**:
  - [ ] `packages/shared-types/src/feedback.ts` 존재, FeedbackReaction + FeedbackEntry 정의
  - [ ] `packages/shared-types/src/subscription.ts` 존재, SubscriptionTier + SubscriptionStatus 정의
  - [ ] `packages/shared-types/src/ad.ts` 존재, AdType + AdRewardResult 정의
  - [ ] `npm run typecheck:client && npm run typecheck:server` → 0 errors
  - [ ] 모든 interface 프로퍼티에 JSDoc 주석 존재

  **QA Scenarios**:

  ```
  Scenario: 타입 패키지 빌드 및 import 가능 확인
    Tool: Bash
    Steps:
      1. cd packages/shared-types && npx tsc --noEmit
      2. cd apps/server && npx tsc --noEmit
    Expected Result: 두 명령 모두 exit code 0
    Evidence: .sisyphus/evidence/task-4-types-build.txt

  Scenario: JSDoc 주석 존재 확인
    Tool: Bash
    Steps:
      1. grep -c "/\*\*" packages/shared-types/src/feedback.ts
      2. grep -c "/\*\*" packages/shared-types/src/subscription.ts
    Expected Result: 각 파일에 3개 이상 JSDoc 블록
    Evidence: .sisyphus/evidence/task-4-jsdoc-check.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `packages/shared-types/src/feedback.ts`, `packages/shared-types/src/subscription.ts`, `packages/shared-types/src/ad.ts`, `packages/shared-types/src/index.ts`

- [ ] 5. 감정 키워드 상수 목록 정의 (30~50개)

  **What to do**:
  - `apps/client/src/domains/keyword/constants/keywords.ts` 생성
  - KeywordCategory별 키워드 배열 정의 (감정 10개, 상황 10개, 날씨/시간 8개, 분위기 8개 = 36개)
  - 각 키워드는 `{ id, label, category, color }` 구조
  - color는 카테고리별 Tailwind 색상 클래스 매핑
  - `apps/client/src/domains/keyword/` 디렉토리 구조 생성 (constants/ 만)

  **Must NOT do**:
  - 키워드 5개 이상 선택 로직 구현 (이 태스크는 상수만)
  - 다른 도메인 폴더 생성

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 8, 12
  - **Blocked By**: None

  **References**:
  - `docs/PRD.md:279-289` — 키워드 카테고리 및 예시 목록
  - `packages/shared-types/src/keyword.ts` — EmotionKeyword interface, KeywordCategory enum
  - AGENTS.md Constants 폴더 구조 — `domains/{domain}/constants/` 패턴

  **Acceptance Criteria**:
  - [ ] `apps/client/src/domains/keyword/constants/keywords.ts` 존재
  - [ ] 총 30개 이상 키워드 정의
  - [ ] 4개 카테고리 (감정, 상황, 날씨/시간, 분위기) 각각 최소 5개
  - [ ] 각 키워드에 id, label, category, color 프로퍼티 존재
  - [ ] TypeScript 타입 에러 없음

  **QA Scenarios**:

  ```
  Scenario: 키워드 개수 및 구조 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx tsx -e "import { KEYWORDS } from './src/domains/keyword/constants/keywords'; console.log('count:', KEYWORDS.length); console.log('categories:', [...new Set(KEYWORDS.map(k => k.category))])"
    Expected Result: count >= 30, categories에 4개 카테고리 포함
    Evidence: .sisyphus/evidence/task-5-keywords-count.txt

  Scenario: 키워드 구조 유효성 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx tsx -e "import { KEYWORDS } from './src/domains/keyword/constants/keywords'; const valid = KEYWORDS.every(k => k.id && k.label && k.category && k.color); console.log('all valid:', valid)"
    Expected Result: "all valid: true"
    Evidence: .sisyphus/evidence/task-5-keywords-structure.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/client/src/domains/keyword/constants/keywords.ts`

- [ ] 6. shadcn/ui 기본 컴포넌트 설치

  **What to do**:
  - `npx shadcn@latest add button` 실행
  - `npx shadcn@latest add sheet` 실행 (바텀시트용)
  - `npx shadcn@latest add dialog` 실행
  - `npx shadcn@latest add badge` 실행 (AI 추천 배지용)
  - `npx shadcn@latest add card` 실행 (히스토리 카드용)
  - `npx shadcn@latest add skeleton` 실행 (로딩 상태용)
  - 설치 후 `apps/client/src/shared/components/ui/` 하위에 파일 생성 확인

  **Must NOT do**:
  - 컴포넌트 커스터마이징 (설치만)
  - 다른 도메인 컴포넌트 생성

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 13, 15, 17, 18, 19, 22
  - **Blocked By**: None

  **References**:
  - `apps/client/components.json` — shadcn/ui 설정 (aliases, style, rsc 등)
  - `apps/client/src/shared/lib/utils.ts` — cn() 함수 위치 확인
  - `apps/client/tailwind.config.ts` — 테마 설정 확인

  **Acceptance Criteria**:
  - [ ] `apps/client/src/shared/components/ui/button.tsx` 존재
  - [ ] `apps/client/src/shared/components/ui/sheet.tsx` 존재
  - [ ] `apps/client/src/shared/components/ui/dialog.tsx` 존재
  - [ ] `apps/client/src/shared/components/ui/badge.tsx` 존재
  - [ ] `apps/client/src/shared/components/ui/card.tsx` 존재
  - [ ] `apps/client/src/shared/components/ui/skeleton.tsx` 존재
  - [ ] `npm run typecheck:client` → 0 errors

  **QA Scenarios**:

  ```
  Scenario: shadcn/ui 컴포넌트 파일 존재 확인
    Tool: Bash
    Steps:
      1. ls apps/client/src/shared/components/ui/ | sort
    Expected Result: button.tsx, badge.tsx, card.tsx, dialog.tsx, sheet.tsx, skeleton.tsx 모두 존재
    Evidence: .sisyphus/evidence/task-6-shadcn-files.txt

  Scenario: 타입 체크 통과 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx tsc --noEmit
    Expected Result: exit code 0, 에러 없음
    Evidence: .sisyphus/evidence/task-6-typecheck.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/client/src/shared/components/ui/*.tsx`

### Wave 2: Backend Services

- [ ] 7. Auth module — 토스 로그인 Guard

  **What to do**:
  - TDD: `apps/server/src/modules/auth/auth.guard.spec.ts` 작성 먼저
    - 유효한 유저 식별키 → 통과
    - 식별키 없음 → 401 UnauthorizedException
    - 잘못된 형식 → 401
  - `apps/server/src/modules/auth/auth.guard.ts` — CanActivate 구현
  - `apps/server/src/modules/auth/auth.service.ts` — 유저 식별키 검증 로직
  - `apps/server/src/modules/auth/auth.module.ts` — 모듈 등록
  - Request header에서 `x-user-id` 추출하여 검증
  - 앱인토스 SDK 실제 검증은 인터페이스로 추상화 (Mock 가능하게)

  **Must NOT do**:
  - 실제 토스 SDK 호출 (인터페이스만 정의, 구현은 Mock)
  - 세션/JWT 토큰 발급 (앱인토스는 유저 식별키만 사용)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10, 11)
  - **Blocks**: Tasks 10, 24
  - **Blocked By**: Task 2

  **References**:
  - `apps/server/src/modules/auth/` — 이미 빈 폴더 존재
  - `apps/server/src/main.ts` — ValidationPipe, CORS 설정 참조
  - `docs/PRD.md:203` — "토스 로그인 → 유저 식별키" 인증 방식
  - `packages/shared-types/src/keyword.ts` — 타입 정의 패턴 참조

  **Acceptance Criteria**:
  - [ ] `auth.guard.spec.ts` 테스트 3개 이상 PASS
  - [ ] `npm run test:server -- --testPathPattern=auth` → ALL PASS
  - [ ] x-user-id 헤더 없이 보호된 엔드포인트 호출 시 401 반환
  - [ ] 유효한 x-user-id 헤더로 호출 시 통과

  **QA Scenarios**:

  ```
  Scenario: Auth Guard 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=auth --verbose
    Expected Result: 3개 이상 테스트 PASS, 0 failures
    Evidence: .sisyphus/evidence/task-7-auth-tests.txt

  Scenario: 인증 없이 API 호출 시 401
    Tool: Bash
    Preconditions: 서버 실행 중 (npm run dev:server)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/history
    Expected Result: HTTP 401
    Evidence: .sisyphus/evidence/task-7-auth-401.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat(server): 백엔드 서비스 구현 (keyword, youtube, history, auth)`
  - Files: `apps/server/src/modules/auth/*`

- [ ] 8. KeywordService — LLM 키워드 확장

  **What to do**:
  - TDD: `apps/server/src/modules/keyword/keyword.service.spec.ts` 작성 먼저
    - 정상 입력 (2~4개 키워드) → 영문 YouTube 쿼리 반환
    - 캐시 히트 → LLM 호출 없이 캐시 반환
    - LLM 실패 → 폴백 (직접 번역 + 장르 매핑)
    - 부적절한 키워드 필터링
  - `apps/server/src/modules/keyword/keyword.service.ts` 구현
    - OpenAI GPT-4o-mini 호출 (DI 토큰: `@Inject('OPENAI_CLIENT')`)
    - 프롬프트: 한국어 감정 키워드 → YouTube 검색 최적화 영문 쿼리 (1~3개 변형)
    - 캐싱: 키워드 조합(정렬된 Set)을 키로, TTL 24시간
    - 폴백: 타임아웃 2초, 실패 시 장르 매핑 테이블
    - 부적절한 콘텐츠 필터링
  - `apps/server/src/modules/keyword/keyword.controller.ts` — POST /api/keywords/expand
  - `apps/server/src/modules/keyword/openai.provider.ts` — OpenAI 클라이언트 DI 프로바이더
  - `apps/server/src/modules/keyword/fallback-mapping.ts` — 폴백 장르 매핑 테이블

  **Must NOT do**:
  - 테스트에서 실제 OpenAI API 호출 (mock 사용)
  - API 키를 소스코드에 하드코딩
  - 클라이언트에서 직접 LLM 호출

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9, 10, 11)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 2, 4, 5

  **References**:
  - `apps/server/src/modules/keyword/` — 기존 스텁 파일 (controller, service, module, dto)
  - `apps/server/src/config/configuration.ts` — LLM_API_KEY, LLM_MODEL 환경변수
  - `apps/server/test/fixtures/openai-keyword-response.json` — OpenAI 응답 fixture (Task 2에서 생성)
  - `packages/shared-types/src/keyword.ts` — ExpandKeywordsRequest/Response 타입
  - `docs/PRD.md:146-167` — LLM 키워드 확장 엔진 요구사항 (응답시간, 캐싱, 출력형식, 폴백)

  **Acceptance Criteria**:
  - [ ] `keyword.service.spec.ts` 테스트 5개 이상 PASS
  - [ ] OpenAI 호출은 DI 토큰 `OPENAI_CLIENT`로 주입 (직접 import 금지)
  - [ ] 캐시 히트 시 LLM 미호출 확인 (mock.calls.length 검증)
  - [ ] 타임아웃 2초 설정 확인
  - [ ] 폴백 동작 확인 (LLM 에러 시 장르 매핑 반환)
  - [ ] POST /api/keywords/expand → 200 + 영문 쿼리 배열

  **QA Scenarios**:

  ```
  Scenario: 키워드 확장 서비스 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=keyword.service --verbose
    Expected Result: 5개 이상 테스트 PASS, 0 failures
    Evidence: .sisyphus/evidence/task-8-keyword-tests.txt

  Scenario: API 엔드포인트 정상 응답
    Tool: Bash
    Preconditions: 서버 실행 중, .env에 LLM_API_KEY 설정됨
    Steps:
      1. curl -s -X POST http://localhost:3000/api/keywords/expand -H "Content-Type: application/json" -H "x-user-id: test-user" -d '{"keywords":["잔잔한","새벽","혼자"]}' | jq '.queries'
    Expected Result: 영문 쿼리 문자열 배열 (1~3개), 각 쿼리에 영문 단어 포함
    Evidence: .sisyphus/evidence/task-8-keyword-api.txt

  Scenario: 폴백 동작 확인 (LLM 실패 시)
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=keyword.service --testNamePattern="fallback" --verbose
    Expected Result: 폴백 테스트 PASS (장르 매핑 결과 반환)
    Evidence: .sisyphus/evidence/task-8-keyword-fallback.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `apps/server/src/modules/keyword/*`

- [ ] 9. YouTubeService — 검색 + 캐싱

  **What to do**:
  - TDD: `apps/server/src/modules/youtube/youtube.service.spec.ts` 작성 먼저
    - 정상 검색 → 5~10개 비디오 결과 반환
    - 캐시 히트 → API 미호출
    - 빈 결과 → 빈 배열 반환 (에러 아님)
    - Quota 초과 시 에러 핸들링
  - `apps/server/src/modules/youtube/youtube.service.ts` 구현
    - YouTube Data API v3 search.list 호출 (videoCategoryId=10, type=video)
    - 캐싱: 검색 쿼리를 키로, TTL 30분
    - 결과 필터링: Music 카테고리만, 중복 제거
    - 3개 쿼리 변형 결과 병합 + 중복 제거
    - Quota 모니터링 (일 10,000 units 중 사용량 추적)
  - `apps/server/src/modules/youtube/youtube.controller.ts` — GET /api/youtube/search?q=...
  - `apps/server/src/modules/youtube/youtube.module.ts` — HttpModule import

  **Must NOT do**:
  - 테스트에서 실제 YouTube API 호출 (fixture 사용)
  - YouTube API 키 클라이언트 노출
  - 일 10,000 units 초과 허용

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 10, 11)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 2, 4

  **References**:
  - `apps/server/src/modules/youtube/` — 기존 스텁 파일
  - `apps/server/test/fixtures/youtube-search-response.json` — YouTube API 응답 fixture (Task 2에서 생성)
  - `apps/server/src/config/configuration.ts` — YOUTUBE_API_KEY 환경변수
  - `packages/shared-types/src/player.ts` — YoutubeVideo, Playlist 타입
  - `docs/PRD.md:213-222` — YouTube Data API v3 스펙 (quota, 필터, 제한)

  **Acceptance Criteria**:
  - [ ] `youtube.service.spec.ts` 테스트 4개 이상 PASS
  - [ ] 실제 YouTube API 호출 없이 fixture 기반 테스트
  - [ ] 캐시 히트 시 HTTP 요청 미발생 확인
  - [ ] videoCategoryId=10 필터 적용 확인
  - [ ] GET /api/youtube/search?q=... → 200 + YoutubeVideo[] 반환

  **QA Scenarios**:

  ```
  Scenario: YouTube 서비스 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=youtube.service --verbose
    Expected Result: 4개 이상 테스트 PASS, 0 failures
    Evidence: .sisyphus/evidence/task-9-youtube-tests.txt

  Scenario: 검색 API 엔드포인트 응답 구조 확인
    Tool: Bash
    Preconditions: 서버 실행 중, .env에 YOUTUBE_API_KEY 설정됨
    Steps:
      1. curl -s "http://localhost:3000/api/youtube/search?q=lo-fi+chill+ambient" -H "x-user-id: test-user" | jq '.[0] | keys'
    Expected Result: videoId, title, channelTitle, thumbnailUrl 등 필드 포함
    Evidence: .sisyphus/evidence/task-9-youtube-api.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `apps/server/src/modules/youtube/*`

- [ ] 10. HistoryService — CRUD

  **What to do**:
  - TDD: `apps/server/src/modules/history/history.service.spec.ts` 작성 먼저
    - 히스토리 저장 (키워드 조합 + 곡 목록 + 타임스탬프)
    - 유저별 히스토리 조회 (최근 20개, 날짜 역순)
    - 히스토리에서 재추천 (과거 조합 반환)
  - `apps/server/src/modules/history/history.service.ts` 구현
    - In-memory Map 기반 저장 (MVP — DB 없이)
    - 유저 식별키별 히스토리 관리
    - 최근 20개 제한
  - `apps/server/src/modules/history/history.controller.ts`
    - POST /api/history — 저장
    - GET /api/history — 조회 (유저별)
  - `apps/server/src/modules/history/dto/` — CreateHistoryDto, HistoryResponseDto

  **Must NOT do**:
  - 외부 DB 연동 (MVP는 in-memory)
  - 캘린더 뷰 관련 API (v2)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 11)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 2, 4, 7

  **References**:
  - `apps/server/src/modules/history/` — 기존 스텁 파일
  - `packages/shared-types/src/history.ts` — HistoryEntry 타입
  - `docs/PRD.md:84-88` — US-04 수락 기준

  **Acceptance Criteria**:
  - [ ] `history.service.spec.ts` 테스트 3개 이상 PASS
  - [ ] POST /api/history → 201 + 저장된 엔트리 반환
  - [ ] GET /api/history → 200 + 최근 20개 히스토리 (날짜 역순)
  - [ ] Auth Guard 적용 (x-user-id 필수)

  **QA Scenarios**:

  ```
  Scenario: History 서비스 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=history.service --verbose
    Expected Result: 3개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-10-history-tests.txt

  Scenario: 히스토리 저장 및 조회 E2E
    Tool: Bash
    Preconditions: 서버 실행 중
    Steps:
      1. curl -s -X POST http://localhost:3000/api/history -H "Content-Type: application/json" -H "x-user-id: test-user" -d '{"keywords":["잔잔한","새벽"],"tracks":[{"videoId":"abc","title":"Test Song"}]}' -w "\n%{http_code}"
      2. curl -s http://localhost:3000/api/history -H "x-user-id: test-user" | jq 'length'
    Expected Result: POST → 201, GET → 1개 이상 결과
    Evidence: .sisyphus/evidence/task-10-history-e2e.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `apps/server/src/modules/history/*`

- [ ] 11. FeedbackService — 리액션 저장

  **What to do**:
  - TDD: `apps/server/src/modules/feedback/feedback.service.spec.ts` 작성 먼저
    - 피드백 저장 (키워드 조합 + 곡 목록 + 리액션)
    - 유효하지 않은 리액션 값 → 400 에러
  - `apps/server/src/modules/feedback/` 디렉토리 생성
  - `feedback.service.ts` — In-memory 저장
  - `feedback.controller.ts` — POST /api/feedback
  - `feedback.module.ts` — 모듈 등록
  - `dto/create-feedback.dto.ts` — class-validator 데코레이터
  - `app.module.ts`에 FeedbackModule import 추가

  **Must NOT do**:
  - 피드백 기반 추천 개선 로직 (MVP에서는 저장만)
  - 복잡한 분석 API

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 10)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 2, 4

  **References**:
  - `packages/shared-types/src/feedback.ts` — FeedbackReaction, FeedbackEntry 타입 (Task 4에서 생성)
  - `docs/PRD.md:95-97` — US-05 수락 기준
  - `apps/server/src/modules/history/` — 유사 CRUD 패턴 참조

  **Acceptance Criteria**:
  - [ ] `feedback.service.spec.ts` 테스트 2개 이상 PASS
  - [ ] POST /api/feedback → 201 + 저장 확인
  - [ ] 잘못된 리액션 값 → 400 BadRequest
  - [ ] FeedbackModule이 app.module.ts에 등록됨

  **QA Scenarios**:

  ```
  Scenario: Feedback 서비스 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/server && npx jest --testPathPattern=feedback.service --verbose
    Expected Result: 2개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-11-feedback-tests.txt

  Scenario: 피드백 저장 API 호출
    Tool: Bash
    Preconditions: 서버 실행 중
    Steps:
      1. curl -s -X POST http://localhost:3000/api/feedback -H "Content-Type: application/json" -H "x-user-id: test-user" -d '{"keywords":["잔잔한"],"tracks":["abc"],"reaction":"LOVE"}' -w "\n%{http_code}"
      2. curl -s -X POST http://localhost:3000/api/feedback -H "Content-Type: application/json" -H "x-user-id: test-user" -d '{"keywords":["잔잔한"],"tracks":["abc"],"reaction":"INVALID"}' -w "\n%{http_code}"
    Expected Result: 첫 번째 → 201, 두 번째 → 400
    Evidence: .sisyphus/evidence/task-11-feedback-api.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `apps/server/src/modules/feedback/*`, `apps/server/src/app.module.ts`

### Wave 3: Frontend Domains

- [ ] 12. Keyword domain — 상태머신 + 물리 유틸

  **What to do**:
  - TDD: `apps/client/src/domains/keyword/utils/__tests__/keywordSelection.test.ts`
    - 2개 미만 선택 시 "추천 받기" 비활성
    - 4개 초과 선택 시 가장 먼저 선택한 것 해제 (FIFO)
    - 동일 카테고리 중복 선택 허용
  - TDD: `apps/client/src/domains/keyword/utils/__tests__/bubblePhysics.test.ts`
    - 버블 초기 위치 생성 (겹침 없이)
    - 경계 충돌 감지
    - 선택된 버블 확대 계산
  - `apps/client/src/domains/keyword/utils/keywordSelection.ts` — 선택 상태머신 (순수 함수)
  - `apps/client/src/domains/keyword/utils/bubblePhysics.ts` — matter.js 설정 유틸 (순수 함수)
  - `apps/client/src/domains/keyword/hooks/useKeywordSelection.ts` — 선택 상태 관리 훅
  - `apps/client/src/domains/keyword/types/entity.ts` — 프론트엔드 전용 타입 (BubbleState 등)

  **Must NOT do**:
  - React 컴포넌트 작성 (이 태스크는 로직만)
  - matter.js Engine을 React state에 저장
  - barrel file (index.ts) 생성

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16, 17, 18)
  - **Blocks**: Task 13
  - **Blocked By**: Tasks 1, 5

  **References**:
  - `apps/client/src/domains/keyword/constants/keywords.ts` — 키워드 목록 (Task 5에서 생성)
  - `packages/shared-types/src/keyword.ts` — EmotionKeyword, KeywordCategory 타입
  - `apps/client/src/test-utils.ts` — 테스트 유틸 (Task 1에서 생성)
  - `docs/PRD.md:49-55` — US-01 수락 기준 (2~4개 제한, FIFO 해제)
  - Metis 분석: matter.js는 useRef 패턴, 3계층 분리 (상태머신/물리유틸/React래퍼)

  **Acceptance Criteria**:
  - [ ] `keywordSelection.test.ts` 테스트 3개 이상 PASS
  - [ ] `bubblePhysics.test.ts` 테스트 3개 이상 PASS
  - [ ] `npm run test:client` → ALL PASS
  - [ ] 선택 로직이 순수 함수로 구현됨 (React 의존성 없음)
  - [ ] useKeywordSelection 훅이 선택/해제/리셋 기능 제공

  **QA Scenarios**:

  ```
  Scenario: 키워드 선택 로직 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/keyword/utils/__tests__/keywordSelection.test.ts --reporter=verbose
    Expected Result: 3개 이상 테스트 PASS, 0 failures
    Evidence: .sisyphus/evidence/task-12-keyword-selection-tests.txt

  Scenario: 4개 초과 선택 시 FIFO 해제 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run --testNamePattern="FIFO" --reporter=verbose
    Expected Result: FIFO 해제 테스트 PASS
    Evidence: .sisyphus/evidence/task-12-fifo-test.txt

  Scenario: 물리 유틸 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/keyword/utils/__tests__/bubblePhysics.test.ts --reporter=verbose
    Expected Result: 3개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-12-physics-tests.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(client): 프론트엔드 도메인 구현 (keyword, player, history)`
  - Files: `apps/client/src/domains/keyword/utils/*`, `apps/client/src/domains/keyword/hooks/*`, `apps/client/src/domains/keyword/types/*`

- [ ] 13. Keyword domain — FloatingBubble React 컴포넌트

  **What to do**:
  - `apps/client/src/domains/keyword/components/FloatingBubble.tsx` — matter.js 캔버스 래퍼
    - useRef로 Engine 관리 (state 금지)
    - useEffect로 Runner 시작/정리
    - 키워드 버블 렌더링 (각 버블 = matter.js Body)
    - 선택된 버블 시각적 구분 (확대 + 색상 변경)
    - 터치/클릭 이벤트 → useKeywordSelection 훅 연동
  - `apps/client/src/domains/keyword/components/KeywordChip.tsx` — 선택된 키워드 표시 칩
  - `apps/client/src/domains/keyword/components/SelectionGuide.tsx` — "1개 더 골라주세요" 안내
  - 통합 테스트: `apps/client/src/domains/keyword/components/__tests__/FloatingBubble.test.tsx`
    - 버블 렌더링 확인
    - 클릭 시 선택 상태 변경
    - 4개 선택 후 추가 클릭 시 FIFO 동작

  **Must NOT do**:
  - matter.js Engine을 useState에 저장
  - 비즈니스 로직을 컴포넌트 내부에 작성 (hook 위임)
  - 인라인 style 외 동적 값 처리 방법 사용 (물리 좌표는 style 허용)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Task 12 완료 후)
  - **Parallel Group**: Wave 3 (with Tasks 14, 15, 16, 17, 18)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 6, 12

  **References**:
  - `apps/client/src/domains/keyword/utils/bubblePhysics.ts` — 물리 유틸 (Task 12에서 생성)
  - `apps/client/src/domains/keyword/hooks/useKeywordSelection.ts` — 선택 훅 (Task 12에서 생성)
  - `apps/client/src/shared/components/ui/badge.tsx` — shadcn Badge (Task 6에서 설치)
  - `apps/client/tailwind.config.ts` — 커스텀 색상 토큰
  - Metis 분석: useRef 패턴, requestAnimationFrame mock 필요

  **Acceptance Criteria**:
  - [ ] FloatingBubble 컴포넌트가 matter.js Engine을 useRef로 관리
  - [ ] 통합 테스트 PASS (렌더링 + 클릭 + FIFO)
  - [ ] 선택된 버블이 시각적으로 구분됨 (확대 + 색상)
  - [ ] "1개 더 골라주세요" 안내가 1개 선택 시 표시
  - [ ] `npm run test:client` → ALL PASS

  **QA Scenarios**:

  ```
  Scenario: FloatingBubble 컴포넌트 렌더링 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/keyword/components/__tests__/FloatingBubble.test.tsx --reporter=verbose
    Expected Result: 통합 테스트 PASS
    Evidence: .sisyphus/evidence/task-13-bubble-tests.txt

  Scenario: 브라우저에서 버블 UI 동작 확인
    Tool: Playwright
    Preconditions: npm run dev:client 실행 중
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for canvas or bubble elements to render (timeout: 5s)
      3. Click on first visible bubble element
      4. Assert: selected state class or style change visible
    Expected Result: 버블 클릭 시 시각적 변화 (확대/색상)
    Evidence: .sisyphus/evidence/task-13-bubble-ui.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/keyword/components/*`

- [ ] 14. Player domain — API client + hooks

  **What to do**:
  - TDD: `apps/client/src/domains/player/hooks/__tests__/usePlaylistSearch.test.tsx`
    - 키워드 확장 → YouTube 검색 → 플레이리스트 반환 flow
    - 로딩 상태 관리
    - 에러 상태 관리
    - 캐시 히트 시 재요청 없음
  - `apps/client/src/domains/player/apis/playerApi.ts` — 서버 API 호출 함수
    - expandKeywords(keywords) → POST /api/keywords/expand
    - searchYoutube(query) → GET /api/youtube/search
  - `apps/client/src/domains/player/hooks/usePlaylistSearch.ts` — TanStack Query 기반 훅
    - useMutation for keyword expansion
    - useQuery for YouTube search (enabled: false, manual trigger)
  - `apps/client/src/domains/player/constants/queryKeys.ts` — Query key 팩토리
  - `apps/client/src/domains/player/types/entity.ts` — 프론트엔드 전용 타입

  **Must NOT do**:
  - UI 컴포넌트 작성 (이 태스크는 데이터 레이어만)
  - 컴포넌트에서 API 직접 호출 (hook 통해서만)
  - barrel file 생성

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 15, 16, 17, 18)
  - **Blocks**: Tasks 15, 19
  - **Blocked By**: Tasks 1, 4, 9

  **References**:
  - `apps/client/src/test-utils.ts` — createWrapper (QueryClient 래퍼, Task 1에서 생성)
  - `packages/shared-types/src/keyword.ts` — ExpandKeywordsRequest/Response
  - `packages/shared-types/src/player.ts` — YoutubeVideo, Playlist
  - `apps/client/vite.config.mts` — proxy 설정 (/api → localhost:3000)
  - AGENTS.md TanStack Query 섹션 — queryKeys 팩토리 패턴, staleTime 전략

  **Acceptance Criteria**:
  - [ ] `usePlaylistSearch.test.tsx` 테스트 3개 이상 PASS
  - [ ] TanStack Query 사용 (useQuery/useMutation)
  - [ ] queryKeys 팩토리 패턴 적용
  - [ ] API 함수가 apis/ 폴더에 분리됨
  - [ ] `npm run test:client` → ALL PASS

  **QA Scenarios**:

  ```
  Scenario: usePlaylistSearch 훅 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/player/hooks/__tests__/usePlaylistSearch.test.tsx --reporter=verbose
    Expected Result: 3개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-14-playlist-hook-tests.txt

  Scenario: API 함수 import 가능 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx tsx -e "import { expandKeywords, searchYoutube } from './src/domains/player/apis/playerApi'; console.log(typeof expandKeywords, typeof searchYoutube)"
    Expected Result: "function function" 출력
    Evidence: .sisyphus/evidence/task-14-api-import.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/player/apis/*`, `apps/client/src/domains/player/hooks/*`, `apps/client/src/domains/player/constants/*`, `apps/client/src/domains/player/types/*`

- [ ] 15. Player domain — YouTube iframe 플레이어 UI

  **What to do**:
  - `apps/client/src/domains/player/components/YouTubePlayer.tsx` — iframe 플레이어
    - YouTube IFrame API 로드 및 초기화
    - 재생/일시정지/다음곡/이전곡 컨트롤
    - 현재 곡 제목/아티스트 표시
    - 광고 재생 시 자동 일시정지 이벤트 리스너
  - `apps/client/src/domains/player/components/PlaylistView.tsx` — 곡 목록 UI
    - 현재 재생 중인 곡 하이라이트
    - 곡 탭 시 해당 곡으로 이동
  - `apps/client/src/domains/player/components/NowPlaying.tsx` — 현재 재생 정보 바
  - `apps/client/src/domains/player/hooks/useYouTubePlayer.ts` — iframe API 제어 훅
  - 통합 테스트: 플레이리스트 렌더링 + 곡 선택 동작

  **Must NOT do**:
  - YouTube iframe 외 다른 iframe 사용 (앱인토스 정책)
  - 백그라운드 재생 구현 (YouTube 정책 위반)
  - 비즈니스 로직을 컴포넌트에 직접 작성

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Task 14 완료 후)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 20
  - **Blocked By**: Tasks 6, 14

  **References**:
  - `apps/client/src/domains/player/hooks/usePlaylistSearch.ts` — 데이터 훅 (Task 14에서 생성)
  - `apps/client/src/shared/components/ui/card.tsx` — shadcn Card (Task 6에서 설치)
  - `apps/client/src/shared/components/ui/skeleton.tsx` — 로딩 상태 (Task 6에서 설치)
  - `packages/shared-types/src/player.ts` — YoutubeVideo 타입
  - `docs/PRD.md:74-78` — US-03 수락 기준

  **Acceptance Criteria**:
  - [ ] YouTubePlayer 컴포넌트가 iframe 렌더링
  - [ ] 재생/일시정지/다음/이전 컨트롤 동작
  - [ ] PlaylistView에서 곡 목록 표시 + 현재 곡 하이라이트
  - [ ] `npm run test:client` → ALL PASS
  - [ ] `npm run typecheck:client` → 0 errors

  **QA Scenarios**:

  ```
  Scenario: 플레이어 컴포넌트 렌더링 테스트
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/player/components/__tests__/ --reporter=verbose
    Expected Result: 통합 테스트 PASS
    Evidence: .sisyphus/evidence/task-15-player-tests.txt

  Scenario: 플레이어 UI 브라우저 확인
    Tool: Playwright
    Preconditions: npm run dev 실행 중, 키워드 선택 후 플레이어 페이지 이동
    Steps:
      1. Navigate to http://localhost:5173/player
      2. Assert: iframe[src*="youtube.com"] 존재
      3. Assert: 재생 컨트롤 버튼 존재 (play, next, prev)
    Expected Result: YouTube iframe + 컨트롤 UI 렌더링
    Evidence: .sisyphus/evidence/task-15-player-ui.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/player/components/*`, `apps/client/src/domains/player/hooks/useYouTubePlayer.ts`

- [ ] 16. History domain — hooks + API client

  **What to do**:
  - TDD: `apps/client/src/domains/history/hooks/__tests__/useHistory.test.tsx`
    - 히스토리 목록 조회
    - 히스토리 저장
    - 과거 조합 재추천 트리거
  - `apps/client/src/domains/history/apis/historyApi.ts` — 서버 API 호출
    - getHistory() → GET /api/history
    - saveHistory(entry) → POST /api/history
  - `apps/client/src/domains/history/hooks/useHistory.ts` — TanStack Query 훅
  - `apps/client/src/domains/history/constants/queryKeys.ts` — Query key 팩토리
  - `apps/client/src/domains/history/types/entity.ts` — 프론트엔드 전용 타입

  **Must NOT do**:
  - UI 컴포넌트 작성
  - 캘린더 뷰 관련 로직 (v2)
  - barrel file 생성

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 1, 4, 10

  **References**:
  - `apps/client/src/test-utils.ts` — createWrapper (Task 1)
  - `packages/shared-types/src/history.ts` — HistoryEntry 타입
  - `apps/client/src/domains/player/apis/playerApi.ts` — API 호출 패턴 참조 (Task 14)
  - `docs/PRD.md:84-88` — US-04 수락 기준

  **Acceptance Criteria**:
  - [ ] `useHistory.test.tsx` 테스트 3개 이상 PASS
  - [ ] TanStack Query 사용
  - [ ] queryKeys 팩토리 패턴 적용
  - [ ] `npm run test:client` → ALL PASS

  **QA Scenarios**:

  ```
  Scenario: useHistory 훅 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/history/hooks/__tests__/useHistory.test.tsx --reporter=verbose
    Expected Result: 3개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-16-history-hook-tests.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/history/apis/*`, `apps/client/src/domains/history/hooks/*`, `apps/client/src/domains/history/constants/*`, `apps/client/src/domains/history/types/*`

- [ ] 17. History domain — 히스토리 목록 UI

  **What to do**:
  - `apps/client/src/domains/history/components/HistoryList.tsx` — 히스토리 목록
    - 날짜별 그룹핑
    - 각 항목: 키워드 조합 + 날짜 + 곡 수
    - 탭 시 재추천 트리거
  - `apps/client/src/domains/history/components/HistoryCard.tsx` — 개별 히스토리 카드
    - 키워드 칩 표시
    - 날짜 포맷팅
    - "다시 듣기" 버튼
  - 통합 테스트: 목록 렌더링 + 카드 탭 동작

  **Must NOT do**:
  - 캘린더 뷰 구현 (v2)
  - 무한 스크롤 (최근 20개만)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Task 16 완료 후)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 21
  - **Blocked By**: Tasks 6, 16

  **References**:
  - `apps/client/src/domains/history/hooks/useHistory.ts` — 데이터 훅 (Task 16)
  - `apps/client/src/shared/components/ui/card.tsx` — shadcn Card (Task 6)
  - `apps/client/src/shared/components/ui/badge.tsx` — 키워드 칩 표시용 (Task 6)
  - `docs/PRD.md:84-88` — US-04 수락 기준

  **Acceptance Criteria**:
  - [ ] HistoryList 컴포넌트가 날짜별 그룹핑된 목록 렌더링
  - [ ] HistoryCard에 키워드 칩 + 날짜 + "다시 듣기" 버튼
  - [ ] 통합 테스트 PASS
  - [ ] `npm run typecheck:client` → 0 errors

  **QA Scenarios**:

  ```
  Scenario: 히스토리 목록 렌더링 테스트
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/history/components/__tests__/ --reporter=verbose
    Expected Result: 통합 테스트 PASS
    Evidence: .sisyphus/evidence/task-17-history-ui-tests.txt

  Scenario: 히스토리 페이지 브라우저 확인
    Tool: Playwright
    Preconditions: npm run dev 실행 중, 히스토리 데이터 존재
    Steps:
      1. Navigate to http://localhost:5173/history
      2. Assert: 히스토리 카드 1개 이상 렌더링
      3. Assert: 각 카드에 키워드 배지 표시
    Expected Result: 히스토리 목록 정상 렌더링
    Evidence: .sisyphus/evidence/task-17-history-ui.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/history/components/*`

- [ ] 18. Feedback — 미니 리액션 UI

  **What to do**:
  - TDD: `apps/client/src/domains/player/components/__tests__/FeedbackReaction.test.tsx`
    - 3개 리액션 버튼 렌더링 (😐/🙂/😍)
    - 클릭 시 즉시 저장 (별도 제출 버튼 없음)
    - 저장 후 "감사합니다" 피드백
  - `apps/client/src/domains/player/components/FeedbackReaction.tsx` — 리액션 UI
  - `apps/client/src/domains/player/hooks/useFeedback.ts` — 피드백 저장 mutation 훅
  - `apps/client/src/domains/player/apis/feedbackApi.ts` — POST /api/feedback 호출

  **Must NOT do**:
  - 복잡한 피드백 폼 (3단계 리액션만)
  - 피드백 히스토리 조회 UI

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 20
  - **Blocked By**: Tasks 6, 11

  **References**:
  - `packages/shared-types/src/feedback.ts` — FeedbackReaction enum (Task 4)
  - `apps/client/src/shared/components/ui/button.tsx` — shadcn Button (Task 6)
  - `docs/PRD.md:95-97` — US-05 수락 기준

  **Acceptance Criteria**:
  - [ ] FeedbackReaction 테스트 PASS
  - [ ] 3개 리액션 버튼 렌더링 (😐/🙂/😍)
  - [ ] 클릭 즉시 API 호출 (별도 제출 버튼 없음)
  - [ ] `npm run test:client` → ALL PASS

  **QA Scenarios**:

  ```
  Scenario: 리액션 UI 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/domains/player/components/__tests__/FeedbackReaction.test.tsx --reporter=verbose
    Expected Result: 테스트 PASS
    Evidence: .sisyphus/evidence/task-18-feedback-tests.txt

  Scenario: 리액션 클릭 시 API 호출 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run --testNamePattern="즉시 저장" --reporter=verbose
    Expected Result: mutation 호출 확인 테스트 PASS
    Evidence: .sisyphus/evidence/task-18-feedback-mutation.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `apps/client/src/domains/player/components/FeedbackReaction.tsx`, `apps/client/src/domains/player/hooks/useFeedback.ts`, `apps/client/src/domains/player/apis/feedbackApi.ts`

### Wave 4: Pages + Monetization + Policy

- [ ] 19. HomePage — 키워드 선택 + 추천 받기

  **What to do**:
  - `apps/client/src/pages/HomePage.tsx` 구현
    - FloatingBubble 컴포넌트 배치 (전체 화면)
    - 선택된 키워드 칩 하단 표시
    - "추천 받기" 버튼 (2개 이상 선택 시 활성화)
    - 버튼 탭 → usePlaylistSearch 트리거 → PlayerPage로 이동
    - 로딩 상태: Skeleton UI
    - 일 5회 제한 도달 시 "광고 보고 추천 받기" 버튼으로 전환
  - `apps/client/src/pages/Routes.tsx` 업데이트 — HomePage 연결
  - 통합 테스트: 키워드 선택 → 추천 버튼 → 페이지 이동 flow

  **Must NOT do**:
  - 비즈니스 로직을 컴포넌트에 직접 작성 (hook 위임)
  - 키워드 선택 중간에 광고 노출 (정책 위반)
  - 5개 이상 키워드 선택 허용

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 23, 24, 25)
  - **Blocks**: Task 23
  - **Blocked By**: Tasks 13, 14

  **References**:
  - `apps/client/src/domains/keyword/components/FloatingBubble.tsx` — 버블 UI (Task 13)
  - `apps/client/src/domains/player/hooks/usePlaylistSearch.ts` — 추천 훅 (Task 14)
  - `apps/client/src/domains/keyword/hooks/useKeywordSelection.ts` — 선택 훅 (Task 12)
  - `apps/client/src/pages/Routes.tsx` — 라우트 정의 (기존 placeholder)
  - `docs/PRD.md:44-55` — US-01 수락 기준

  **Acceptance Criteria**:
  - [ ] HomePage에서 FloatingBubble 렌더링
  - [ ] 2개 이상 선택 시 "추천 받기" 버튼 활성화
  - [ ] 1개 선택 시 "1개 더 골라주세요" 안내 표시
  - [ ] 버튼 탭 → /player 페이지로 이동
  - [ ] `npm run test:client` → ALL PASS
  - [ ] 앱 진입 후 3초 이내 키워드 선택 가능 상태

  **QA Scenarios**:

  ```
  Scenario: 홈페이지 키워드 선택 → 추천 flow
    Tool: Playwright
    Preconditions: npm run dev 실행 중
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for bubble elements (timeout: 3s)
      3. Click 2 bubble elements
      4. Assert: "추천 받기" 버튼 enabled
      5. Click "추천 받기" 버튼
      6. Assert: URL changed to /player
    Expected Result: 키워드 2개 선택 후 플레이어 페이지로 이동
    Evidence: .sisyphus/evidence/task-19-homepage-flow.png

  Scenario: 1개만 선택 시 안내 메시지
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:5173
      2. Click 1 bubble element
      3. Assert: text "1개 더 골라주세요" visible
      4. Assert: "추천 받기" 버튼 disabled
    Expected Result: 안내 메시지 표시 + 버튼 비활성
    Evidence: .sisyphus/evidence/task-19-homepage-guide.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `feat: 페이지 조합 + 수익화 + AI 고지`
  - Files: `apps/client/src/pages/HomePage.tsx`, `apps/client/src/pages/Routes.tsx`

- [ ] 20. PlayerPage — 플레이리스트 재생

  **What to do**:
  - `apps/client/src/pages/PlayerPage.tsx` 구현
    - YouTubePlayer 컴포넌트 배치
    - PlaylistView 곡 목록
    - NowPlaying 현재 재생 정보
    - FeedbackReaction (플레이리스트 끝난 후 표시)
    - `🤖 AI 추천` 배지 상단 표시
    - 하단 배너 광고 영역 (placeholder)
  - `apps/client/src/pages/Routes.tsx` 업데이트 — PlayerPage 연결
  - 히스토리 자동 저장: 플레이리스트 생성 시 useHistory.save() 호출

  **Must NOT do**:
  - 곡 재생 중 전면 광고 (정책 위반)
  - 백그라운드 재생 (YouTube 정책)
  - AI 추천 배지 누락 (과태료 리스크)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 15, 18

  **References**:
  - `apps/client/src/domains/player/components/YouTubePlayer.tsx` — 플레이어 (Task 15)
  - `apps/client/src/domains/player/components/PlaylistView.tsx` — 곡 목록 (Task 15)
  - `apps/client/src/domains/player/components/FeedbackReaction.tsx` — 리액션 (Task 18)
  - `apps/client/src/shared/components/ui/badge.tsx` — AI 추천 배지 (Task 6)
  - `docs/PRD.md:69-78` — US-03 수락 기준
  - `docs/PRD.md:65` — `🤖 AI 추천` 배지 필수

  **Acceptance Criteria**:
  - [ ] PlayerPage에서 YouTube iframe 재생
  - [ ] 플레이리스트 곡 목록 표시 (5~10곡)
  - [ ] `🤖 AI 추천` 배지 상단 표시
  - [ ] 플레이리스트 끝 → FeedbackReaction 표시
  - [ ] 히스토리 자동 저장
  - [ ] `npm run typecheck:client` → 0 errors

  **QA Scenarios**:

  ```
  Scenario: 플레이어 페이지 전체 flow
    Tool: Playwright
    Preconditions: npm run dev 실행 중
    Steps:
      1. Navigate to http://localhost:5173
      2. Select 2 keywords → Click "추천 받기"
      3. Wait for /player page load
      4. Assert: YouTube iframe visible
      5. Assert: text "AI 추천" visible (배지)
      6. Assert: playlist items >= 1
    Expected Result: 플레이어 페이지 정상 렌더링 + AI 배지
    Evidence: .sisyphus/evidence/task-20-player-page.png

  Scenario: AI 추천 배지 존재 확인
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:5173/player (with mock data)
      2. Assert: element containing "AI 추천" text exists
    Expected Result: 배지 렌더링 확인
    Evidence: .sisyphus/evidence/task-20-ai-badge.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/pages/PlayerPage.tsx`

- [ ] 21. HistoryPage — 히스토리 목록

  **What to do**:
  - `apps/client/src/pages/HistoryPage.tsx` 구현
    - HistoryList 컴포넌트 배치
    - 빈 상태 UI ("아직 추천 기록이 없어요")
    - 히스토리 카드 탭 → 동일 조합으로 재추천 → PlayerPage 이동
  - `apps/client/src/pages/Routes.tsx` 업데이트 — HistoryPage 연결
  - 네비게이션: 하단 탭 또는 헤더에서 접근

  **Must NOT do**:
  - 캘린더 뷰 (v2)
  - 무한 스크롤 (최근 20개만)
  - 히스토리 삭제 기능 (MVP 제외)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 17

  **References**:
  - `apps/client/src/domains/history/components/HistoryList.tsx` — 목록 UI (Task 17)
  - `apps/client/src/domains/history/hooks/useHistory.ts` — 데이터 훅 (Task 16)
  - `docs/PRD.md:84-88` — US-04 수락 기준

  **Acceptance Criteria**:
  - [ ] HistoryPage에서 히스토리 목록 렌더링
  - [ ] 빈 상태 시 안내 메시지 표시
  - [ ] 카드 탭 → /player 이동 (재추천)
  - [ ] `npm run typecheck:client` → 0 errors

  **QA Scenarios**:

  ```
  Scenario: 히스토리 페이지 렌더링
    Tool: Playwright
    Preconditions: npm run dev 실행 중
    Steps:
      1. Navigate to http://localhost:5173/history
      2. Assert: page renders without error
      3. If empty: Assert text "아직 추천 기록이 없어요" visible
    Expected Result: 페이지 정상 렌더링
    Evidence: .sisyphus/evidence/task-21-history-page.png

  Scenario: 히스토리 카드 탭 → 재추천
    Tool: Playwright
    Preconditions: 히스토리 데이터 1개 이상 존재
    Steps:
      1. Navigate to http://localhost:5173/history
      2. Click first history card "다시 듣기" button
      3. Assert: URL changed to /player
    Expected Result: 재추천 flow 동작
    Evidence: .sisyphus/evidence/task-21-history-replay.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/pages/HistoryPage.tsx`

- [ ] 22. AI 고지 바텀시트 + 배지

  **What to do**:
  - TDD: `apps/client/src/shared/components/__tests__/AiDisclosure.test.tsx`
    - 최초 방문 시 바텀시트 표시
    - "확인" 버튼 클릭 전 서비스 이용 불가
    - 확인 후 localStorage에 저장 → 재방문 시 미노출
  - `apps/client/src/shared/components/AiDisclosureSheet.tsx` — 바텀시트 컴포넌트
    - shadcn Sheet 사용
    - "AI를 활용하여 키워드를 분석하고 음악을 추천합니다" 문구
    - "확인" 버튼
  - `apps/client/src/shared/components/AiBadge.tsx` — `🤖 AI 추천` 배지 컴포넌트
  - `apps/client/src/shared/hooks/useAiDisclosure.ts` — 고지 확인 상태 관리 훅
  - App.tsx에서 AiDisclosureSheet 조건부 렌더링

  **Must NOT do**:
  - 고지 없이 서비스 이용 허용 (정책 위반 → 3,000만원 과태료)
  - 고지 문구 임의 변경
  - 바텀시트 자동 닫힘 (사용자 확인 필수)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 6

  **References**:
  - `apps/client/src/shared/components/ui/sheet.tsx` — shadcn Sheet (Task 6)
  - `apps/client/src/shared/components/ui/badge.tsx` — shadcn Badge (Task 6)
  - `docs/PRD.md:120-127` — US-08 수락 기준
  - `docs/PRD.md:169-174` — 생성형 AI 정책 준수 (과태료 3,000만원)

  **Acceptance Criteria**:
  - [ ] 최초 방문 시 바텀시트 표시
  - [ ] "확인" 클릭 전 서비스 이용 불가 (오버레이 차단)
  - [ ] 확인 후 재방문 시 미노출
  - [ ] AiBadge 컴포넌트 `🤖 AI 추천` 텍스트 렌더링
  - [ ] 테스트 PASS

  **QA Scenarios**:

  ```
  Scenario: AI 고지 바텀시트 최초 표시
    Tool: Playwright
    Preconditions: localStorage 비어있음 (시크릿 모드)
    Steps:
      1. Navigate to http://localhost:5173
      2. Assert: Sheet/overlay visible
      3. Assert: text "AI를 활용하여" visible
      4. Assert: "확인" button visible
      5. Click "확인"
      6. Assert: Sheet closed
      7. Reload page
      8. Assert: Sheet NOT visible (재방문 미노출)
    Expected Result: 최초 고지 → 확인 → 재방문 미노출
    Evidence: .sisyphus/evidence/task-22-ai-disclosure.png

  Scenario: 확인 전 서비스 이용 차단
    Tool: Playwright
    Preconditions: localStorage 비어있음
    Steps:
      1. Navigate to http://localhost:5173
      2. Try to click bubble elements behind overlay
      3. Assert: bubbles NOT clickable (overlay blocks interaction)
    Expected Result: 고지 확인 전 인터랙션 차단
    Evidence: .sisyphus/evidence/task-22-ai-disclosure-block.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/shared/components/AiDisclosureSheet.tsx`, `apps/client/src/shared/components/AiBadge.tsx`, `apps/client/src/shared/hooks/useAiDisclosure.ts`

- [ ] 23. 광고 모듈 — 보상형/전면/배너

  **What to do**:
  - `apps/client/src/shared/hooks/useAd.ts` — 광고 관리 훅
    - 앱인토스 SDK 광고 API 추상화 (인터페이스)
    - 보상형 광고 로드/표시/완료 콜백
    - 전면 광고 로드/표시 (키워드 선택 완료 → 추천 대기 중)
    - 배너 광고 표시 (플레이어 하단)
    - 광고 재생 시 음악 일시정지 이벤트
  - `apps/client/src/shared/components/BannerAd.tsx` — 하단 배너 광고 컴포넌트
  - `apps/client/src/shared/components/AdPlaceholder.tsx` — 광고 로딩 전 placeholder
  - 앱인토스 SDK Mock: `apps/client/src/shared/utils/adSdkMock.ts`
    - 실제 SDK 없이 개발 가능하도록 Mock 구현
    - 환경변수로 Mock/Real 전환

  **Must NOT do**:
  - 인트로/로딩/팝업 모달에 광고 노출 (정책 위반)
  - 키워드 선택 중간에 광고 (정책 위반)
  - 곡 재생 중 전면 광고 (정책 위반)
  - 실시간 광고 로딩 (사전 로딩 필수)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 25
  - **Blocked By**: Task 19

  **References**:
  - `docs/PRD.md:225-232` — 앱인토스 SDK 광고 API
  - `docs/PRD.md:293-304` — 광고 정책 준수 체크리스트 7개 항목
  - `packages/shared-types/src/ad.ts` — AdType, AdRewardResult 타입 (Task 4)
  - AGENTS.md 광고 노출 허용/금지 타이밍 참조

  **Acceptance Criteria**:
  - [ ] useAd 훅이 보상형/전면/배너 3종 지원
  - [ ] 광고 사전 로딩 패턴 구현
  - [ ] 광고 재생 시 음악 일시정지 이벤트 발행
  - [ ] Mock SDK로 개발 환경에서 동작 확인
  - [ ] 광고 정책 7개 항목 위반 없음

  **QA Scenarios**:

  ```
  Scenario: 광고 Mock SDK 동작 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx tsx -e "import { AdSdkMock } from './src/shared/utils/adSdkMock'; const sdk = new AdSdkMock(); sdk.loadRewardedAd().then(r => console.log('loaded:', r))"
    Expected Result: "loaded: true" 출력
    Evidence: .sisyphus/evidence/task-23-ad-mock.txt

  Scenario: 배너 광고 컴포넌트 렌더링
    Tool: Playwright
    Preconditions: npm run dev 실행 중, /player 페이지
    Steps:
      1. Navigate to http://localhost:5173/player
      2. Assert: banner ad placeholder at bottom of page
    Expected Result: 하단 배너 영역 렌더링
    Evidence: .sisyphus/evidence/task-23-banner-ad.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/shared/hooks/useAd.ts`, `apps/client/src/shared/components/BannerAd.tsx`, `apps/client/src/shared/components/AdPlaceholder.tsx`, `apps/client/src/shared/utils/adSdkMock.ts`

- [ ] 24. 프리미엄 구독 — 인앱결제

  **What to do**:
  - `apps/client/src/shared/hooks/useSubscription.ts` — 구독 상태 관리 훅
    - 현재 구독 상태 조회 (FREE/PREMIUM)
    - 인앱결제 SDK 호출 추상화
    - 구독 상태에 따른 기능 분기 (광고 제거, 무제한 조합, 풀 히스토리)
  - `apps/client/src/shared/components/PremiumUpgradeSheet.tsx` — 구독 유도 바텀시트
    - 프리미엄 혜택 목록
    - 가격 표시 (월 1,900~2,900원)
    - "구독하기" 버튼 → 인앱결제 트리거
  - `apps/client/src/shared/utils/paymentSdkMock.ts` — 결제 SDK Mock
  - `apps/server/src/modules/subscription/` — 구독 상태 관리 (선택: 서버 검증)

  **Must NOT do**:
  - 실제 결제 처리 (Mock으로 flow만 구현)
  - 프리미엄 키워드 팩 구현 (MVP 후순위)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 25
  - **Blocked By**: Task 7

  **References**:
  - `packages/shared-types/src/subscription.ts` — SubscriptionTier, SubscriptionStatus (Task 4)
  - `docs/PRD.md:109-118` — US-07 수락 기준
  - `docs/PRD.md:209` — 앱인토스 인앱결제 SDK

  **Acceptance Criteria**:
  - [ ] useSubscription 훅이 FREE/PREMIUM 상태 반환
  - [ ] PremiumUpgradeSheet에 혜택 목록 + 가격 표시
  - [ ] "구독하기" 버튼 클릭 시 결제 flow 트리거 (Mock)
  - [ ] PREMIUM 상태에서 광고 미노출 확인

  **QA Scenarios**:

  ```
  Scenario: 구독 상태에 따른 분기 확인
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run --testNamePattern="subscription" --reporter=verbose
    Expected Result: 구독 관련 테스트 PASS
    Evidence: .sisyphus/evidence/task-24-subscription-tests.txt

  Scenario: 프리미엄 업그레이드 시트 렌더링
    Tool: Playwright
    Preconditions: npm run dev 실행 중, FREE 유저 상태
    Steps:
      1. Navigate to http://localhost:5173
      2. Trigger premium upgrade (일 5회 제한 도달 또는 직접 트리거)
      3. Assert: Sheet visible with "구독하기" button
      4. Assert: price text visible (1,900 or 2,900)
    Expected Result: 구독 유도 시트 정상 렌더링
    Evidence: .sisyphus/evidence/task-24-premium-sheet.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/shared/hooks/useSubscription.ts`, `apps/client/src/shared/components/PremiumUpgradeSheet.tsx`, `apps/client/src/shared/utils/paymentSdkMock.ts`

- [ ] 25. 일 5회 제한 + 보상형 광고 연동

  **What to do**:
  - TDD: `apps/client/src/shared/hooks/__tests__/useDailyLimit.test.tsx`
    - FREE 유저 일 5회 제한 카운트
    - 제한 도달 시 "광고 보고 추천 받기" 표시
    - 보상형 광고 완료 → 1회 추가
    - PREMIUM 유저 제한 없음
    - 자정 리셋
  - `apps/client/src/shared/hooks/useDailyLimit.ts` — 일일 제한 관리 훅
    - localStorage 기반 카운트 (날짜 키)
    - useSubscription과 연동 (PREMIUM이면 무제한)
    - useAd와 연동 (보상형 광고 완료 콜백)
  - HomePage에 제한 UI 통합
    - 남은 횟수 표시
    - 제한 도달 시 버튼 텍스트 변경

  **Must NOT do**:
  - 서버사이드 제한 (MVP는 클라이언트 localStorage)
  - 보상형 광고 시청 중 보상 미지급 (즉시 지급 필수)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (Tasks 23, 24 완료 후)
  - **Parallel Group**: Wave 4 (sequential within wave)
  - **Blocks**: None
  - **Blocked By**: Tasks 23, 24

  **References**:
  - `apps/client/src/shared/hooks/useAd.ts` — 광고 훅 (Task 23)
  - `apps/client/src/shared/hooks/useSubscription.ts` — 구독 훅 (Task 24)
  - `docs/PRD.md:99-107` — US-06 수락 기준
  - `docs/PRD.md:116` — 프리미엄 무제한

  **Acceptance Criteria**:
  - [ ] `useDailyLimit.test.tsx` 테스트 4개 이상 PASS
  - [ ] FREE 유저 일 5회 제한 동작
  - [ ] 제한 도달 시 "광고 보고 추천 받기" 버튼 표시
  - [ ] 보상형 광고 완료 → 즉시 1회 추가
  - [ ] PREMIUM 유저 제한 없음
  - [ ] `npm run test:client` → ALL PASS

  **QA Scenarios**:

  ```
  Scenario: 일일 제한 테스트 통과
    Tool: Bash
    Steps:
      1. cd apps/client && npx vitest run src/shared/hooks/__tests__/useDailyLimit.test.tsx --reporter=verbose
    Expected Result: 4개 이상 테스트 PASS
    Evidence: .sisyphus/evidence/task-25-daily-limit-tests.txt

  Scenario: 5회 제한 도달 후 광고 버튼 표시
    Tool: Playwright
    Preconditions: npm run dev 실행 중, localStorage에 오늘 5회 사용 기록
    Steps:
      1. Navigate to http://localhost:5173
      2. Select 2 keywords
      3. Assert: button text contains "광고 보고 추천 받기" (not "추천 받기")
    Expected Result: 제한 도달 시 버튼 텍스트 변경
    Evidence: .sisyphus/evidence/task-25-limit-reached.png

  Scenario: PREMIUM 유저 제한 없음 확인
    Tool: Playwright
    Preconditions: localStorage에 premium subscription 설정
    Steps:
      1. Navigate to http://localhost:5173
      2. Assert: "추천 받기" 버튼 (광고 버튼 아님) 표시
      3. Assert: 남은 횟수 표시 없음
    Expected Result: PREMIUM 유저는 제한 UI 미노출
    Evidence: .sisyphus/evidence/task-25-premium-unlimited.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Files: `apps/client/src/shared/hooks/useDailyLimit.ts`, `apps/client/src/shared/hooks/__tests__/useDailyLimit.test.tsx`

---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `npx tsc --noEmit` in both apps + linter + tests. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` + `webapp-testing` skill
      Start dev server (`npm run dev`). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration. Test edge cases: empty state, 5개 초과 선택, 일 5회 제한 도달. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Wave  | Commit Message                                                       | Pre-commit Check                                       |
| ----- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| 1     | `chore: 테스트 인프라 + 공유 상수 설정`                              | `npm run typecheck:client && npm run typecheck:server` |
| 2     | `feat(server): 백엔드 서비스 구현 (keyword, youtube, history, auth)` | `npm run test:server`                                  |
| 3     | `feat(client): 프론트엔드 도메인 구현 (keyword, player, history)`    | `npm run test:client`                                  |
| 4     | `feat: 페이지 조합 + 수익화 + AI 고지`                               | `npm run test:client && npm run lint`                  |
| FINAL | `chore: 최종 검증 완료`                                              | `npm run build:client && npm run build:server`         |

---

## Success Criteria

### Verification Commands

```bash
npm run test:client    # Expected: ALL PASS
npm run test:server    # Expected: ALL PASS
npm run build:client   # Expected: 0 errors
npm run build:server   # Expected: 0 errors
npm run lint           # Expected: 0 errors, 0 warnings
npm run dev            # Expected: client on :5173, server on :3000, proxy working
```

### Final Checklist

- [ ] US-01: 키워드 2~4개 선택 가능, 물리 시뮬레이션 동작
- [ ] US-02: LLM 키워드 확장 → 5~10곡 플레이리스트 생성
- [ ] US-03: YouTube iframe 재생, 컨트롤 동작
- [ ] US-04: 히스토리 저장/조회/재추천
- [ ] US-05: 3단계 리액션 피드백
- [ ] US-06: 보상형 광고 → 추가 1회
- [ ] US-07: 프리미엄 구독 (광고 제거 + 무제한)
- [ ] US-08: AI 고지 바텀시트 + 배지
- [ ] 앱인토스 광고 정책 7개 항목 전수 준수
