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

export interface MemeWork {
  id: string;
  title: string;
  baseImage: string;
  baseImageWidth: number;
  baseImageHeight: number;
  layers: TextLayer[];
  thumbnail: string;
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
