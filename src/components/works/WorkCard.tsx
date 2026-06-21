import { MemeWork } from '@/types';
import { Edit, Eye, Trash2, Share2, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

interface WorkCardProps {
  work: MemeWork;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (work: MemeWork) => void;
  onPublish: (id: string) => void;
}

export default function WorkCard({
  work,
  onEdit,
  onDelete,
  onPreview,
  onPublish,
}: WorkCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border-neon transition-all duration-300 hover:translate-y-[-2px] hover:shadow-card-glow hover:border-border-neon-light">
      <div
        className="aspect-video overflow-hidden cursor-pointer bg-bg-deep"
        onClick={() => onPreview(work)}
      >
        <img
          src={work.thumbnail}
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white truncate mb-2" title={work.title}>
          {work.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>{formatDate(work.createdAt)}</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-neon-purple/20 text-neon-purple">
            {work.layers.length} 个文字
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-border-neon">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 flex-1 !py-1.5"
          onClick={() => onEdit(work.id)}
        >
          <Edit size={14} />
          编辑
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onPreview(work)}
          title="预览"
        >
          <Eye size={16} />
        </Button>

        {work.isPublic ? (
          <span
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-neon-green/20 text-neon-green'
            )}
            title="已发布"
          >
            <Check size={14} />
            已发布
          </span>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 !py-1.5"
            onClick={() => onPublish(work.id)}
            title="发布到社区"
          >
            <Share2 size={14} />
            发布
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => onDelete(work.id)}
          title="删除"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
