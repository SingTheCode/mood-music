import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HistoryList } from '../HistoryList';
import type { HistoryEntry } from '../../types/entity';

describe('HistoryList', () => {
  const mockEntries: HistoryEntry[] = [
    {
      id: 'entry-1',
      keywords: ['잔잔한', '새벽'],
      tracks: [
        { videoId: 'abc123', title: 'Chill Music 1' },
        { videoId: 'def456', title: 'Chill Music 2' },
      ],
      createdAt: new Date('2026-05-12T10:00:00Z').toISOString(),
    },
    {
      id: 'entry-2',
      keywords: ['신나는', '운동'],
      tracks: [{ videoId: 'ghi789', title: 'Energetic Music' }],
      createdAt: new Date('2026-05-11T15:30:00Z').toISOString(),
    },
  ];

  it('should render history list with entries', () => {
    const { container } = render(<HistoryList entries={mockEntries} onSelectEntry={vi.fn()} onDeleteEntry={vi.fn()} />);

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(2);
  });

  it('should render empty state when no entries', () => {
    const { container } = render(<HistoryList entries={[]} onSelectEntry={vi.fn()} onDeleteEntry={vi.fn()} />);

    const emptyMessage = container.textContent;
    expect(emptyMessage).toContain('No history');
  });

  it('should display keywords for each entry', () => {
    const { container } = render(<HistoryList entries={mockEntries} onSelectEntry={vi.fn()} onDeleteEntry={vi.fn()} />);

    expect(container.textContent).toContain('잔잔한');
    expect(container.textContent).toContain('새벽');
    expect(container.textContent).toContain('신나는');
    expect(container.textContent).toContain('운동');
  });

  it('should display track count for each entry', () => {
    const { container } = render(<HistoryList entries={mockEntries} onSelectEntry={vi.fn()} onDeleteEntry={vi.fn()} />);

    expect(container.textContent).toContain('2 tracks');
    expect(container.textContent).toContain('1 track');
  });

  it('should call onSelectEntry when entry is clicked', async () => {
    const onSelectEntry = vi.fn();
    const { container } = render(
      <HistoryList entries={mockEntries} onSelectEntry={onSelectEntry} onDeleteEntry={vi.fn()} />,
    );

    const firstEntry = container.querySelector('li');
    if (firstEntry) {
      firstEntry.click();
      expect(onSelectEntry).toHaveBeenCalledWith(mockEntries[0]);
    }
  });

  it('should call onDeleteEntry when delete button is clicked', async () => {
    const onDeleteEntry = vi.fn();
    const { container } = render(
      <HistoryList entries={mockEntries} onSelectEntry={vi.fn()} onDeleteEntry={onDeleteEntry} />,
    );

    const deleteButtons = container.querySelectorAll('button');
    if (deleteButtons.length > 0) {
      const firstButton = deleteButtons[0];
      if (firstButton) {
        firstButton.click();
        expect(onDeleteEntry).toHaveBeenCalledWith('entry-1');
      }
    }
  });
});
