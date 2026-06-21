import { useRef, useEffect, useState, useCallback, forwardRef, ForwardedRef, useImperativeHandle } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { loadImage, wrapText } from '@/utils/canvas';
import type { TextLayer } from '@/types';
import { cn } from '@/lib/utils';

interface LoadedImageMap {
  [key: string]: HTMLImageElement;
}

interface DragState {
  isDragging: boolean;
  layerId: string | null;
  offsetX: number;
  offsetY: number;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

function getLayerBoundingBox(ctx: CanvasRenderingContext2D, layer: TextLayer, canvasWidth: number): BoundingBox {
  const fontStr = `${layer.bold ? 'bold ' : ''}${layer.italic ? 'italic ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
  ctx.save();
  ctx.font = fontStr;
  const lines = wrapText(ctx, layer.content, canvasWidth);
  ctx.restore();

  const lineHeight = layer.fontSize * 1.2;
  let maxLineWidth = 0;
  ctx.save();
  ctx.font = fontStr;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    maxLineWidth = Math.max(maxLineWidth, metrics.width);
  }
  ctx.restore();

  const totalHeight = lines.length * lineHeight;

  let baseX = layer.x;
  if (layer.align === 'center') {
    baseX -= maxLineWidth / 2;
  } else if (layer.align === 'right') {
    baseX -= maxLineWidth;
  }

  const padding = layer.strokeWidth + 4;

  const centerX = layer.x;
  const centerY = layer.y + totalHeight / 2;
  const angle = (layer.rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const corners = [
    { x: baseX - padding, y: layer.y - padding },
    { x: baseX + maxLineWidth + padding, y: layer.y - padding },
    { x: baseX + maxLineWidth + padding, y: layer.y + totalHeight + padding },
    { x: baseX - padding, y: layer.y + totalHeight + padding },
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const corner of corners) {
    const dx = corner.x - centerX;
    const dy = corner.y - centerY;
    const rotatedX = centerX + dx * cos - dy * sin;
    const rotatedY = centerY + dx * sin + dy * cos;
    minX = Math.min(minX, rotatedX);
    minY = Math.min(minY, rotatedY);
    maxX = Math.max(maxX, rotatedX);
    maxY = Math.max(maxY, rotatedY);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function isPointInBBox(px: number, py: number, bbox: BoundingBox): boolean {
  return px >= bbox.minX && px <= bbox.maxX && py >= bbox.minY && py <= bbox.maxY;
}

function getCanvasCoords(
  e: React.MouseEvent<HTMLCanvasElement> | MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

export const MemeCanvas = forwardRef<HTMLCanvasElement>(function MemeCanvas(_props, ref) {
  const {
    baseImage,
    baseImageWidth,
    baseImageHeight,
    layers,
    selectedLayerId,
    selectLayer,
    updateLayer,
  } = useEditorStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<LoadedImageMap>({});
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    layerId: null,
    offsetX: 0,
    offsetY: 0,
  });
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const CANVAS_MAX_WIDTH = 800;
  const CANVAS_MAX_HEIGHT = 600;

  const { canvasWidth, canvasHeight } = useCallback(() => {
    if (!baseImage) {
      return { canvasWidth: 600, canvasHeight: 600 };
    }
    const ratio = baseImageWidth / baseImageHeight;
    let w = CANVAS_MAX_WIDTH;
    let h = w / ratio;
    if (h > CANVAS_MAX_HEIGHT) {
      h = CANVAS_MAX_HEIGHT;
      w = h * ratio;
    }
    return { canvasWidth: Math.round(w), canvasHeight: Math.round(h) };
  }, [baseImage, baseImageWidth, baseImageHeight])();

  useEffect(() => {
    if (!baseImage) return;
    if (loadedImages[baseImage]) return;
    loadImage(baseImage)
      .then((img) => {
        setLoadedImages((prev) => ({ ...prev, [baseImage]: img }));
      })
      .catch(() => {});
  }, [baseImage, loadedImages]);

  const drawTextLayer = useCallback(
    (ctx: CanvasRenderingContext2D, layer: TextLayer, cw: number) => {
      ctx.save();

      const fontStr = `${layer.bold ? 'bold ' : ''}${layer.italic ? 'italic ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
      ctx.font = fontStr;
      ctx.textBaseline = 'top';
      ctx.globalAlpha = layer.opacity;

      const lines = wrapText(ctx, layer.content, cw);
      const lineHeight = layer.fontSize * 1.2;

      ctx.translate(layer.x, layer.y);
      ctx.rotate((layer.rotation * Math.PI) / 180);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const metrics = ctx.measureText(line);
        let xOffset = 0;
        if (layer.align === 'center') {
          xOffset = -metrics.width / 2;
        } else if (layer.align === 'right') {
          xOffset = -metrics.width;
        }

        const y = i * lineHeight;

        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth * 2;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, xOffset, y);
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(line, xOffset, y);
      }

      ctx.restore();
    },
    []
  );

  const drawSelectionBox = useCallback(
    (ctx: CanvasRenderingContext2D, bbox: BoundingBox) => {
      ctx.save();
      ctx.strokeStyle = '#FF2E9E';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(bbox.minX, bbox.minY, bbox.width, bbox.height);
      ctx.setLineDash([]);

      const handleSize = 8;
      const handles = [
        { x: bbox.minX, y: bbox.minY },
        { x: bbox.maxX, y: bbox.minY },
        { x: bbox.maxX, y: bbox.maxY },
        { x: bbox.minX, y: bbox.maxY },
        { x: (bbox.minX + bbox.maxX) / 2, y: bbox.minY },
        { x: (bbox.minX + bbox.maxX) / 2, y: bbox.maxY },
        { x: bbox.minX, y: (bbox.minY + bbox.maxY) / 2 },
        { x: bbox.maxX, y: (bbox.minY + bbox.maxY) / 2 },
      ];

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#FF2E9E';
      ctx.lineWidth = 2;
      for (const h of handles) {
        ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      }
      ctx.restore();
    },
    []
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvasWidth;
    const ch = canvasHeight;

    ctx.clearRect(0, 0, cw, ch);

    if (baseImage && loadedImages[baseImage]) {
      const img = loadedImages[baseImage];
      ctx.drawImage(img, 0, 0, cw, ch);
    }

    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    let selectedBBox: BoundingBox | null = null;
    const selectedLayer = layers.find((l) => l.id === selectedLayerId);

    for (const layer of sortedLayers) {
      drawTextLayer(ctx, layer, cw);

      if (layer.id === selectedLayerId && selectedLayer) {
        selectedBBox = getLayerBoundingBox(ctx, layer, cw);
      }
    }

    if (selectedBBox) {
      drawSelectionBox(ctx, selectedBBox);
    }
  }, [baseImage, loadedImages, layers, selectedLayerId, canvasWidth, canvasHeight, drawTextLayer, drawSelectionBox]);

  useEffect(() => {
    render();
  }, [render]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCanvasCoords(e, canvas);
      const cw = canvasWidth;

      const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

      for (const layer of sortedLayers) {
        const bbox = getLayerBoundingBox(ctx, layer, cw);
        if (isPointInBBox(x, y, bbox)) {
          selectLayer(layer.id);
          setDragState({
            isDragging: true,
            layerId: layer.id,
            offsetX: x - layer.x,
            offsetY: y - layer.y,
          });
          return;
        }
      }

      selectLayer(null);
    },
    [layers, selectedLayerId, selectLayer, canvasWidth]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragStateRef.current.isDragging || !dragStateRef.current.layerId) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getCanvasCoords(e, canvas);
      const { layerId, offsetX, offsetY } = dragStateRef.current;

      updateLayer(layerId, {
        x: x - offsetX,
        y: y - offsetY,
      });
    },
    [updateLayer]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, layerId: null, offsetX: 0, offsetY: 0 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDragState({ isDragging: false, layerId: null, offsetX: 0, offsetY: 0 });
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCanvasCoords(e, canvas);
      const cw = canvasWidth;

      const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

      for (const layer of sortedLayers) {
        const bbox = getLayerBoundingBox(ctx, layer, cw);
        if (isPointInBBox(x, y, bbox)) {
          selectLayer(layer.id);
          const newContent = window.prompt('编辑文字内容:', layer.content);
          if (newContent !== null && newContent !== undefined) {
            updateLayer(layer.id, { content: newContent });
          }
          return;
        }
      }
    },
    [layers, selectLayer, updateLayer, canvasWidth]
  );

  const aspectRatio = canvasWidth / canvasHeight;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full flex items-center justify-center p-6 rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-bg-card/80 via-bg-card/50 to-bg-card/80',
        'shadow-card-glow border border-border-neon'
      )}
    >
      <div
        className="absolute inset-0 checkerboard opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -inset-4 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,46,158,0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 shadow-2xl rounded-lg overflow-hidden"
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          minWidth: '400px',
          minHeight: '400px',
          aspectRatio: `${aspectRatio}`,
          width: `${canvasWidth}px`,
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
          className="block w-full h-full cursor-pointer"
          style={{
            imageRendering: 'auto',
          }}
        />
      </div>
    </div>
  );
});
