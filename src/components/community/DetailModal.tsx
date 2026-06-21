import { useState } from 'react';
import { Heart, Send, Wand2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal';
import { useCommunityStore } from '@/store/communityStore';
import type { MemeWork } from '@/types';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';

interface DetailModalProps {
  work: MemeWork | null;
  onClose: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function DetailModal({ work, onClose }: DetailModalProps) {
  const navigate = useNavigate();
  const { likedIds, toggleLike, addComment } = useCommunityStore();
  const [commentContent, setCommentContent] = useState('');

  if (!work) return null;

  const isLiked = likedIds.includes(work.id);

  const handleUseTemplate = () => {
    useCommunityStore.getState().useAsTemplate(work.id);
    onClose();
    navigate('/');
  };

  const handleSendComment = () => {
    const content = commentContent.trim();
    if (!content) return;
    addComment(work.id, content);
    setCommentContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <Modal isOpen={!!work} onClose={onClose} maxWidth="max-w-4xl">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="w-full rounded-xl overflow-hidden bg-bg-card/50 border border-border-neon flex items-center justify-center">
            <img
              src={work.thumbnail || work.baseImage}
              alt={work.title}
              className="w-full object-contain max-h-[70vh]"
            />
          </div>
          <h2 className="font-display text-2xl text-white">{work.title}</h2>
          <div className="flex items-center gap-3 pb-4 border-b border-border-neon">
            <img
              src={work.author.avatar}
              alt={work.author.nickname}
              className="w-10 h-10 rounded-full border-2 border-neon-purple shadow-neon-pink/30 bg-bg-card object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-white">{work.author.nickname}</p>
              <p className="text-sm text-gray-400">{formatDate(work.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col h-full min-h-[500px]">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => toggleLike(work.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300',
                'border-2',
                isLiked
                  ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-neon-pink/30 hover:shadow-neon-pink'
                  : 'bg-bg-card border-border-neon text-white hover:border-neon-pink hover:bg-neon-pink/10'
              )}
            >
              <Heart
                className={cn('w-5 h-5', isLiked && 'fill-neon-pink')}
              />
              <span>{work.likes}</span>
            </button>
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2 !py-3"
              onClick={handleUseTemplate}
            >
              <Wand2 className="w-5 h-5" />
              <span>使用模板</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-neon-pink" />
            <h3 className="font-semibold text-white">
              评论 ({work.comments.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1 min-h-0">
            {work.comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
                <MessageCircle className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">暂无评论</p>
                <p className="text-xs mt-1 opacity-70">快来发表第一条评论吧！</p>
              </div>
            ) : (
              work.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-xl bg-bg-card/50 border border-border-neon"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full bg-bg-card object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-neon-pink truncate">
                          {comment.authorName}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1 break-words">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-neon-pink transition-colors">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border-neon flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="说点什么..."
                className="flex-1 bg-bg-card border border-border-neon rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-neon-pink transition-colors placeholder-gray-600"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentContent.trim()}
                className={cn(
                  'px-4 rounded-xl transition-all duration-300 flex items-center justify-center',
                  commentContent.trim()
                    ? 'bg-gradient-neon text-white hover:shadow-neon-pink hover:scale-105'
                    : 'bg-bg-card text-gray-500 cursor-not-allowed'
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
