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
