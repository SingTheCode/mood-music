# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-12
**Branch:** main

## OVERVIEW

무드뮤직 — 감정 키워드 기반 음악 추천 앱인토스 미니앱. 화면에 떠다니는 감정 키워드 2~4개를 선택하면 AI가 조합을 분석하여 YouTube Music에서 플레이리스트를 생성. 모노레포 구조: 프론트엔드(Vite + React + shadcn/ui + Tailwind CSS) + 백엔드(NestJS).

## STRUCTURE

```
mood-music/
├── apps/
│   ├── client/                    # 프론트엔드 (Vite + React SPA)
│   │   ├── src/
│   │   │   ├── App.tsx            # Root + Provider 조합
│   │   │   ├── main.tsx           # Entry: ReactDOM.createRoot → #root
│   │   │   ├── pages/
│   │   │   │   ├── Routes.tsx     # 라우트 정의
│   │   │   │   ├── HomePage.tsx   # / — 키워드 선택 (플로팅 버블 UI)
│   │   │   │   ├── PlayerPage.tsx # /player — 플레이리스트 재생
│   │   │   │   └── HistoryPage.tsx# /history — 감정 캘린더 히스토리
│   │   │   ├── domains/
│   │   │   │   ├── keyword/       # 감정 키워드 도메인
│   │   │   │   │   ├── apis/      # 서버 API 호출 (fetch/axios)
│   │   │   │   │   ├── components/# 플로팅 버블 UI, 키워드 칩
│   │   │   │   │   ├── constants/ # 키워드 목록, 카테고리
│   │   │   │   │   ├── hooks/     # 키워드 선택/확장 훅
│   │   │   │   │   ├── types/     # 키워드 타입 정의
│   │   │   │   │   └── utils/     # 키워드 조합 로직
│   │   │   │   ├── player/        # 음악 재생 도메인
│   │   │   │   │   ├── apis/      # 서버 API 호출
│   │   │   │   │   ├── components/# YouTube iframe 플레이어, 플레이리스트
│   │   │   │   │   ├── constants/ # queryKeys
│   │   │   │   │   ├── hooks/     # 검색/재생 훅
│   │   │   │   │   ├── types/     # 영상/플레이리스트 타입
│   │   │   │   │   └── utils/     # 필터링, 포맷팅
│   │   │   │   └── history/       # 감정 히스토리 도메인
│   │   │   │       ├── components/# 캘린더, 히스토리 카드
│   │   │   │       ├── hooks/     # Storage API 기반 CRUD
│   │   │   │       ├── types/     # 히스토리 엔티티
│   │   │   │       └── utils/     # 날짜/통계 계산
│   │   │   ├── shared/            # 도메인 횡단 공용 모듈
│   │   │   │   ├── components/    # 공용 컴포넌트 (AI 고지 배지, 로딩 등)
│   │   │   │   │   └── ui/       # shadcn/ui 컴포넌트
│   │   │   │   ├── hooks/         # 공용 훅 (토스 로그인, 광고 등)
│   │   │   │   ├── lib/           # shadcn/ui utils (cn 함수 등)
│   │   │   │   ├── utils/         # 공용 유틸
│   │   │   │   └── constants/     # 공용 상수
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── vite.config.mts
│   │   ├── tailwind.config.ts
│   │   ├── components.json        # shadcn/ui 설정
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── server/                    # 백엔드 (NestJS)
│       ├── src/
│       │   ├── main.ts            # NestJS bootstrap
│       │   ├── app.module.ts      # Root module
│       │   ├── modules/
│       │   │   ├── keyword/       # 키워드 확장 모듈
│       │   │   │   ├── keyword.module.ts
│       │   │   │   ├── keyword.controller.ts
│       │   │   │   ├── keyword.service.ts
│       │   │   │   └── dto/       # Request/Response DTO
│       │   │   ├── youtube/       # YouTube API 프록시 모듈
│       │   │   │   ├── youtube.module.ts
│       │   │   │   ├── youtube.controller.ts
│       │   │   │   ├── youtube.service.ts
│       │   │   │   └── dto/
│       │   │   ├── history/       # 감정 히스토리 모듈
│       │   │   │   ├── history.module.ts
│       │   │   │   ├── history.controller.ts
│       │   │   │   ├── history.service.ts
│       │   │   │   └── dto/
│       │   │   └── auth/          # 토스 로그인 인증 모듈
│       │   │       ├── auth.module.ts
│       │   │       ├── auth.guard.ts
│       │   │       └── auth.service.ts
│       │   ├── common/            # 공용 모듈
│       │   │   ├── filters/       # Exception filters
│       │   │   ├── interceptors/  # Logging, Transform
│       │   │   ├── decorators/    # Custom decorators
│       │   │   └── pipes/         # Validation pipes
│       │   └── config/            # 환경 설정
│       │       └── configuration.ts
│       ├── test/                   # E2E 테스트
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── package.json
├── packages/                      # 공유 패키지 (선택)
│   └── shared-types/              # 프론트/백엔드 공유 타입
│       ├── src/
│       │   ├── keyword.ts
│       │   ├── player.ts
│       │   └── history.ts
│       ├── tsconfig.json
│       └── package.json
├── .eslintrc.cjs
├── .gitignore
├── package.json                   # 루트 워크스페이스 설정
└── AGENTS.md
```

## WHERE TO LOOK

### 프론트엔드 (apps/client)

| Task                    | Location                                    | Notes                                    |
| ----------------------- | ------------------------------------------- | ---------------------------------------- |
| 라우팅 추가/변경        | `apps/client/src/pages/Routes.tsx`          | 앱인토스 WebView 라우팅                  |
| 키워드 목록/카테고리    | `apps/client/src/domains/keyword/constants/`| 감정/상황/날씨 30~50개                   |
| 플로팅 버블 UI          | `apps/client/src/domains/keyword/components/`| 물리 시뮬레이션 기반 인터랙션           |
| YouTube 재생 UI         | `apps/client/src/domains/player/components/`| YouTube iframe 플레이어                  |
| 감정 히스토리 UI        | `apps/client/src/domains/history/`          | 캘린더, 히스토리 카드                    |
| 토스 로그인/광고/결제   | `apps/client/src/shared/hooks/`             | @apps-in-toss/web-framework SDK          |
| AI 고지 UI              | `apps/client/src/shared/components/`        | 바텀시트 + 배지 (정책 필수)              |
| shadcn/ui 컴포넌트      | `apps/client/src/shared/components/ui/`     | Button, Dialog, Sheet 등                 |
| 디자인 토큰             | `apps/client/src/index.css`                 | Tailwind + 커스텀 컬러 무드 시스템       |

### 백엔드 (apps/server)

| Task                    | Location                                    | Notes                                    |
| ----------------------- | ------------------------------------------- | ---------------------------------------- |
| LLM 키워드 확장         | `apps/server/src/modules/keyword/`          | OpenAI/Claude API → 쿼리 변환           |
| YouTube API 프록시      | `apps/server/src/modules/youtube/`          | Data API v3 검색 (quota 관리)            |
| 감정 히스토리 CRUD      | `apps/server/src/modules/history/`          | DB 저장/조회                             |
| 토스 인증               | `apps/server/src/modules/auth/`             | 유저 식별키 검증 Guard                   |
| 환경 설정               | `apps/server/src/config/`                   | ConfigModule 기반                        |
| 공용 필터/인터셉터      | `apps/server/src/common/`                   | Exception filter, Transform interceptor  |

## CODE MAP

| Symbol              | Type      | Location                         | Role                           |
| ------------------- | --------- | -------------------------------- | ------------------------------ |
| `HomePage`          | Component | `pages/HomePage.tsx`             | 키워드 선택 (플로팅 버블)      |
| `PlayerPage`        | Component | `pages/PlayerPage.tsx`           | 플레이리스트 재생              |
| `HistoryPage`       | Component | `pages/HistoryPage.tsx`          | 감정 캘린더 히스토리           |

## CONVENTIONS

- **Strict TS**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- **baseUrl**: `.` + `paths: { "@/*": ["src/*"] }` — import 시 `@/` prefix로 절대경로 사용
- **Node**: v22 (`.nvmrc`)
- **Package Manager**: npm
- **Default Branch**: `main`

### Naming

- Components: PascalCase (`HomePage.tsx`)
- Hooks: camelCase with `use` prefix (`useKeywordExpansion.ts`)
- Utils: camelCase, 관련 함수는 하나의 파일로 그룹핑 (`queryBuilder.ts` — buildSearchQuery, optimizeQuery)
- Types/Interfaces: PascalCase (`EmotionKeyword`)
- Request 타입: `Request` 접미사 (`ExpandKeywordsRequest`)
- Response 타입: `Response` 접미사 (`ExpandKeywordsResponse`)
- Constants: UPPER_SNAKE_CASE (`YOUTUBE_API_BASE_URL`)
- Commits: Conventional Commits — 아래 Git Commits 섹션 참고

### Git Commits

Conventional Commits 스펙을 따른다. type/scope는 영문, subject(설명)는 한국어로 작성한다.

**형식:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**Type (필수):**

| Type       | 용도                                           |
| ---------- | ---------------------------------------------- |
| `feat`     | 새로운 기능 추가                               |
| `fix`      | 버그 수정                                      |
| `docs`     | 문서 변경 (README, AGENTS.md 등)               |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음) |
| `refactor` | 기능 변경 없는 코드 구조 개선                  |
| `perf`     | 성능 개선                                      |
| `test`     | 테스트 추가/수정                               |
| `chore`    | 빌드, 의존성, 설정 등 기타 변경                |
| `ci`       | CI/CD 설정 변경                                |

**Scope (선택):** 변경 대상 모듈 — `keyword`, `player`, `history`, `shared`, `config` 등

**Subject 규칙:**

- 한국어로 작성, 마침표 없음
- 50자 이내

**예시:**

```
feat(keyword): 플로팅 버블 UI 물리 시뮬레이션 구현
feat(player): YouTube iframe 플레이어 통합
fix(keyword): 키워드 4개 초과 선택 시 에러 처리
refactor(player): 검색 쿼리 생성 로직 분리
chore: 앱인토스 SDK 의존성 추가
docs: AGENTS.md 초기 생성
```

### Separation of Concerns

- **Components** = UI 컴포넌트 조합 + hook 반환값 렌더링 + 이벤트 위임. 비즈니스 로직 금지.
- **Hooks** = 서버 상태 관리 (TanStack Query) + 클라이언트 상태 관리. API 호출 캡슐화.
- **Utils** = 순수 함수 (포맷팅, 계산, 쿼리 생성). React 의존성 없음. 독립 테스트 가능.

```
Component → calls Hook → Hook uses TanStack Query → API function
     ↓           ↓
  renders UI   uses Utils (pure functions)
     ↓
  uses Utils (pure functions)
```

- **컴포넌트는 API 함수를 직접 호출하지 않는다** — 반드시 Hook을 통해서만 데이터 접근
- **컴포넌트는 Utils를 직접 호출할 수 있다** — 포맷팅, 계산 등 순수 함수는 Hook 경유 불필요
- **Hook은 TanStack Query로 서버 상태를 관리** — 캐싱, 재시도, 무효화를 선언적으로 처리

### TanStack Query

- **QueryClientProvider** — `App.tsx`에서 설정
- **Query Keys** — `domains/{domain}/constants/queryKeys.ts`에 팩토리 패턴으로 정의
- **캐싱 전략** — YouTube API quota (일 10,000 units) 대응. 인기 키워드 조합 결과 적극 캐싱.

| 데이터             | staleTime  | 이유                                          |
| ------------------ | ---------- | --------------------------------------------- |
| 키워드 확장 결과   | Infinity   | 동일 조합은 결과 불변. 캐시 적극 활용         |
| YouTube 검색 결과  | 30분       | 검색 결과는 시간에 따라 변할 수 있음          |
| 감정 히스토리      | 0 (즉시)   | 로컬 Storage 기반, 항상 최신 반영             |
| 날씨/시간 컨텍스트 | 10분       | 외부 API, 적당한 주기로 갱신                  |

### Styling

- **Tailwind CSS** + **shadcn/ui** — 모든 스타일링은 Tailwind 유틸리티 클래스로 작성
- shadcn/ui 컴포넌트는 `apps/client/src/shared/components/ui/`에 설치
- `cn()` 유틸은 `apps/client/src/shared/lib/utils.ts`에 위치
- 감정 키워드별 색상 매핑 (컬러 무드 시스템) — CSS 변수로 관리
- 앱인토스 WebView 환경에 최적화된 모바일 퍼스트 디자인
- 인라인 `style` 속성은 동적 값(물리 시뮬레이션 좌표, 감정 색상 등) 예외로 허용

### File Organization

- 파일 하나에 컴포넌트 하나 (페이지 내부 서브 컴포넌트는 같은 파일 허용)
- **파일명과 일치하는 export를 파일 최상단에 배치** — import 직후, 내부 함수보다 위에 선언
- **내부 함수/컴포넌트는 사용하는 영역 아래에 선언**
- 새 파일 추가 시 `src/` 하위에 역할별 배치: hooks/, utils/, types/ 등
- 도메인(domains/) 폴더에 속하지 않는 공용 모듈은 `src/shared/` 하위에 생성
- **barrel file (index.ts) 생성 금지** — 모든 import는 `@/` prefix로 직접 파일 경로를 지정

#### Constants 폴더 구조

`domains/{domain}/constants/` 하위에 사용처별 파일로 분리:

- `api.ts` — API 관련 상수 (BASE_URL, API_KEY, QUOTA 등)
- `queryKeys.ts` — TanStack Query 키 팩토리
- `keywords.ts` — 키워드 목록/카테고리 (keyword 도메인 전용)

#### Types 폴더 구조

`types/` 하위에 역할별 파일로 분리:

- `entity.ts` — 도메인 엔티티 (EmotionKeyword, Playlist, HistoryEntry 등)
- `request.ts` — API 요청 타입 (`Request` 접미사)
- `response.ts` — API 응답 타입 (`Response` 접미사). 필요 시 생성.

타입별 개별 파일 생성 금지 — `keyword.ts`, `playlist.ts` 등으로 쪼개지 않는다.

#### Utils 분리 기준

순수 함수를 utils로 분리하는 경우:

- 2곳 이상에서 사용되는 함수
- 알고리즘이 있어 독립 단위 테스트 가치가 있는 함수 (쿼리 생성, 물리 시뮬레이션 계산 등)
- 도메인 무관 범용 로직

인라인으로 유지하는 경우:

- 1곳에서만 사용되는 trivial 헬퍼 (1~2줄)
- 특정 컴포넌트 맥락 없이 의미 없는 함수

### Testing Strategy

- **Utils** → 단위 테스트 (vitest). 순수 함수이므로 React 의존성 없이 테스트.
  - 위치: `src/domains/**/utils/__tests__/*.test.ts` 또는 `src/shared/utils/__tests__/*.test.ts`
- **컴포넌트 + 커스텀 훅** → 통합 테스트 (testing-library + user-event). 훅을 별도로 테스트하지 않고, 컴포넌트를 통해 사용자 행동 기반으로 검증.
  - 위치: `src/domains/**/components/__tests__/*.test.tsx` 또는 `src/pages/__tests__/*.test.tsx`
- **NestJS 서비스/컨트롤러** → 단위 테스트 (jest). 모듈별 `.spec.ts` 파일.
  - 위치: `apps/server/src/modules/**/*.spec.ts`
- **NestJS E2E** → 통합 테스트 (supertest).
  - 위치: `apps/server/test/*.e2e-spec.ts`
- 접근성 쿼리 우선: `getByRole` > `getByText` > `getByLabelText` > `getByTestId`
- 사용자 행동 테스트, 구현 세부사항 테스트 금지
- **BDD 스타일 구조**: `describe` 중첩으로 Given-When-Then 맥락 표현

```bash
npm run test:client     # 프론트엔드 단일 실행
npm run test:watch      # 프론트엔드 감시 모드
npm run test:server     # 백엔드 단일 실행
npm run test:e2e        # 백엔드 E2E 테스트
```

### TypeScript

- strict mode — ESLint `no-explicit-any`, `ban-ts-comment` 규칙으로 강제
- 모든 interface/type 프로퍼티에 JSDoc 주석 필수 (`/** ... */`)
- **interface/type 프로퍼티 JSDoc 외 모든 주석 금지** — 코드 자체가 의도를 드러내도록 작성
- 객체 형태는 `interface` 우선, union/utility는 `type`
- `as any`, `as unknown as T` 등 unsafe 단언 금지
- `as const`는 리터럴 타입 추론용으로 허용

## ANTI-PATTERNS (THIS PROJECT)

- 컴포넌트 내부에 비즈니스 로직 직접 작성 금지 — hook 또는 util로 분리
- YouTube API 키를 소스코드에 하드코딩 금지 — `.env` 파일에서 `VITE_YOUTUBE_API_KEY`로 관리
- LLM API 키를 클라이언트에 노출 금지 — 서버사이드에서만 호출
- 키워드 5개 이상 선택 허용 금지 — 2~4개 제한 (UX 핵심 제약)
- YouTube iframe 외 다른 iframe 사용 금지 — 앱인토스 정책 위반
- 인트로/로딩/팝업 모달에 광고 노출 금지 — 앱인토스 다크패턴 방지 정책

## APPS-IN-TOSS PLATFORM RULES

### 필수 준수 사항

| 항목               | 규칙                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| 로그인             | 토스 로그인만 사용 (유저 식별키)                                     |
| iframe             | YouTube 영상 삽입만 예외 허용. 그 외 iframe 금지                     |
| 생성형 AI 고지     | 최초 이용 시 바텀시트 고지 + 추천 결과에 `🤖 AI 추천` 배지 표시     |
| 광고 배치          | 인트로/로딩/컷신/팝업 모달 노출 금지. 사전 로딩 필수                 |
| 배너 광고 위치     | 상단/하단에만 위치                                                   |
| 광고 중 음악       | 광고 재생 시 미니앱 음악 일시 정지                                   |
| 보상형 광고        | 시청 완료 → 보상 즉시 지급                                           |
| 결제               | 인앱결제 SDK (디지털 상품 — 프리미엄 구독)                           |

### 광고 노출 허용 타이밍

- 키워드 선택 완료 → 추천 생성 대기 중 전면 광고
- 플레이리스트 끝난 후 "더 듣기" 전 보상형 광고
- 플레이어 하단 배너 (항상 고정)
- 감정 캘린더 열기 전 보상형 광고 (무료 유저)

### 광고 노출 금지 타이밍

- 키워드 선택 중간에 갑자기 광고
- 곡 재생 중 갑자기 전면 광고
- 인트로/로딩 화면에 광고
- 팝업/바텀시트로 광고 강제

## YOUTUBE API QUICK REFERENCE

```ts
// Base URL
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 인증: API Key 파라미터
params: { key: VITE_YOUTUBE_API_KEY }

// 주요 엔드포인트
// GET /search — 영상 검색 (videoCategoryId=10 Music 필터)
// GET /videos — 영상 상세 정보

// Rate Limit: 일 10,000 units
// search: 100 units/call, videos: 1 unit/call

// 핵심 전략: LLM이 감정 키워드를 YouTube 최적화 쿼리로 변환
// 예: "잔잔한 + 새벽 + 혼자" → "lo-fi chill rain ambient korean"
```

## KEYWORD SYSTEM

### 키워드 카테고리 (30~50개 목표)

| 카테고리 | 예시                                         |
| -------- | -------------------------------------------- |
| 감정     | 잔잔한, 신나는, 우울한, 설레는, 그리운       |
| 상황     | 혼자, 드라이브, 운동, 공부, 출근길           |
| 날씨     | 비 오는, 맑은, 흐린, 눈 오는                 |
| 시간     | 새벽, 아침, 오후, 밤                         |
| 에너지   | 차분한, 활기찬, 몽환적, 강렬한               |

### 키워드 선택 규칙

- 최소 2개, 최대 4개 선택
- 선택 순서는 무관 (조합으로 처리)
- 동일 카테고리 중복 선택 허용
- 선택 완료 후 LLM 키워드 확장 → YouTube 검색 쿼리 생성

## COMMANDS

```bash
# 루트 (워크스페이스)
npm install         # 전체 의존성 설치
npm run dev         # client + server 동시 실행
npm run lint        # 전체 ESLint 검사
npm run lint:fix    # 전체 ESLint 자동 수정
npm run format      # Prettier 포맷팅

# 프론트엔드 (apps/client)
npm run dev:client      # Vite dev server
npm run build:client    # 프로덕션 빌드
npm run test:client     # vitest 단일 실행
npm run test:watch      # vitest 감시 모드
npm run typecheck:client# TypeScript 타입 체크

# 백엔드 (apps/server)
npm run dev:server      # NestJS dev (watch mode)
npm run build:server    # 프로덕션 빌드
npm run test:server     # jest 단일 실행
npm run test:e2e        # E2E 테스트
npm run typecheck:server# TypeScript 타입 체크
```

## NOTES

- YouTube API 일 10,000 units 제한 — 인기 키워드 조합 결과 캐싱으로 대응
- 앱인토스 WebView 환경 — 모바일 퍼스트, 터치 인터랙션 최적화
- 플로팅 버블 UI — 물리 시뮬레이션 성능 최적화 필수 (requestAnimationFrame)
- 생성형 AI 정책 위반 시 최대 3,000만 원 과태료 — AI 고지 UI 필수 구현
- 무료 유저 일 5회 키워드 조합 제한 — 보상형 광고로 추가 횟수 제공
- 프리미엄 구독 월 1,900~2,900원 — 광고 제거 + 무제한 조합 + 풀 히스토리
