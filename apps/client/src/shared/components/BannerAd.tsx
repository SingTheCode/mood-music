import { useEffect, useRef } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';
import { cn } from '@/shared/lib/utils';

interface BannerAdProps {
  className?: string;
  position?: 'top' | 'bottom';
}

const BANNER_AD_GROUP_ID = import.meta.env.VITE_BANNER_AD_GROUP_ID || '';

export function BannerAd({ className, position = 'bottom' }: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !BANNER_AD_GROUP_ID) {
      return undefined;
    }

    TossAds.initialize({});

    const result = TossAds.attachBanner(BANNER_AD_GROUP_ID, containerRef.current, {});

    return () => {
      result?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('fixed left-0 right-0 z-50 h-14', position === 'bottom' ? 'bottom-0' : 'top-0', className)}
    />
  );
}
