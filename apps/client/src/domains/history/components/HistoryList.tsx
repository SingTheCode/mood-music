import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { HistoryEntry } from '@/domains/history/types/entity';

interface HistoryListProps {
  /** Array of history entries to display */
  entries: HistoryEntry[];
  /** Callback when an entry is selected */
  onSelectEntry: (entry: HistoryEntry) => void;
  /** Callback when an entry is deleted */
  onDeleteEntry: (id: string) => void;
}

export function HistoryList({ entries, onSelectEntry, onDeleteEntry }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No history yet. Start by selecting keywords to get recommendations!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {entries.map(entry => (
        <li
          key={entry.id}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelectEntry(entry)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
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
              <p className="text-xs text-gray-400 mt-1">
                {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                {new Date(entry.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-red-600 hover:bg-red-50"
              onClick={event => {
                event.stopPropagation();
                onDeleteEntry(entry.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
