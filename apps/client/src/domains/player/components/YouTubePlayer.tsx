import type { Track } from '@/domains/player/types/entity';

interface YouTubePlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPaused?: boolean;
}

export function YouTubePlayer({ tracks, currentTrackIndex, isPaused = false }: YouTubePlayerProps) {
  const currentTrack = tracks[currentTrackIndex];
  const videoId = currentTrack?.videoId || '';

  const autoplay = isPaused ? 0 : 1;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=1&enablejsapi=1`;

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="400"
        src={embedUrl}
        title={currentTrack?.title || 'YouTube Player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full"
      />
    </div>
  );
}
