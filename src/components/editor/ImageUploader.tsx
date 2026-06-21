import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

export function ImageUploader() {
  const { setBaseImage } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setBaseImage(url, img.width, img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4 select-none',
        isDragging
          ? 'border-neon-pink bg-neon-pink/10 shadow-neon-pink scale-[1.02]'
          : 'border-border-neon-light hover:border-neon-pink hover:bg-neon-pink/5'
      )}
    >
      <Upload
        className={cn(
          'w-16 h-16 transition-colors duration-300',
          isDragging ? 'text-neon-pink' : 'text-border-neon-light group-hover:text-neon-pink'
        )}
      />
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-white">
          拖拽图片到这里，或点击上传
        </p>
        <p className="text-sm text-gray-400">
          支持 JPG、PNG、GIF、WebP 等常见格式
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </div>
  );
}
