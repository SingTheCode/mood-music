import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatingBubble } from '@/domains/keyword/components/FloatingBubble';
import { SelectionGuide } from '@/domains/keyword/components/SelectionGuide';
import { KeywordChip } from '@/domains/keyword/components/KeywordChip';
import { useKeywordSelection } from '@/domains/keyword/hooks/useKeywordSelection';
import { KEYWORDS } from '@/domains/keyword/constants/keywords';
import { Button } from '@/shared/components/ui/button';
import type { BubblePhysicsConfig, CanvasDimensions } from '@/domains/keyword/types/entity';

const BUBBLE_CONFIG: BubblePhysicsConfig = {
  minDistance: 100,
  edgePadding: 20,
  bubbleRadius: 40,
  maxPositionAttempts: 50,
};

export function HomePage() {
  const navigate = useNavigate();
  const { state, toggleKeyword, removeKeyword } = useKeywordSelection();

  const keywordLabels = useMemo(() => KEYWORDS.map(k => k.label), []);

  const canvasDimensions: CanvasDimensions = useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    [],
  );

  const handleRecommend = () => {
    navigate('/player', { state: { keywords: state.selected } });
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <FloatingBubble
        keywords={keywordLabels}
        selected={state.selected}
        onSelect={toggleKeyword}
        config={BUBBLE_CONFIG}
        canvasDimensions={canvasDimensions}
      />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white/95 to-white/0">
        {state.selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {state.selected.map(keyword => (
              <KeywordChip key={keyword} keyword={keyword} onRemove={() => removeKeyword(keyword)} />
            ))}
          </div>
        )}

        <SelectionGuide selectedCount={state.selected.length} />

        <Button size="lg" className="w-full mt-3" disabled={!state.canRecommend} onClick={handleRecommend}>
          추천 받기
        </Button>
      </div>
    </div>
  );
}
