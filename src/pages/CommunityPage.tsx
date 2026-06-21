import { useEffect, useState, useMemo } from 'react';
import { Search, Flame, Clock, Sparkles, Heart, TrendingUp, PlusCircle } from 'lucide-react';
import { useCommunityStore } from '@/store/communityStore';
import { CommunityCard } from '@/components/community/CommunityCard';
import { DetailModal } from '@/components/community/DetailModal';
import type { MemeWork } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORY_TABS = [
  { id: 'all', name: '全部', emoji: '✨' },
  { id: 'cat-funny', name: '搞笑', emoji: '😂' },
  { id: 'cat-reaction', name: '反应', emoji: '😱' },
  { id: 'cat-animal', name: '动物', emoji: '🐱' },
  { id: 'cat-anime', name: '动漫', emoji: '🎌' },
  { id: 'cat-dialog', name: '对话', emoji: '💬' },
];

export default function CommunityPage() {
  const { works, initStore, sortBy, setSortBy } = useCommunityStore();
  const [selectedWork, setSelectedWork] = useState<MemeWork | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initStore();
  }, [initStore]);

  const stats = useMemo(() => {
    const totalWorks = works.length;
    const totalLikes = works.reduce((sum, w) => sum + w.likes, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNew = works.filter((w) => w.createdAt >= today.getTime()).length;
    return { totalWorks, totalLikes, todayNew };
  }, [works]);

  const filteredWorks = useMemo(() => {
    let result = [...works];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.author.nickname.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'hot') {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [works, searchQuery, sortBy]);

  const handleOpenDetail = (work: MemeWork) => {
    setSelectedWork(work);
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl mb-3 text-gradient-neon bg-gradient-neon bg-clip-text text-transparent">
            🌟 社区广场
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            发现其他创作者的优秀作品，激发你的灵感！
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center shadow-neon-pink/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{stats.totalWorks}</p>
                <p className="text-sm text-gray-400">总作品数</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-pink-yellow flex items-center justify-center shadow-neon-pink/30">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                <p className="text-sm text-gray-400">总点赞数</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-neon-blue/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{stats.todayNew}</p>
                <p className="text-sm text-gray-400">今日新增</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-16 z-40 glass px-6 py-3 my-6 rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-1 bg-bg-card rounded-xl p-1 border border-border-neon">
              <button
                onClick={() => setSortBy('latest')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  sortBy === 'latest'
                    ? 'bg-gradient-neon text-white shadow-neon-pink/30'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Clock className="w-4 h-4" />
                <span>最新</span>
              </button>
              <button
                onClick={() => setSortBy('hot')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  sortBy === 'hot'
                    ? 'bg-gradient-neon text-white shadow-neon-pink/30'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Flame className="w-4 h-4" />
                <span>最热</span>
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-0.5 flex-1 w-full md:w-auto justify-center">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                    activeCategory === tab.id
                      ? 'bg-gradient-neon text-white shadow-neon-pink/30'
                      : 'bg-bg-card text-gray-300 hover:bg-bg-card-hover hover:text-white border border-border-neon'
                  )}
                >
                  <span className="mr-1">{tab.emoji}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索作品或作者..."
                className="w-full bg-bg-card border border-border-neon rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
              />
            </div>
          </div>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-bg-card border border-border-neon flex items-center justify-center">
              <PlusCircle className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              暂无社区作品
            </h3>
            <p className="text-gray-400">快来发布第一个吧！</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {filteredWorks.map((work) => (
              <CommunityCard
                key={work.id}
                work={work}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        )}
      </div>

      <DetailModal
        work={selectedWork}
        onClose={() => setSelectedWork(null)}
      />
    </div>
  );
}
