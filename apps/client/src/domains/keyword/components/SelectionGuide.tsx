interface SelectionGuideProps {
  /** Number of keywords currently selected */
  selectedCount: number;
}

export function SelectionGuide({ selectedCount }: SelectionGuideProps) {
  if (selectedCount >= 2) {
    return null;
  }

  const remaining = 2 - selectedCount;
  return (
    <div className="text-center text-sm text-gray-600 mt-4">
      {remaining === 1 ? '1개 더 골라주세요' : '2개 이상 골라주세요'}
    </div>
  );
}
