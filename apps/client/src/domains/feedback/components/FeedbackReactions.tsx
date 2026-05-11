import { FeedbackReaction } from '@/../../../packages/shared-types/src/feedback';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

/**
 * Props for FeedbackReactions component
 */
interface FeedbackReactionsProps {
  /** Callback when a reaction is selected or deselected */
  onReactionSelect: (reaction: FeedbackReaction | undefined) => void;
  /** Currently selected reaction */
  selectedReaction?: FeedbackReaction;
}

/**
 * FeedbackReactions component - displays mini reaction buttons (DISLIKE/NEUTRAL/LIKE)
 * Allows users to provide quick feedback on recommended playlists
 */
export function FeedbackReactions({ onReactionSelect, selectedReaction }: FeedbackReactionsProps) {
  const handleReactionClick = (reaction: FeedbackReaction) => {
    // Toggle: if same reaction is clicked, deselect it
    if (selectedReaction === reaction) {
      onReactionSelect(undefined);
    } else {
      onReactionSelect(reaction);
    }
  };

  const reactions = [
    {
      value: FeedbackReaction.DISLIKE,
      label: 'Dislike',
      emoji: '👎',
    },
    {
      value: FeedbackReaction.NEUTRAL,
      label: 'Neutral',
      emoji: '😐',
    },
    {
      value: FeedbackReaction.LIKE,
      label: 'Like',
      emoji: '👍',
    },
  ];

  return (
    <div className="flex gap-2">
      {reactions.map(reaction => (
        <Button
          key={reaction.value}
          variant="outline"
          size="sm"
          onClick={() => handleReactionClick(reaction.value)}
          aria-pressed={selectedReaction === reaction.value}
          className={cn(
            'transition-colors',
            selectedReaction === reaction.value && 'bg-primary text-primary-foreground',
          )}
          title={reaction.label}
        >
          <span className="text-lg">{reaction.emoji}</span>
          <span className="ml-1 hidden sm:inline">{reaction.label}</span>
        </Button>
      ))}
    </div>
  );
}
