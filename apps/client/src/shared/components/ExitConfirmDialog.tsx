import { useExitConfirm } from '@/shared/hooks/useExitConfirm';

export function ExitConfirmDialog() {
  const { isOpen, confirm, cancel } = useExitConfirm();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6">
        <p className="text-center text-base font-medium text-gray-900">무드뮤직을 종료할까요?</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={cancel}
            className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={confirm}
            className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}
