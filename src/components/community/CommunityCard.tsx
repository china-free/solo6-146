import { useState } from 'react';
import { Heart, MessageCircle, Wand2 } from 'lucide-react';
import { useCommunityStore } from '@/store/communityStore';
import type { MemeWork } from '@/types';
import { cn } from '@/lib/utils';

interface CommunityCardProps {
  work: MemeWork;
  onOpenDetail: (work: MemeWork) => void;
}

export function CommunityCard({ work, onOpenDetail }: CommunityCardProps) {
  const { likedIds, toggleLike } = useCommunityStore();
  const isLiked = likedIds.includes(work.id);
  const [animating, setAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }
    toggleLike(work.id);
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    useCommunityStore.getState().useAsTemplate(work.id);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid mb-6',
        'shadow-card-glow border border-border-neon transition-all duration-300',
        'hover:shadow-neon-pink/30 hover:shadow-lg'
      )}
      onClick={() => onOpenDetail(work)}
    >
      <div className="relative overflow-hidden">
        <img
          src={work.thumbnail}
          alt={work.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10">
          <div className="flex items-center gap-2 p-3">
            <img
              src={work.author.avatar}
              alt={work.author.nickname}
              className="w-8 h-8 rounded-full border-2 border-white/30 bg-bg-card object-cover"
            />
            <span className="text-sm font-medium text-white drop-shadow-md truncate">
              {work.author.nickname}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10 pt-8 pb-3 px-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 transition-all hover:scale-110"
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isLiked ? 'fill-neon-pink text-neon-pink' : 'text-white',
                    animating && 'animate-bounce-heart'
                  )}
                />
                <span className={cn(
                  'text-sm font-medium',
                  isLiked ? 'text-neon-pink' : 'text-white'
                )}>
                  {work.likes}
                </span>
              </button>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">
                  {work.comments.length}
                </span>
              </div>
            </div>
            <button
              onClick={handleUseTemplate}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0',
                'bg-gradient-neon text-white shadow-neon-pink/30 hover:shadow-neon-pink hover:scale-105'
              )}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>使用模板</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
