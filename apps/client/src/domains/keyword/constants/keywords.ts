import type { EmotionKeyword, KeywordCategory } from '@mood-music/shared-types';

/**
 * 감정 키워드 전체 목록 (36개)
 * 카테고리별로 분류: 감정(10), 상황(10), 날씨/시간(8), 분위기(8)
 */
export const KEYWORDS: EmotionKeyword[] = [
  // 감정 카테고리 (10개)
  { id: 'emotion-1', label: '잔잔한', category: '감정', color: 'bg-blue-200' },
  { id: 'emotion-2', label: '신나는', category: '감정', color: 'bg-yellow-200' },
  { id: 'emotion-3', label: '우울한', category: '감정', color: 'bg-indigo-200' },
  { id: 'emotion-4', label: '설레는', category: '감정', color: 'bg-pink-200' },
  { id: 'emotion-5', label: '그리운', category: '감정', color: 'bg-purple-200' },
  { id: 'emotion-6', label: '차분한', category: '감정', color: 'bg-slate-200' },
  { id: 'emotion-7', label: '활기찬', category: '감정', color: 'bg-orange-200' },
  { id: 'emotion-8', label: '몽환적', category: '감정', color: 'bg-violet-200' },
  { id: 'emotion-9', label: '강렬한', category: '감정', color: 'bg-red-200' },
  { id: 'emotion-10', label: '편안한', category: '감정', color: 'bg-green-200' },

  // 상황 카테고리 (10개)
  { id: 'situation-1', label: '혼자', category: '상황', color: 'bg-cyan-200' },
  { id: 'situation-2', label: '드라이브', category: '상황', color: 'bg-amber-200' },
  { id: 'situation-3', label: '운동', category: '상황', color: 'bg-lime-200' },
  { id: 'situation-4', label: '공부', category: '상황', color: 'bg-teal-200' },
  { id: 'situation-5', label: '출근길', category: '상황', color: 'bg-fuchsia-200' },
  { id: 'situation-6', label: '카페', category: '상황', color: 'bg-rose-200' },
  { id: 'situation-7', label: '파티', category: '상황', color: 'bg-sky-200' },
  { id: 'situation-8', label: '명상', category: '상황', color: 'bg-emerald-200' },
  { id: 'situation-9', label: '휴식', category: '상황', color: 'bg-zinc-200' },
  { id: 'situation-10', label: '여행', category: '상황', color: 'bg-stone-200' },

  // 날씨/시간 카테고리 (8개)
  { id: 'weather-1', label: '비 오는', category: '날씨', color: 'bg-blue-300' },
  { id: 'weather-2', label: '맑은', category: '날씨', color: 'bg-yellow-300' },
  { id: 'weather-3', label: '흐린', category: '날씨', color: 'bg-gray-300' },
  { id: 'weather-4', label: '눈 오는', category: '날씨', color: 'bg-white' },
  { id: 'time-1', label: '새벽', category: '시간', color: 'bg-indigo-300' },
  { id: 'time-2', label: '아침', category: '시간', color: 'bg-orange-300' },
  { id: 'time-3', label: '오후', category: '시간', color: 'bg-yellow-400' },
  { id: 'time-4', label: '밤', category: '시간', color: 'bg-slate-700' },

  // 분위기 카테고리 (8개)
  { id: 'vibe-1', label: '로파이', category: '에너지', color: 'bg-purple-300' },
  { id: 'vibe-2', label: '클래식', category: '에너지', color: 'bg-amber-300' },
  { id: 'vibe-3', label: '일렉트로닉', category: '에너지', color: 'bg-cyan-300' },
  { id: 'vibe-4', label: '재즈', category: '에너지', color: 'bg-orange-400' },
  { id: 'vibe-5', label: '어쿠스틱', category: '에너지', color: 'bg-green-300' },
  { id: 'vibe-6', label: '앰비언트', category: '에너지', color: 'bg-violet-300' },
  { id: 'vibe-7', label: '인디', category: '에너지', color: 'bg-pink-300' },
  { id: 'vibe-8', label: '팝', category: '에너지', color: 'bg-red-300' },
];

/**
 * 카테고리별 키워드 그룹
 */
export const KEYWORDS_BY_CATEGORY = KEYWORDS.reduce(
  (acc, keyword) => {
    if (!acc[keyword.category]) {
      acc[keyword.category] = [];
    }
    acc[keyword.category].push(keyword);
    return acc;
  },
  {} as Record<KeywordCategory, EmotionKeyword[]>,
);
