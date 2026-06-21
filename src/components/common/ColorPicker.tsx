import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showAlpha?: boolean;
}

const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF2E9E',
  '#00F0FF',
  '#FFEB3B',
  '#39FF14',
  '#BF00FF',
  '#FF6B6B',
  '#4ECDC4',
  '#FFA502',
  '#2ED573',
  '#1E90FF',
];

export default function ColorPicker({
  value,
  onChange,
  label,
  showAlpha = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    val = val.slice(0, 7);
    setHexInput(val);
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(val)) {
      onChange(val);
    }
  };

  const handleHexBlur = () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(hexInput)) {
      setHexInput(value);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-3">
        {label && (
          <span className="text-sm text-gray-300 whitespace-nowrap">{label}</span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-border-neon hover:border-neon-light transition-all duration-200"
        >
          <div
            className="w-6 h-6 rounded-md border border-white/20"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm text-gray-300 font-mono">{value.toUpperCase()}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 glass rounded-xl border border-border-neon shadow-card-glow z-50 animate-fade-in-up min-w-[280px]">
          <div className="mb-4">
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border-neon mb-3">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
              <div
                className="w-full h-full"
                style={{ backgroundColor: value }}
              />
            </div>

            {showAlpha && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">透明度</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-border-neon accent-neon-pink"
                />
                <span className="text-xs text-gray-400 w-10 text-right">100%</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1.5 block">HEX</label>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
              maxLength={7}
              className="w-full px-3 py-2 bg-bg-card border border-border-neon rounded-lg text-sm font-mono text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-200"
              placeholder="#XXXXXX"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">预设颜色</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange(color)}
                  className={`w-full aspect-square rounded-md border-2 transition-all duration-200 hover:scale-110 ${
                    value.toUpperCase() === color
                      ? 'border-neon-pink shadow-neon-pink'
                      : 'border-white/10 hover:border-neon-light'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
