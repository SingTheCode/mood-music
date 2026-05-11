export interface HistoryEntry {
  /** 히스토리 고유 ID */
  id: string;
  /** 선택한 키워드 조합 */
  keywords: string[];
  /** 연결된 플레이리스트 ID */
  playlistId: string;
  /** 생성 일시 */
  createdAt: string;
}
