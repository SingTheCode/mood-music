import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { HistoryList } from '@/domains/history/components/HistoryList';
import { useHistory } from '@/domains/history/hooks/useHistory';
import type { HistoryEntry } from '@/domains/history/types/entity';

const HISTORY_LIMIT = 20;

export function HistoryPage() {
  const navigate = useNavigate();
  const { entries, deleteEntry } = useHistory({ limit: HISTORY_LIMIT });

  function handleSelectEntry(entry: HistoryEntry) {
    navigate('/player', { state: { keywords: entry.keywords } });
  }

  function handleDeleteEntry(id: string) {
    deleteEntry(id);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" size="sm" className="p-1" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">홈으로</span>
        </Button>
        <h1 className="text-lg font-semibold">감정 히스토리</h1>
      </header>

      <main className="flex-1">
        {entries.isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-2 mb-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="h-4 w-24 bg-gray-100 rounded mt-1" />
                <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
              </div>
            ))}
          </div>
        ) : !entries.data || entries.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-gray-400 text-sm">아직 추천 기록이 없어요</p>
          </div>
        ) : (
          <HistoryList entries={entries.data} onSelectEntry={handleSelectEntry} onDeleteEntry={handleDeleteEntry} />
        )}
      </main>
    </div>
  );
}
