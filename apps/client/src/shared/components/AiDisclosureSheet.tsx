import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { useAiDisclosure } from '@/shared/hooks/useAiDisclosure';

export function AiDisclosureSheet() {
  const { isDisclosed, isLoading, confirm } = useAiDisclosure();

  if (isLoading) {
    return null;
  }

  return (
    <Sheet open={!isDisclosed}>
      <SheetContent side="bottom" className="w-full">
        <SheetHeader className="text-left">
          <SheetTitle>AI 기반 음악 추천</SheetTitle>
          <SheetDescription>AI를 활용하여 키워드를 분석하고 음악을 추천합니다</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={confirm} className="w-full sm:w-auto">
            확인
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
