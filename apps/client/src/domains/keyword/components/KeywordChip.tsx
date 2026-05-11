import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface KeywordChipProps {
  /** The keyword text to display */
  keyword: string;
  /** Callback when remove button is clicked */
  onRemove: () => void;
}

export function KeywordChip({ keyword, onRemove }: KeywordChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
      <span>{keyword}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-blue-200"
        onClick={onRemove}
        aria-label={`Remove ${keyword}`}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
