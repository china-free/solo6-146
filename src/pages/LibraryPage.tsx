import { useEffect } from 'react';
import CategorySidebar from '@/components/library/CategorySidebar';
import MaterialGrid from '@/components/library/MaterialGrid';
import { useMaterialStore } from '@/store/materialStore';

export default function LibraryPage() {
  const { initStore } = useMaterialStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="px-6 py-5 border-b border-border-neon">
        <h1 className="font-display text-3xl text-gradient-neon mb-1">
          📚 素材库管理
        </h1>
        <p className="text-gray-400 text-sm">
          管理你的图片素材，创作更高效
        </p>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-64 border-r border-border-neon flex-shrink-0">
          <CategorySidebar />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <MaterialGrid />
        </div>
      </div>
    </div>
  );
}
