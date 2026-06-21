export interface TextLayer {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  rotation: number;
  opacity: number;
  zIndex: number;
}

export interface MaterialImage {
  id: string;
  url: string;
  name: string;
  category: string;
  width: number;
  height: number;
  createdAt: number;
  isSystem: boolean;
}

export interface MemeProject {
  version: '1.0.0';
  baseImage: string;
  baseImageWidth: number;
  baseImageHeight: number;
  layers: TextLayer[];
}

export interface MemeWork {
  id: string;
  title: string;
  thumbnail: string;
  project: MemeProject;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  likes: number;
  comments: Comment[];
  author: UserInfo;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  isSystem: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: number;
  likes: number;
}

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
}

export interface EditorState {
  baseImage: string | null;
  baseImageWidth: number;
  baseImageHeight: number;
  layers: TextLayer[];
  selectedLayerId: string | null;
  canvasScale: number;
  canvasOffsetX: number;
  canvasOffsetY: number;
}

export const MEME_PROJECT_VERSION = '1.0.0' as const;

export function createEmptyProject(): MemeProject {
  return {
    version: MEME_PROJECT_VERSION,
    baseImage: '',
    baseImageWidth: 600,
    baseImageHeight: 600,
    layers: [],
  };
}

export function isMemeProject(obj: unknown): obj is MemeProject {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as Record<string, unknown>;
  return (
    typeof p.version === 'string' &&
    typeof p.baseImage === 'string' &&
    typeof p.baseImageWidth === 'number' &&
    typeof p.baseImageHeight === 'number' &&
    Array.isArray(p.layers)
  );
}
