import type { Track } from '../types/entity';

interface PlaylistTrackListProps {
  /** Array of tracks in the playlist */
  tracks: Track[];
  /** Index of currently playing track */
  currentTrackIndex: number;
  /** Callback when a track is selected */
  onSelectTrack: (index: number) => void;
}

export function PlaylistTrackList({ tracks, currentTrackIndex, onSelectTrack }: PlaylistTrackListProps) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No tracks available</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tracks.map((track, index) => (
              <li
                key={track.videoId}
                className={`p-3 cursor-pointer transition-colors ${
                  index === currentTrackIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectTrack(index)}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{track.title}</p>
                    <p className="text-xs text-gray-500">{track.channelName}</p>
                    <p className="text-xs text-gray-400">
                      {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                  {index === currentTrackIndex && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
