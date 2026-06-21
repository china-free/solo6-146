import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkCard from '@/components/works/WorkCard';
import WorkPreviewModal from '@/components/works/WorkPreviewModal';
import { useWorksStore } from '@/store/worksStore';
import { MemeWork } from '@/types';
import Button from '@/components/common/Button';
import { Search, SortAsc, Grid3X3, Palette, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortType = 'newest' | 'oldest' | 'name';

export default function WorksPage() {
  const navigate = useNavigate();
  const { works, initStore, deleteWork, editWork, publishWork } = useWorksStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [previewWork, setPreviewWork] = useState<MemeWork | null>(null);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const filteredWorks = useMemo(() => {
    let result = [...works];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((w) => w.title.toLowerCase().includes(q));
    }
    switch (sortType) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        break;
    }
    return result;
  }, [works, searchQuery, sortType]);

  const publishedCount = works.filter((w) => w.isPublic).length;

  const handleEdit = (id: string) => {
    editWork(id);
    navigate('/');
  };

  const handleDelete = (id: string) => {
    const work = works.find((w) => w.id === id);
    if (work && confirm(`确定删除作品 "${work.title}" 吗？此操作无法撤销。`)) {
      deleteWork(id);
      if (previewWork?.id === id) {
        setPreviewWork(null);
      }
    }
  };

  const handlePreview = (work: MemeWork) => {
    setPreviewWork(work);
  };

  const handlePublish = (id: string) => {
    const work = works.find((w) => w.id === id);
    if (work && confirm(`确定将 "${work.title}" 发布到社区吗？`)) {
      publishWork(id);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="px-6 py-5 border-b border-border-neon bg-bg-deep/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl text-gradient-neon mb-1">
              🎨 我的作品
            </h1>
            <p className="text-gray-400 text-sm">
              查看、编辑和分享你创作的所有表情包
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Sparkles size={18} />
            保存新作品
          </Button>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-border-neon">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px] relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索作品标题..."
              className="w-full pl-11 pr-4 py-3 bg-card border border-border-neon rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300"
            />
          </div>

          <div className="relative">
            <SortAsc
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="pl-11 pr-10 py-3 bg-card border border-border-neon rounded-xl text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="newest">最新</option>
              <option value="oldest">最旧</option>
              <option value="name">名称</option>
            </select>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-neon text-white font-medium shadow-neon-pink"
            title="网格视图"
          >
            <Grid3X3 size={18} />
            网格
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border-neon">
              <Palette size={16} className="text-neon-purple" />
              <span className="text-sm text-gray-400">总作品</span>
              <span className="font-semibold text-white">{works.length}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border-neon">
              <Sparkles size={16} className="text-neon-green" />
              <span className="text-sm text-gray-400">已发布</span>
              <span className="font-semibold text-white">{publishedCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {works.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 rounded-full bg-border-neon flex items-center justify-center mb-8 animate-float">
              <Wand2 size={56} className="text-gray-500" />
            </div>
            <h3 className="font-display text-2xl text-gray-400 mb-3">
              还没有作品哦
            </h3>
            <p className="text-gray-500 mb-8 max-w-md">
              去编辑器创作你的第一个表情包吧！发挥你的创意，制作独一无二的表情包。
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-base !px-8 !py-3"
            >
              <Sparkles size={20} />
              去创作
            </Button>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="text-gray-600 mb-6" />
            <h3 className="font-display text-xl text-gray-400 mb-2">
              没有找到匹配的作品
            </h3>
            <p className="text-gray-500">试试其他关键词吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onPublish={handlePublish}
              />
            ))}
          </div>
        )}
      </div>

      <WorkPreviewModal
        work={previewWork}
        onClose={() => setPreviewWork(null)}
        onEdit={(id) => {
          setPreviewWork(null);
          handleEdit(id);
        }}
      />
    </div>
  );
}
