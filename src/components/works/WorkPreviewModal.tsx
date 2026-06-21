import { MemeWork } from '@/types';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { Download, Edit3 } from 'lucide-react';

interface WorkPreviewModalProps {
  work: MemeWork | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export default function WorkPreviewModal({
  work,
  onClose,
  onEdit,
}: WorkPreviewModalProps) {
  if (!work) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${work.title}.png`;
    link.href = work.thumbnail;
    link.click();
  };

  return (
    <Modal
      isOpen={!!work}
      onClose={onClose}
      title={work.title}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        <div className="rounded-xl overflow-hidden bg-bg-deep checkerboard">
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full max-h-[60vh] object-contain mx-auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
            <p className="text-xs text-gray-500 mb-1">标题</p>
            <p className="text-white font-medium truncate">{work.title}</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
            <p className="text-xs text-gray-500 mb-1">创建时间</p>
            <p className="text-white font-medium text-sm">
              {formatDate(work.createdAt)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
            <p className="text-xs text-gray-500 mb-1">图层数</p>
            <p className="text-white font-medium">
              <span className="text-neon-purple">{work.layers.length}</span> 个文字
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
            <p className="text-xs text-gray-500 mb-1">状态</p>
            <p
              className={
                work.isPublic
                  ? 'text-neon-green font-medium'
                  : 'text-neon-yellow font-medium'
              }
            >
              {work.isPublic ? '✓ 已公开发布' : '仅自己可见'}
            </p>
          </div>
        </div>

        {work.isPublic && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
              <p className="text-xs text-gray-500 mb-1">获赞</p>
              <p className="text-neon-pink font-medium">❤️ {work.likes}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-card border border-border-neon">
              <p className="text-xs text-gray-500 mb-1">评论</p>
              <p className="text-neon-blue font-medium">💬 {work.comments.length}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => onEdit(work.id)}
          >
            <Edit3 size={18} />
            编辑作品
          </Button>
          <Button
            variant="secondary"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <Download size={18} />
            导出下载
          </Button>
        </div>
      </div>
    </Modal>
  );
}
