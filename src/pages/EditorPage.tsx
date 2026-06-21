import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCcw, Save, Download, Sparkles, Image, FolderHeart, Users } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useWorksStore } from '@/store/worksStore';
import { useMaterialStore } from '@/store/materialStore';
import { useCommunityStore } from '@/store/communityStore';
import { exportRealSizePNG, createRealSizeThumbnail } from '@/utils/export';
import { MemeCanvas } from '@/components/editor/MemeCanvas';
import { TemplateSelector } from '@/components/editor/TemplateSelector';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { LayerPanel } from '@/components/editor/LayerPanel';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    canvasScale,
    setCanvasScale,
    baseImage,
    baseImageWidth,
    baseImageHeight,
    layers,
    clearAll,
  } = useEditorStore();

  const { initStore: initEditorStore } = useEditorStore();
  const { initStore: initWorksStore } = useWorksStore();
  const { initStore: initMaterialStore } = useMaterialStore();
  const { initStore: initCommunityStore } = useCommunityStore();
  const { saveWork } = useWorksStore();

  useEffect(() => {
    initEditorStore();
    initWorksStore();
    initMaterialStore();
    initCommunityStore();
  }, [initEditorStore, initWorksStore, initMaterialStore, initCommunityStore]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasScale(parseFloat(e.target.value));
  };

  const handleZoomIn = () => {
    setCanvasScale(Math.min(3, canvasScale + 0.2));
  };

  const handleZoomOut = () => {
    setCanvasScale(Math.max(0.2, canvasScale - 0.2));
  };

  const handleResetView = () => {
    setCanvasScale(1);
  };

  const handleSaveWork = async () => {
    if (!baseImage) {
      showToast('请先选择或上传一张图片', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('请输入作品标题', 'error');
      return;
    }
    try {
      setIsExporting(true);
      const thumbnail = await createRealSizeThumbnail(
        baseImage,
        layers,
        baseImageWidth,
        baseImageHeight
      );
      saveWork({
        title: title.trim(),
        baseImage,
        baseImageWidth,
        baseImageHeight,
        layers,
        thumbnail,
      });
      showToast('作品保存成功！✨');
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    if (!baseImage) {
      showToast('请先选择或上传一张图片', 'error');
      return;
    }
    try {
      setIsExporting(true);
      await exportRealSizePNG(
        baseImage,
        layers,
        baseImageWidth,
        baseImageHeight,
        title.trim() || 'meme'
      );
      showToast('导出成功！📥');
    } catch {
      showToast('导出失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAndDownload = async () => {
    if (!baseImage) {
      showToast('请先选择或上传一张图片', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('请输入作品标题', 'error');
      return;
    }
    try {
      setIsExporting(true);
      const thumbnail = await createRealSizeThumbnail(
        baseImage,
        layers,
        baseImageWidth,
        baseImageHeight
      );
      saveWork({
        title: title.trim(),
        baseImage,
        baseImageWidth,
        baseImageHeight,
        layers,
        thumbnail,
      });
      await exportRealSizePNG(
        baseImage,
        layers,
        baseImageWidth,
        baseImageHeight,
        title.trim()
      );
      showToast('保存并下载成功！🎉');
    } catch {
      showToast('操作失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCanvas = () => {
    if (baseImage || layers.length > 0) {
      if (window.confirm('确定要清空画布吗？所有内容将丢失。')) {
        clearAll();
        setTitle('');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-bg-deep flex flex-col overflow-hidden">
      {toast && (
        <div className={cn(
          'fixed top-20 right-6 z-50 px-5 py-3 rounded-xl font-medium shadow-lg animate-fade-in-up',
          toast.type === 'success'
            ? 'bg-gradient-neon text-white shadow-neon-pink/40'
            : 'bg-red-500/90 text-white shadow-red-500/40'
        )}>
          {toast.message}
        </div>
      )}

      <div className="glass m-4 p-4 rounded-2xl flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-neon-pink animate-pulse" />
          <p className="text-white font-medium">
            👋 欢迎来到 <span className="text-gradient-neon bg-gradient-neon bg-clip-text text-transparent font-display">MemeCraft</span>！选择一个模板或上传图片开始创作吧
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/library"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Image className="w-4 h-4" />
            <span>素材库</span>
          </Link>
          <Link
            to="/works"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <FolderHeart className="w-4 h-4" />
            <span>我的作品</span>
          </Link>
          <Link
            to="/community"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>社区广场</span>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 px-4 pb-4 h-[calc(100%-120px)] min-h-0">
        <div className="w-80 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
          <div className="flex-1 min-h-0">
            <TemplateSelector />
          </div>
          <ImageUploader />
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div
                className={cn(
                  'w-full h-full',
                  canvasScale !== 1 && 'overflow-auto'
                )}
                style={{
                  transform: canvasScale !== 1 ? `scale(${canvasScale})` : undefined,
                  transformOrigin: 'center center',
                }}
              >
                <MemeCanvas />
              </div>
          </div>

          <div className="glass p-4 rounded-2xl flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="作品标题"
                  className="w-full bg-bg-card border border-border-neon rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-x border-border-neon px-4">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                title="缩小"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 w-36">
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={canvasScale}
                  onChange={handleScaleChange}
                  className="w-full h-2 bg-bg-card rounded-lg appearance-none cursor-pointer accent-neon-pink"
                  style={{
                    background: `linear-gradient(to right, #FF2E9E 0%, #FF2E9E ${((canvasScale - 0.2) / (3 - 0.2)) * 100}%, #2D2654 ${((canvasScale - 0.2) / (3 - 0.2)) * 100}%, #2D2654 100%)`,
                  }}
                />
                <span className="text-xs text-gray-400 w-10 text-right">
                  {(canvasScale * 100).toFixed(0)}%
                </span>
              </div>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                title="放大"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all ml-1"
                title="重置视图"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleClearCanvas}
                className="!px-3 !py-2 text-sm"
              >
                清空画布
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveWork}
                className="!px-4 !py-2 text-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>保存作品</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleExportPNG}
                className="!px-4 !py-2 text-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>导出PNG</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAndDownload}
                className="!px-4 !py-2 text-sm flex items-center gap-1.5 animate-pulse-neon"
              >
                <Sparkles className="w-4 h-4" />
                <span>保存并下载</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
          <div className="flex-1 min-h-0">
            <LayerPanel />
          </div>
          <div className="flex-1 min-h-0">
            <PropertyPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
