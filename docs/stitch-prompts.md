# 무드뮤직 — Stitch 프롬프트 가이드 (DESIGN.md 기반)

> Google Stitch 웹 UI (stitch.withgoogle.com)에서 각 화면을 생성할 때 사용할 프롬프트입니다.
> 모든 화면은 **모바일 (390×844)** 기준이며, 토스 미니앱 WebView 환경을 전제합니다.
> 디자인 시스템: DESIGN.md (Stripe-inspired — gradient mesh, Inter thin, indigo CTA, pill buttons)

---

## 공통 디자인 시스템 블록

모든 프롬프트 상단에 아래 블록을 포함하세요:

```
**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first WebView
- Font: Inter weight 300 for display/body, weight 400 for buttons/captions. font-feature-settings: "ss01" globally. "tnum" for numeric cells.
- Display tracking: -1.4px at 56px, scaling to -0.2px at 20px (negative letter-spacing is the brand signature)
- Palette:
  - Primary/CTA: Indigo (#533afd) — used ONLY for filled pill buttons and link emphasis
  - Text: Deep Navy (#0d253d) for body, Secondary (#273951), Muted (#64748d) for captions
  - Surface: White (#ffffff) canvas, Cool off-white (#f6f9fc) for feature bands, Cream (#f5e9d4) for warm interlude sections
  - Hairline: #e3e8ee for borders
  - Gradient mesh: cream → sherbet orange → lavender → indigo → ruby pink (horizontal wash, upper portion)
- Shapes: Pill (9999px) for ALL buttons/tags, 12px radius for cards, 6px for inputs
- Elevation: Level 1 (rgba(0,55,112,0.08) 0 1px 3px) for cards, Level 2 (rgba(0,55,112,0.08) 0 8px 24px) for floating panels
- Spacing: 8px base unit. Cards 32px internal padding. Section gaps 64px.
- Vibe: Editorial, thin-weight, financially precise. Gradient mesh provides atmospheric depth. Single indigo CTA per section.
```

---

## Screen 1: 메인 화면 (플로팅 버블 키워드 선택)

```
A mobile screen for an emotion-based music recommendation app. The core interaction is floating pill-shaped keyword bubbles drifting gently across the screen. The design follows a Stripe-inspired editorial aesthetic: thin typography, gradient mesh backdrop, and a single indigo CTA.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter weight 300 for all text, weight 400 for button label. font-feature-settings: "ss01". Letter-spacing: -0.64px on 32px title, 0 on body.
- Palette:
  - Background: Upper 30% has a subtle gradient mesh wash (cream #f5e9d4 → lavender #c4b5fd → soft indigo #533afd at 10% opacity), fading into white (#ffffff) canvas below
  - Primary CTA: Indigo (#533afd), text white (#ffffff)
  - Unselected bubbles: White (#ffffff) with 1px hairline border (#e3e8ee), text Deep Navy (#0d253d)
  - Selected bubbles: Indigo (#533afd) fill, white text, subtle Level 2 shadow
  - Muted text: #64748d
- Shapes: Pill (9999px) for ALL bubbles and the CTA button. No rounded-rectangles.
- Elevation: Unselected bubbles Level 1 shadow. Selected bubbles Level 2 shadow (floating feel).

**PAGE STRUCTURE:**
1. **Status bar area:** 44px top safe area, transparent over gradient mesh
2. **Header (over gradient mesh):** Left-aligned display title "지금 기분이 어때요?" in Inter 300, 32px, Deep Navy (#0d253d), letter-spacing -0.64px. Below: "키워드 2~4개를 골라주세요" in 14px, muted (#64748d), weight 300
3. **Selection counter:** Top-right, pill-shaped tag with subdued indigo background (#b9b9f9), text #533afd, showing "2/4" in Inter 400, 11px, letter-spacing 0.1px
4. **Floating bubble area (60% of screen):** 30+ pill-shaped bubbles scattered organically (NOT a grid). Each bubble is a pill with generous padding (8px 16px). Korean emotion keywords: "잔잔한", "새벽", "혼자", "설레는", "비오는날", "드라이브", "에너지", "몽환적인", "카페", "그리운", "신나는", "편안한", "운동", "레트로". Varying sizes based on text length. Unselected: white fill, hairline border, navy text. Selected: indigo fill, white text, slightly larger with Level 2 shadow glow.
5. **Bottom CTA (fixed):** Full-width pill button (9999px radius), Indigo (#533afd) fill, white text "추천 받기" in Inter 400 16px, height 52px, padding 8px 16px. Disabled state: #e3e8ee fill, #64748d text. Below button: "오늘 남은 횟수 3/5" in Inter 400, 13px, muted, letter-spacing -0.39px
6. **Safe area:** 34px bottom padding
```

---

## Screen 2: 플레이리스트 & 플레이어 화면

```
A mobile music player screen showing an AI-generated playlist. Stripe-inspired editorial design: thin Inter typography, clean white canvas, subtle card elevations, and a single indigo accent for the active track. The layout is precise and financially-clean — like a transaction list with music.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for titles/body, 400 for buttons/captions. "ss01" enabled. "tnum" for durations.
- Palette:
  - Canvas: White (#ffffff)
  - Text: Deep Navy (#0d253d) primary, #273951 secondary, #64748d muted
  - Active accent: Indigo (#533afd) for playing indicator
  - Cards: White with 1px #e3e8ee border
  - Tags: Subdued indigo (#b9b9f9) background, indigo text
  - AI badge: Cream (#f5e9d4) background, #9b6829 text
- Shapes: 12px radius for cards, pill for tags/buttons
- Elevation: Level 1 for song cards, Level 2 for now-playing bar

**PAGE STRUCTURE:**
1. **Header (sticky, white):**
   - Row: Back arrow icon (left), "플레이리스트" in Inter 300, 20px, -0.2px tracking (center), share icon (right)
   - Below: Horizontal scroll of pill tags showing selected keywords ("잔잔한", "새벽", "혼자") in subdued indigo background
   - AI badge: Pill tag "🤖 AI 추천" on cream (#f5e9d4) background, text #9b6829, Inter 400, 10px, letter-spacing 0.1px

2. **Song list (scrollable, white canvas):**
   - 6 song items as white cards with 12px radius, 1px hairline border, 16px internal padding
   - Each card row: Square thumbnail placeholder (48×48, 8px radius, cool off-white #f6f9fc fill) | Song title (Inter 300, 15px, navy, single-line truncate) + Artist below (Inter 300, 13px, muted #64748d) | Duration right-aligned (Inter 300, 14px, muted, font-feature "tnum", letter-spacing -0.42px)
   - Currently playing: Left 3px border in Indigo (#533afd), very faint indigo tint background
   - Card spacing: 8px gap

3. **Now Playing bar (fixed bottom, Level 2 shadow):**
   - White surface, 16px top-left and top-right radius, shadow upward
   - Top edge: 2px progress bar (indigo fill, #e3e8ee track)
   - Content: Thumbnail (40×40, 8px radius) | Title + artist (truncated, Inter 300) | Pill play/pause button (40×40 circle, indigo fill, white triangle/bars icon) | Next icon (muted)
   - Height: 72px + 34px safe area

4. **Ad banner placeholder:** Between last song card and now-playing bar. Dashed 1px #e3e8ee border rectangle, "광고 영역" centered in muted 13px, height 50px
```

---

## Screen 3: 추천 생성 로딩 화면

```
A mobile loading/transition screen while AI generates a playlist. Minimal, centered, editorial. The gradient mesh provides atmospheric depth behind a simple loading state. Stripe-inspired: thin type, generous whitespace, no clutter.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300, "ss01". Display at 22px with -0.22px tracking. Body at 15px.
- Palette:
  - Background: Subtle gradient mesh (very low opacity, 5-10%) washing from top — cream/lavender/indigo tones fading to white canvas
  - Text: Deep Navy (#0d253d) for heading, Muted (#64748d) for sub-text
  - Accent: Indigo (#533afd) for loading animation
  - Tags: White fill, 1px hairline border (#e3e8ee)
- Shapes: Pill for tags, circle for loader
- Elevation: None (flat, atmospheric)

**PAGE STRUCTURE:**
1. **Full-screen centered content** (vertically and horizontally centered):
   - **Keyword pills row:** 3 pill-shaped tags in a horizontal row showing selected keywords (e.g., "잔잔한", "새벽", "혼자"). White fill, 1px hairline, navy text, Inter 300 14px
   - **32px gap**
   - **Loading indicator:** A minimal pulsing ring or rotating arc in Indigo (#533afd), 40px diameter, 2px stroke. Clean and geometric, not playful.
   - **16px gap**
   - **Loading text:** "감정을 분석하고 있어요" in Inter 300, 22px, Deep Navy, -0.22px tracking, centered
   - **8px gap**
   - **Sub-text:** "🤖 AI가 플레이리스트를 생성 중" in Inter 400, 13px, muted (#64748d), letter-spacing -0.39px
2. **No buttons, no navigation** — pure transitional state
3. **Background:** Gradient mesh at very low opacity provides subtle atmospheric color without competing with content
```

---

## Screen 4: AI 고지 바텀시트 (Onboarding)

```
A mobile bottom sheet overlay for disclosing AI usage in a Korean music app. The sheet is clean, editorial, and legally precise — Stripe-inspired with thin typography and a single indigo CTA. The tone is informative, not alarming.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for body, 400 for button. "ss01". Heading 22px, -0.22px tracking.
- Palette:
  - Scrim: rgba(13,37,61,0.4) — deep navy at 40% opacity
  - Sheet: White (#ffffff)
  - Text: Deep Navy (#0d253d) heading, #273951 body
  - CTA: Indigo (#533afd) fill, white text
  - Info background: Cool off-white (#f6f9fc)
- Shapes: Sheet top corners 16px radius. CTA pill (9999px). Info card 12px radius.
- Elevation: Level 2 shadow on sheet

**PAGE STRUCTURE:**
1. **Scrim overlay:** Full-screen rgba(13,37,61,0.4) dark overlay
2. **Bottom sheet (slides up from bottom):**
   - Top corners: 16px radius. White background. Padding 32px.
   - **Drag handle:** Centered pill (40×4px, #e3e8ee) at top
   - **24px gap**
   - **Heading:** "AI 음악 추천 안내" in Inter 300, 22px, Deep Navy, -0.22px tracking, left-aligned
   - **12px gap**
   - **Body:** "무드뮤직은 AI를 활용하여 선택한 감정 키워드를 분석하고, 당신의 기분에 맞는 음악을 추천합니다." in Inter 300, 15px, #273951, line-height 1.4
   - **16px gap**
   - **Info card:** Cool off-white (#f6f9fc) background, 12px radius, padding 16px. Contains two bullet lines in Inter 300, 14px:
     - "• 키워드 조합을 AI가 분석합니다"
     - "• 추천 결과에 🤖 AI 추천 배지가 표시됩니다"
   - **24px gap**
   - **CTA:** Full-width pill button, Indigo (#533afd), white text "확인하고 시작하기" in Inter 400, 16px, height 52px
   - **34px safe area**
```

---

## Screen 5: 피드백 오버레이 (리액션)

```
A compact mobile bottom sheet for collecting quick emoji feedback on a playlist. Minimal, one-tap interaction. Stripe-inspired: thin type, single indigo selection ring, generous whitespace. Fast and unobtrusive.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for question (18px, -0.2px tracking), 400 for labels (11px)
- Palette:
  - Scrim: rgba(13,37,61,0.3)
  - Sheet: White (#ffffff)
  - Text: Deep Navy (#0d253d) for question, Muted (#64748d) for labels
  - Selected ring: Indigo (#533afd) 2px border
  - Emoji backgrounds: Cool off-white (#f6f9fc) circles
- Shapes: Sheet 16px top radius. Emoji circles 64px. Pill for dismiss.
- Elevation: Level 2 on sheet

**PAGE STRUCTURE:**
1. **Scrim:** rgba(13,37,61,0.3) full-screen overlay
2. **Compact bottom sheet** (height ~200px):
   - **Drag handle:** Centered pill (40×4px, #e3e8ee)
   - **20px gap**
   - **Question:** "이 플레이리스트 어땠어요?" in Inter 300, 18px, Deep Navy, -0.2px tracking, centered
   - **24px gap**
   - **Emoji row:** Three 64×64 circles in a centered row, 32px gaps:
     - 😐 on #f6f9fc circle, label "별로" below (Inter 400, 11px, muted)
     - 🙂 on #f6f9fc circle, label "괜찮아" below
     - 😍 on #f6f9fc circle, label "완벽해!" below
   - Selected state: Circle gets 2px Indigo (#533afd) ring border
   - **16px gap**
   - **Skip link:** "건너뛰기" in Inter 300, 13px, muted (#64748d), centered, no underline
   - **34px safe area**
```

---

## Screen 6: 감정 히스토리 화면

```
A mobile screen showing past emotion keyword selections as a timeline journal. Stripe-inspired: clean white canvas, thin typography, precise card layout with hairline borders. Like a transaction history — each entry is a past "emotion transaction."

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for titles/body, 400 for captions/dates. "ss01", "tnum" for counts.
- Palette:
  - Canvas: White (#ffffff)
  - Text: Deep Navy (#0d253d), Secondary (#273951), Muted (#64748d)
  - Cards: White with 1px #e3e8ee border
  - Tags: Subdued indigo (#b9b9f9) background, indigo (#533afd) text
  - Accent dot: Indigo (#533afd)
  - Link: Indigo (#533afd)
- Shapes: 12px radius for cards, pill for tags
- Elevation: Level 1 for cards

**PAGE STRUCTURE:**
1. **Header (sticky):**
   - Back arrow (left), "감정 기록" in Inter 300, 20px, -0.2px tracking (center), filter icon grayed out (right)

2. **Timeline list (scrollable):**
   - Grouped by date, most recent first
   - **Date separator:** "오늘", "어제", "5월 9일" in Inter 400, 11px, muted (#64748d), letter-spacing 0.1px, uppercase style
   - **History cards:** White, 12px radius, 1px hairline border, padding 16px, Level 1 shadow
     - Left edge: 6px Indigo (#533afd) circle as timeline dot
     - Top: Pill keyword tags (subdued indigo bg, indigo text, Inter 400, 11px): "잔잔한", "새벽", "혼자"
     - Middle: "5곡 재생 · 😍" in Inter 300, 13px, muted
     - Bottom-right: "다시 듣기 →" text link in Indigo (#533afd), Inter 300, 13px, no underline
   - Card spacing: 12px

3. **Empty state (if no history):**
   - Centered: Simple line illustration placeholder (64px)
   - "아직 기록이 없어요" in Inter 300, 18px, navy
   - "키워드를 골라 첫 플레이리스트를 만들어보세요" in Inter 300, 14px, muted
   - Pill CTA "시작하기" in Indigo

4. **Footer note:** "최근 20개 기록" in Inter 400, 11px, muted, centered
```

---

## Screen 7: 설정 & 프리미엄 화면

```
A mobile settings screen with a premium subscription upsell card at the top. Stripe-inspired: the premium card uses the dark featured-tier pattern (deep navy background, white text), while settings below are clean white with hairline dividers. Single indigo CTA.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for body/headings, 400 for buttons/labels. "ss01". "tnum" for price.
- Palette:
  - Canvas: White (#ffffff)
  - Premium card: Deep Navy (#1c1e54) background, white (#ffffff) text, Indigo (#533afd) CTA inside
  - Text: Deep Navy (#0d253d), Muted (#64748d)
  - Borders: Hairline (#e3e8ee)
  - Price: Inter 300 with "tnum", letter-spacing -0.42px
- Shapes: 12px radius for premium card, pill for CTA/tags, hairline dividers for list
- Elevation: Level 2 for premium card (floating), Level 0 for settings list

**PAGE STRUCTURE:**
1. **Header:** Back arrow + "설정" in Inter 300, 20px, -0.2px tracking, centered

2. **Premium upsell card (featured-tier dark pattern):**
   - Deep Navy (#1c1e54) background, 12px radius, Level 2 shadow, padding 24px
   - Top-right: "PRO" pill tag, Indigo (#533afd) fill, white text, Inter 400, 10px
   - Heading: "무드뮤직 프리미엄" in Inter 300, 22px, white, -0.22px tracking
   - Benefits list (white text, Inter 300, 14px, line-height 1.6):
     - ✓ 광고 완전 제거
     - ✓ 무제한 키워드 조합
     - ✓ 감정 캘린더 풀 히스토리
     - ✓ 프리미엄 키워드 팩
   - Price: "월 2,900원" in Inter 300, 26px, white, "tnum", -0.26px tracking
   - CTA: Full-width pill, Indigo (#533afd) fill, white text "프리미엄 시작하기", Inter 400, 16px, 48px height

3. **Settings list (white canvas, below card):**
   - Section label "계정" in Inter 400, 11px, muted, uppercase, letter-spacing 0.1px
   - Row: "토스 계정" left, "연동됨 ✓" right in muted, 52px height, bottom hairline
   - Section label "알림"
   - Row: "푸시 알림" left, toggle switch right (indigo when on)
   - Section label "정보"
   - Rows: "서비스 소개", "개인정보 처리방침", "이용약관" — each with right chevron, 52px height
   - Section label "앱 정보"
   - Row: "버전" left, "1.0.0" right in muted Inter 400, 13px, "tnum"
```

---

## Screen 8: 일일 제한 도달 + 보상형 광고 유도

```
A mobile bottom sheet that appears when a free user exhausts daily limits. Stripe-inspired: clean, informative, not punishing. Uses the cream warm-interlude pattern for the reward option card. Single indigo CTA.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile, 390×844, iOS-first
- Font: Inter 300 for headings/body, 400 for buttons/labels. "ss01".
- Palette:
  - Scrim: rgba(13,37,61,0.4)
  - Sheet: White (#ffffff)
  - Text: Deep Navy (#0d253d), Muted (#64748d)
  - Reward card: Cream (#f5e9d4) background, navy text
  - CTA: Indigo (#533afd) fill, white text
  - Secondary link: Indigo (#533afd) text
- Shapes: Sheet 16px top radius. Cards 12px. CTA pill (9999px).
- Elevation: Level 2 on sheet

**PAGE STRUCTURE:**
1. **Scrim:** rgba(13,37,61,0.4) full-screen
2. **Bottom sheet** (height ~340px, 16px top radius, white, padding 32px):
   - **Drag handle:** Centered pill (40×4px, #e3e8ee)
   - **24px gap**
   - **Icon:** Simple music note or pause symbol, 48px, in muted (#64748d), centered
   - **16px gap**
   - **Heading:** "오늘의 추천을 다 사용했어요" in Inter 300, 22px, Deep Navy, -0.22px tracking, centered
   - **8px gap**
   - **Sub-text:** "내일 다시 5회가 충전됩니다" in Inter 300, 14px, muted, centered
   - **20px gap**
   - **Reward option card (cream interlude):** Cream (#f5e9d4) background, 12px radius, padding 16px
     - Row: Play/video icon (left, navy) | "짧은 영상 보고 1회 추가 받기" Inter 300, 15px, navy (center) | "+1" pill tag in subdued indigo bg, indigo text (right)
   - **16px gap**
   - **CTA:** Full-width pill, Indigo (#533afd), white text "광고 보고 계속 듣기", Inter 400, 16px, 52px height
   - **12px gap**
   - **Secondary link:** "프리미엄으로 무제한 듣기 →" in Indigo (#533afd), Inter 300, 13px, centered, no underline
   - **34px safe area**
```

---

## Stitch 입력 순서 (권장)

| 순서 | 화면 | Device Type | 이유 |
|------|------|-------------|------|
| 1 | Screen 1 (메인 버블) | MOBILE | 핵심 경험. 디자인 톤 기준점 확립 |
| 2 | Screen 2 (플레이어) | MOBILE | 두 번째 핵심 화면. 톤 일관성 확인 |
| 3 | Screen 3 (로딩) | MOBILE | 메인→플레이어 전환 브릿지 |
| 4 | Screen 4 (AI 고지) | MOBILE | 첫 진입이지만 단순한 바텀시트 |
| 5 | Screen 5 (피드백) | MOBILE | 플레이어 위 오버레이 |
| 6 | Screen 6 (히스토리) | MOBILE | 리스트 뷰 패턴 |
| 7 | Screen 7 (설정) | MOBILE | 다크 카드 + 리스트 패턴 |
| 8 | Screen 8 (제한 도달) | MOBILE | 마지막 오버레이 |

---

## 사용 방법

1. **stitch.withgoogle.com** 접속 → 새 프로젝트 "MoodMusic" 생성
2. Device Type: **MOBILE** 선택
3. 위 프롬프트를 순서대로 복사하여 텍스트 입력란에 붙여넣기
4. 생성 후 세부 조정은 Edit 기능으로 타겟 수정
5. 모든 화면 완성 후 HTML/스크린샷 다운로드 → `.stitch/designs/` 디렉토리에 저장
