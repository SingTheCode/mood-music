import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { YouTubePlayer } from '@/domains/player/components/YouTubePlayer';
import { PlaylistTrackList } from '@/domains/player/components/PlaylistTrackList';
import { usePlaylistSearch } from '@/domains/player/hooks/usePlaylistSearch';
import { FeedbackReactions } from '@/domains/feedback/components/FeedbackReactions';
import { AiBadge } from '@/shared/components/AiBadge';
import { useHistory } from '@/domains/history/hooks/useHistory';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { FeedbackReaction } from '@/../../../packages/shared-types/src/feedback';

export function PlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const keywords: string[] = useMemo(() => location.state?.keywords ?? [], [location.state?.keywords]);

  const { data, isLoading, isError } = usePlaylistSearch(keywords);
  const { saveEntry } = useHistory();

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedReaction, setSelectedReaction] = useState<FeedbackReaction | undefined>(undefined);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (data?.tracks && data.tracks.length > 0 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveEntry({
        keywords,
        tracks: data.tracks.map(track => ({
          videoId: track.videoId,
          title: track.title,
        })),
      });
    }
  }, [data, keywords, saveEntry]);

  if (keywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
        <p className="text-gray-500">선택된 키워드가 없습니다.</p>
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">
          ← 다시 선택
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="w-full h-56 rounded-lg" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  if (isError || !data || data.tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
        <p className="text-gray-500">{isError ? '추천 결과를 불러오지 못했습니다.' : '추천 결과가 없습니다.'}</p>
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">
          ← 다시 선택
        </button>
      </div>
    );
  }

  const tracks = data.tracks;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto pb-24">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-900">
          ← 다시 선택
        </button>
        <AiBadge />
      </div>

      <YouTubePlayer tracks={tracks} currentTrackIndex={currentTrackIndex} />

      <PlaylistTrackList tracks={tracks} currentTrackIndex={currentTrackIndex} onSelectTrack={setCurrentTrackIndex} />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-center">
        <FeedbackReactions onReactionSelect={setSelectedReaction} selectedReaction={selectedReaction} />
      </div>
    </div>
  );
}
