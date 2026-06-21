import { Plus, ChevronUp, ChevronDown, Trash2, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import type { TextLayer } from '@/types';
import { cn } from '@/lib/utils';

function LayerCard({
  layer,
  isSelected,
  isTop,
  isBottom,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  layer: TextLayer;
  isSelected: boolean;
  isTop: boolean;
  isBottom: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const contentPreview =
    layer.content.length > 20
      ? layer.content.slice(0, 20) + '...'
      : layer.content || '(空文字)';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-3 rounded-xl border cursor-pointer transition-all duration-200 group',
        isSelected
          ? 'border-neon-pink bg-neon-pink/10 shadow-neon-pink/30 shadow-sm'
          : 'border-border-neon bg-bg-card/50 hover:border-border-neon-light hover:bg-bg-card-hover'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.strokeColor} 100%)`,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          T
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{
              color: layer.color,
              WebkitTextStroke: layer.strokeWidth > 0 ? `${Math.min(layer.strokeWidth, 1)}px ${layer.strokeColor}` : undefined,
            }}
          >
            {contentPreview}
          </p>
          <p className="text-xs text-gray-500">
            {layer.fontFamily.split(',')[0].replace(/["']/g, '')} · {layer.fontSize}px
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 pt-2 border-t border-border-neon/50">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isTop}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              isTop
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-border-neon'
            )}
            title="上移一层"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isBottom}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              isBottom
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-border-neon'
            )}
            title="下移一层"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-all group-hover:shadow-neon-pink/20 group-hover:shadow-sm"
          title="删除图层"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function LayerPanel() {
  const {
    layers,
    selectedLayerId,
    addLayer,
    selectLayer,
    moveLayerUp,
    moveLayerDown,
    deleteLayer,
  } = useEditorStore();

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="glass rounded-2xl p-4 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-bold text-gradient-neon">图层列表</h3>
        <button
          onClick={addLayer}
          className="btn-neon-primary rounded-lg py-1.5 px-3 text-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>添加文字</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-2 min-h-0">
        {sortedLayers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
            <div className="w-16 h-16 mb-3 rounded-full bg-bg-card-hover flex items-center justify-center">
              <Plus className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">暂无图层</p>
            <p className="text-xs mt-1 opacity-70">点击上方按钮添加文字</p>
          </div>
        ) : (
          sortedLayers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              isTop={index === 0}
              isBottom={index === sortedLayers.length - 1}
              onSelect={() => selectLayer(layer.id)}
              onMoveUp={() => moveLayerUp(layer.id)}
              onMoveDown={() => moveLayerDown(layer.id)}
              onDelete={() => deleteLayer(layer.id)}
            />
          ))
        )}
      </div>

      {sortedLayers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-neon flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            共 {sortedLayers.length} 个图层
          </p>
        </div>
      )}
    </div>
  );
}
