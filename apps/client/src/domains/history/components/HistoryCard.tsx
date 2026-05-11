import type { HistoryEntry } from '@/domains/history/types/entity';

interface HistoryCardProps {
  /** The history entry to display */
  entry: HistoryEntry;
  /** Callback when card is clicked */
  onClick: () => void;
}

export function HistoryCard({ entry, onClick }: HistoryCardProps) {
  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {entry.keywords.map(keyword => (
          <span key={keyword} className="inline-block px-2 py-1 bg-blue-100 text-blue-900 text-xs rounded-full">
            {keyword}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        {entry.tracks.length} {entry.tracks.length === 1 ? 'track' : 'tracks'}
      </p>
      <p className="text-xs text-gray-400 mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
