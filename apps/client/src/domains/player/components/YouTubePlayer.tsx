import type { Track } from '../types/entity';

interface YouTubePlayerProps {
  /** Array of tracks to play */
  tracks: Track[];
  /** Index of currently playing track */
  currentTrackIndex: number;
}

export function YouTubePlayer({ tracks, currentTrackIndex }: YouTubePlayerProps) {
  const currentTrack = tracks[currentTrackIndex];
  const videoId = currentTrack?.videoId || '';

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

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
