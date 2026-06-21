import { renderMemeToCanvas } from './canvas';
import type { TextLayer } from '@/types';

export function exportPNG(canvas: HTMLCanvasElement, filename?: string): void {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename || `meme-${Date.now()}.png`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function createThumbnail(canvas: HTMLCanvasElement, maxSize: number = 320): string {
  const { width, height } = canvas;
  let thumbnailWidth = width;
  let thumbnailHeight = height;

  if (width > height) {
    if (width > maxSize) {
      thumbnailWidth = maxSize;
      thumbnailHeight = Math.round((height * maxSize) / width);
    }
  } else {
    if (height > maxSize) {
      thumbnailHeight = maxSize;
      thumbnailWidth = Math.round((width * maxSize) / height);
    }
  }

  const thumbnailCanvas = document.createElement('canvas');
  thumbnailCanvas.width = thumbnailWidth;
  thumbnailCanvas.height = thumbnailHeight;
  const ctx = thumbnailCanvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(canvas, 0, 0, thumbnailWidth, thumbnailHeight);
  }

  return thumbnailCanvas.toDataURL('image/jpeg', 0.8);
}

export async function exportRealSizePNG(
  baseImageUrl: string,
  layers: TextLayer[],
  width: number,
  height: number,
  filename?: string
): Promise<void> {
  const canvas = await renderMemeToCanvas(baseImageUrl, layers, width, height);
  exportPNG(canvas, filename);
}

export async function createRealSizeThumbnail(
  baseImageUrl: string,
  layers: TextLayer[],
  width: number,
  height: number,
  maxSize: number = 320
): Promise<string> {
  const canvas = await renderMemeToCanvas(baseImageUrl, layers, width, height);
  return createThumbnail(canvas, maxSize);
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      0.95
    );
  });
}
