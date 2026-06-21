import { useState } from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

const FONT_OPTIONS = [
  { value: 'ZCOOL KuaiLe, sans-serif', label: 'ZCOOL KuaiLe (俏皮体)' },
  { value: 'Noto Sans SC, sans-serif', label: 'Noto Sans SC (黑体)' },
  { value: 'Impact, sans-serif', label: 'Impact (英文字体)' },
  { value: 'Comic Sans MS, cursive, sans-serif', label: 'Comic Sans MS' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"KaiTi", "楷体", serif', label: '楷体' },
  { value: '"SimSun", "宋体", serif', label: '宋体' },
];

const EMOJI_LIST = ['😀', '😂', '🤣', '😍', '🥰', '😎', '🤔', '😱', '😭', '🥺', '😤', '🤡', '💀', '🔥', '💯', '✨', '💖', '👍', '👎', '👏', '🙏', '💪', '🎉', '😈', '👻'];

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-gray-400 w-16 flex-shrink-0">{label}</label>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border-neon bg-transparent overflow-hidden"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-bg-card border border-border-neon rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neon-pink transition-colors"
        />
      </div>
    </div>
  );
}

function SliderInput({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-400">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (!isNaN(num)) {
                onChange(Math.min(max, Math.max(min, num)));
              }
            }}
            className="w-16 bg-bg-card border border-border-neon rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-neon-pink transition-colors"
          />
          {unit && <span className="text-xs text-gray-500 w-4">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-bg-card rounded-lg appearance-none cursor-pointer accent-neon-pink"
        style={{
          background: `linear-gradient(to right, #FF2E9E 0%, #FF2E9E ${((value - min) / (max - min)) * 100}%, #2D2654 ${((value - min) / (max - min)) * 100}%, #2D2654 100%)`,
        }}
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5',
        active
          ? 'bg-gradient-neon text-white shadow-neon-pink/30 shadow-md'
          : 'bg-bg-card text-gray-400 hover:text-white hover:bg-bg-card-hover border border-border-neon'
      )}
    >
      {children}
    </button>
  );
}

export function PropertyPanel() {
  const { layers, selectedLayerId, updateLayer } = useEditorStore();
  const [showEmoji, setShowEmoji] = useState(false);

  const layer = layers.find((l) => l.id === selectedLayerId);

  if (!layer) {
    return (
      <div className="glass rounded-2xl p-4 flex flex-col h-full min-h-[400px]">
        <h3 className="text-lg font-bold mb-4 text-gradient-neon flex-shrink-0">文字属性</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-6">
          <div className="w-20 h-20 mb-4 rounded-full bg-bg-card-hover flex items-center justify-center border border-border-neon">
            <Bold className="w-10 h-10 opacity-40" />
          </div>
          <p className="text-sm mb-1">请选择一个文字图层进行编辑</p>
          <p className="text-xs opacity-70">在画布上点击文字或在图层面板选择</p>
        </div>
      </div>
    );
  }

  const update = <K extends keyof typeof layer>(key: K, value: (typeof layer)[K]) => {
    updateLayer(layer.id, { [key]: value } as Partial<typeof layer>);
  };

  return (
    <div className="glass rounded-2xl p-4 flex flex-col h-full min-h-[500px]">
      <h3 className="text-lg font-bold mb-4 text-gradient-neon flex-shrink-0">文字属性</h3>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 min-h-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">文字内容</label>
            <button
              onClick={() => setShowEmoji((s) => !s)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                showEmoji
                  ? 'bg-neon-pink/20 text-neon-pink shadow-neon-pink/20 shadow-sm'
                  : 'text-gray-400 hover:text-neon-pink hover:bg-bg-card-hover'
              )}
              title="插入表情"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={layer.content}
            onChange={(e) => update('content', e.target.value)}
            rows={3}
            className="w-full bg-bg-card border border-border-neon rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-neon-pink transition-colors placeholder-gray-600"
            placeholder="输入文字..."
          />
          {showEmoji && (
            <div className="bg-bg-card border border-border-neon rounded-xl p-2 grid grid-cols-8 gap-1">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    update('content', layer.content + emoji);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-border-neon transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1.5">字体</label>
          <select
            value={layer.fontFamily}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full bg-bg-card border border-border-neon rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-pink transition-colors cursor-pointer"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-card">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <SliderInput
          label="字号"
          min={12}
          max={200}
          step={1}
          value={layer.fontSize}
          onChange={(v) => update('fontSize', v)}
          unit="px"
        />

        <div className="space-y-3 p-3 bg-bg-card/50 rounded-xl border border-border-neon/50">
          <ColorPicker
            label="填充色"
            value={layer.color}
            onChange={(v) => update('color', v)}
          />
          <ColorPicker
            label="描边色"
            value={layer.strokeColor}
            onChange={(v) => update('strokeColor', v)}
          />
        </div>

        <SliderInput
          label="描边宽度"
          min={0}
          max={20}
          step={1}
          value={layer.strokeWidth}
          onChange={(v) => update('strokeWidth', v)}
          unit="px"
        />

        <div>
          <label className="text-xs text-gray-400 block mb-2">样式</label>
          <div className="flex gap-2">
            <ToggleButton
              active={layer.bold}
              onClick={() => update('bold', !layer.bold)}
              title="粗体"
            >
              <Bold className="w-4 h-4" />
              <span className="text-xs">粗体</span>
            </ToggleButton>
            <ToggleButton
              active={layer.italic}
              onClick={() => update('italic', !layer.italic)}
              title="斜体"
            >
              <Italic className="w-4 h-4" />
              <span className="text-xs">斜体</span>
            </ToggleButton>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-2">对齐方式</label>
          <div className="flex gap-2">
            <ToggleButton
              active={layer.align === 'left'}
              onClick={() => update('align', 'left')}
              title="左对齐"
            >
              <AlignLeft className="w-4 h-4" />
            </ToggleButton>
            <ToggleButton
              active={layer.align === 'center'}
              onClick={() => update('align', 'center')}
              title="居中对齐"
            >
              <AlignCenter className="w-4 h-4" />
            </ToggleButton>
            <ToggleButton
              active={layer.align === 'right'}
              onClick={() => update('align', 'right')}
              title="右对齐"
            >
              <AlignRight className="w-4 h-4" />
            </ToggleButton>
          </div>
        </div>

        <SliderInput
          label="旋转"
          min={-180}
          max={180}
          step={1}
          value={layer.rotation}
          onChange={(v) => update('rotation', v)}
          unit="°"
        />

        <SliderInput
          label="透明度"
          min={0}
          max={100}
          step={1}
          value={Math.round(layer.opacity * 100)}
          onChange={(v) => update('opacity', v / 100)}
          unit="%"
        />
      </div>
    </div>
  );
}
