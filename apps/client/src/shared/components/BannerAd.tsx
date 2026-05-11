import { cn } from '@/shared/lib/utils';

/**
 * BannerAd 컴포넌트 Props
 */
interface BannerAdProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

export function BannerAd({ className }: BannerAdProps) {
  return (
    <div
      className={cn('fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-center bg-gray-100', className)}
    >
      <span className="text-xs text-gray-400">광고</span>
    </div>
  );
}
