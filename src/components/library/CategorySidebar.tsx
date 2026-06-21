import { useState } from 'react';
import { useMaterialStore } from '@/store/materialStore';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

const POPULAR_EMOJIS = ['📁', '🎨', '💡', '🔥', '⭐', '🎭', '🌈', '🚀'];

export default function CategorySidebar() {
  const {
    categories,
    materials,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
  } = useMaterialStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(POPULAR_EMOJIS[0]);

  const getMaterialCount = (categoryId: string) => {
    if (categoryId === 'all') return materials.length;
    return materials.filter((m) => m.category === categoryId).length;
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), selectedEmoji);
    setNewCategoryName('');
    setSelectedEmoji(POPULAR_EMOJIS[0]);
    setIsModalOpen(false);
  };

  const allCount = getMaterialCount('all');

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border-neon">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-white">📂 素材分类</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-neon-pink bg-neon-pink/10 rounded-lg hover:bg-neon-pink/20 hover:shadow-neon-pink transition-all duration-300"
          >
            <Plus size={16} />
            新建
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative',
            selectedCategory === 'all'
              ? 'bg-gradient-neon shadow-neon-pink'
              : 'hover:bg-white/5'
          )}
          style={{
            borderLeft:
              selectedCategory === 'all'
                ? '3px solid #FF2E9E'
                : '3px solid transparent',
          }}
        >
          <span className="text-xl">📚</span>
          <span className="flex-1 text-left text-sm font-medium">全部</span>
          <span
            className={cn(
              'px-2 py-0.5 text-xs rounded-full',
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-border-neon text-gray-400'
            )}
          >
            {allCount}
          </span>
        </button>

        {categories.map((category) => {
          const count = getMaterialCount(category.id);
          const isSelected = selectedCategory === category.id;
          return (
            <div
              key={category.id}
              className="relative"
            >
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                  isSelected
                    ? 'bg-gradient-neon shadow-neon-pink'
                    : 'hover:bg-white/5'
                )}
                style={{
                  borderLeft: isSelected
                    ? '3px solid #FF2E9E'
                    : '3px solid transparent',
                }}
              >
                <span className="text-xl">{category.emoji}</span>
                <span className="flex-1 text-left text-sm font-medium truncate">
                  {category.name}
                </span>
                {category.isSystem && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-neon-blue/20 text-neon-blue">
                    系统
                  </span>
                )}
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-border-neon text-gray-400'
                  )}
                >
                  {count}
                </span>
                {!category.isSystem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`确定删除分类 "${category.name}" 吗？该分类下的素材将一并删除。`)) {
                        deleteCategory(category.id);
                      }
                    }}
                    className={cn(
                      'p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200',
                      'hover:bg-red-500/20 hover:text-red-400 text-gray-400',
                      'absolute right-2 opacity-0 hover:opacity-100'
                    )}
                    title="删除分类"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新建分类"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              分类名称
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="请输入分类名称"
              className="w-full px-4 py-3 bg-bg-card border border-border-neon rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              选择图标
            </label>
            <div className="grid grid-cols-8 gap-2">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={cn(
                    'aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-300',
                    selectedEmoji === emoji
                      ? 'bg-gradient-neon shadow-neon-pink scale-110'
                      : 'bg-bg-card hover:bg-white/10 border border-border-neon'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              创建
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
