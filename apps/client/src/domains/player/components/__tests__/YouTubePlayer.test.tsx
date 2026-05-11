import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { YouTubePlayer } from '../YouTubePlayer';
import type { Track } from '../../types/entity';

describe('YouTubePlayer', () => {
  const mockTracks: Track[] = [
    {
      videoId: 'abc123',
      title: 'Chill Music 1',
      thumbnail: 'https://example.com/thumb1.jpg',
      duration: 180,
      channelName: 'Chill Channel',
    },
    {
      videoId: 'def456',
      title: 'Chill Music 2',
      thumbnail: 'https://example.com/thumb2.jpg',
      duration: 240,
      channelName: 'Chill Channel',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render iframe with first video', () => {
    const { container } = render(<YouTubePlayer tracks={mockTracks} currentTrackIndex={0} />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain('abc123');
  });

  it('should render with correct YouTube embed URL', () => {
    const { container } = render(<YouTubePlayer tracks={mockTracks} currentTrackIndex={0} />);

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.src).toContain('youtube.com/embed/abc123');
  });

  it('should update iframe when currentTrackIndex changes', () => {
    const { container, rerender } = render(<YouTubePlayer tracks={mockTracks} currentTrackIndex={0} />);

    let iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.src).toContain('abc123');

    rerender(<YouTubePlayer tracks={mockTracks} currentTrackIndex={1} />);

    iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.src).toContain('def456');
  });

  it('should render with empty tracks', () => {
    const { container } = render(<YouTubePlayer tracks={[]} currentTrackIndex={0} />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
  });

  it('should have proper iframe attributes for accessibility', () => {
    const { container } = render(<YouTubePlayer tracks={mockTracks} currentTrackIndex={0} />);

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.getAttribute('allow')).toContain('accelerometer');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
    expect(iframe.getAttribute('allow')).toContain('clipboard-write');
    expect(iframe.getAttribute('allow')).toContain('encrypted-media');
    expect(iframe.getAttribute('allow')).toContain('gyroscope');
    expect(iframe.getAttribute('allow')).toContain('picture-in-picture');
  });
});
