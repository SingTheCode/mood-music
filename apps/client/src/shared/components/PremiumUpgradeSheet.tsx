import { Check, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { useSubscription } from '@/shared/hooks/useSubscription';

/** PremiumUpgradeSheet 컴포넌트 props */
interface PremiumUpgradeSheetProps {
  /** 시트 열림 상태 */
  open: boolean;
  /** 시트 닫기 핸들러 */
  onClose: () => void;
}

const BENEFITS = ['광고 없이 깔끔하게', '무제한 감정 키워드 추천', '전체 감정 히스토리 열람'] as const;

/**
 * 프리미엄 구독 유도 바텀시트
 * 무료 사용 횟수 소진 시 표시되어 구독을 유도한다
 */
export function PremiumUpgradeSheet({ open, onClose }: PremiumUpgradeSheetProps) {
  const { subscribe, isSubscribing } = useSubscription();

  async function handleSubscribe() {
    await subscribe();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <SheetContent side="bottom" className="w-full rounded-t-2xl pb-8">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            프리미엄으로 업그레이드
          </SheetTitle>
          <SheetDescription>더 풍부한 음악 추천을 경험하세요</SheetDescription>
        </SheetHeader>

        <ul className="mt-6 space-y-3">
          {BENEFITS.map(benefit => (
            <li key={benefit} className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 shrink-0 text-green-500" />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-3">
          <Button onClick={handleSubscribe} disabled={isSubscribing} className="w-full" size="lg">
            {isSubscribing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                결제 처리 중...
              </>
            ) : (
              '월 1,900원으로 구독하기'
            )}
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={isSubscribing} className="w-full" size="sm">
            나중에 할게요
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
