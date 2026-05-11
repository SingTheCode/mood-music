export interface EmotionKeyword {
  /** 키워드 고유 ID */
  id: string;
  /** 표시 텍스트 (한국어) */
  label: string;
  /** 카테고리 분류 */
  category: KeywordCategory;
  /** 컬러 무드 시스템 색상 코드 */
  color: string;
}

export type KeywordCategory = "감정" | "상황" | "날씨" | "시간" | "에너지";

export interface ExpandKeywordsRequest {
  /** 선택된 키워드 목록 (2~4개) */
  keywords: string[];
}

export interface ExpandKeywordsResponse {
  /** LLM이 생성한 YouTube 검색 쿼리 */
  query: string;
}
