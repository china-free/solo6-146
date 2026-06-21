import type { TextLayer, MemeProject } from '@/types';

const imageCache = new Map<string, HTMLImageElement>();

export function measureTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  fontFamily: string
): number {
  ctx.save();
  ctx.font = `${fontSize}px ${fontFamily}`;
  const width = ctx.measureText(text).width;
  ctx.restore();
  return width;
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }

    let currentLine = '';
    for (let i = 0; i < paragraph.length; i++) {
      const char = paragraph[i];
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine !== '') {
      lines.push(currentLine);
    }
  }

  return lines;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const cached = imageCache.get(src);
    if (cached) {
      if (cached.complete && cached.naturalWidth > 0) {
        resolve(cached);
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
}

export { imageCache };

export function drawTextLayerOnCanvas(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  canvasWidth: number
): void {
  ctx.save();

  const fontStr = `${layer.bold ? 'bold ' : ''}${layer.italic ? 'italic ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
  ctx.font = fontStr;
  ctx.textBaseline = 'top';
  ctx.globalAlpha = layer.opacity;

  const lines = wrapText(ctx, layer.content, canvasWidth);
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
}

export async function renderMemeToCanvas(
  baseImageUrl: string,
  layers: TextLayer[],
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.clearRect(0, 0, width, height);

  if (baseImageUrl) {
    try {
      const img = await loadImage(baseImageUrl);
      ctx.drawImage(img, 0, 0, width, height);
    } catch {
      // ignore image load error, draw blank background
      ctx.fillStyle = '#1A1635';
      ctx.fillRect(0, 0, width, height);
    }
  }

  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const layer of sortedLayers) {
    drawTextLayerOnCanvas(ctx, layer, width);
  }

  return canvas;
}

export async function renderProjectToCanvas(project: MemeProject): Promise<HTMLCanvasElement> {
  return renderMemeToCanvas(project.baseImage, project.layers, project.baseImageWidth, project.baseImageHeight);
}
