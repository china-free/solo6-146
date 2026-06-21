import { useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import { useMaterialStore } from '@/store/materialStore';
import { useEditorStore } from '@/store/editorStore';
import { loadImage } from '@/utils/canvas';
import { DEFAULT_TEMPLATES } from '@/utils/mockData';
import { cn } from '@/lib/utils';

const CATEGORY_TABS = [
  { id: 'all', name: '全部', emoji: '✨' },
  { id: 'cat-funny', name: '搞笑', emoji: '😂' },
  { id: 'cat-reaction', name: '反应', emoji: '😱' },
  { id: 'cat-animal', name: '动物', emoji: '🐱' },
  { id: 'cat-anime', name: '动漫', emoji: '🎌' },
  { id: 'cat-dialog', name: '对话', emoji: '💬' },
];

interface TemplateSelectorProps {
  onUploadClick?: () => void;
}

export function TemplateSelector({ onUploadClick }: TemplateSelectorProps) {
  const { materials, initStore } = useMaterialStore();
  const { baseImage, setBaseImage } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const templates = useMemo(() => {
    const systemMaterials = materials.length > 0
      ? materials.filter((m) => m.isSystem)
      : DEFAULT_TEMPLATES;
    if (activeCategory === 'all') {
      return systemMaterials;
    }
    return systemMaterials.filter((m) => m.category === activeCategory);
  }, [materials, activeCategory]);

  const handleSelectTemplate = async (url: string) => {
    try {
      const img = await loadImage(url);
      setBaseImage(url, img.width, img.height);
    } catch {
      setBaseImage(url, 600, 600);
    }
  };

  const handleInitStoreOnce = () => {
    if (materials.length === 0) {
      initStore();
    }
  };

  return (
    <div className="glass rounded-2xl p-4 flex flex-col h-full min-h-[500px]">
      <h3 className="text-lg font-bold mb-3 text-gradient-neon">选择模板</h3>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              handleInitStoreOnce();
              setActiveCategory(tab.id);
            }}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
              activeCategory === tab.id
                ? 'bg-gradient-neon text-white shadow-neon-pink'
                : 'bg-bg-card text-gray-300 hover:bg-bg-card-hover hover:text-white border border-border-neon'
            )}
          >
            <span className="mr-1">{tab.emoji}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-3 gap-2">
          {templates.map((template) => {
            const isSelected = baseImage === template.url;
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.url)}
                className={cn(
                  'relative rounded-xl overflow-hidden aspect-square transition-all duration-200 group',
                  'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neon-pink/30',
                  isSelected
                    ? 'ring-2 ring-neon-pink shadow-neon-pink'
                    : 'ring-1 ring-border-neon hover:ring-neon-pink/50'
                )}
                title={template.name}
              >
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-neon-pink/20 pointer-events-none" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">{template.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onUploadClick}
        className="mt-4 w-full btn-neon-outline rounded-xl py-2.5 flex items-center justify-center gap-2 border-dashed hover:border-neon-pink transition-colors flex-shrink-0"
      >
        <Upload className="w-4 h-4" />
        <span>上传我的图片</span>
      </button>
    </div>
  );
}
