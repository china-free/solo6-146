import { create } from 'zustand';
import type { EditorState, TextLayer } from '@/types';
import { generateId } from '@/utils/storage';

interface EditorStore extends EditorState {
  initStore: () => void;
  setBaseImage: (url: string, w: number, h: number) => void;
  addLayer: () => void;
  updateLayer: (id: string, updates: Partial<TextLayer>) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  setCanvasScale: (scale: number) => void;
  clearAll: () => void;
  loadWork: (work: {
    baseImage: string;
    baseImageWidth: number;
    baseImageHeight: number;
    layers: TextLayer[];
  }) => void;
}

const DEFAULT_STATE: EditorState = {
  baseImage: null,
  baseImageWidth: 600,
  baseImageHeight: 600,
  layers: [],
  selectedLayerId: null,
  canvasScale: 1,
  canvasOffsetX: 0,
  canvasOffsetY: 0,
};

let initialized = false;

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...DEFAULT_STATE,

  initStore: () => {
    if (!initialized) {
      initialized = true;
    }
  },

  setBaseImage: (url, w, h) =>
    set({
      baseImage: url,
      baseImageWidth: w,
      baseImageHeight: h,
    }),

  addLayer: () => {
    const { baseImageWidth, baseImageHeight, layers } = get();
    const newLayer: TextLayer = {
      id: generateId(),
      content: '双击编辑文字',
      x: baseImageWidth / 2,
      y: baseImageHeight / 2,
      fontSize: 40,
      fontFamily: 'ZCOOL KuaiLe, sans-serif',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      bold: true,
      italic: false,
      align: 'center',
      rotation: 0,
      opacity: 1,
      zIndex: layers.length,
    };
    set({
      layers: [...layers, newLayer],
      selectedLayerId: newLayer.id,
    });
  },

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  deleteLayer: (id) => {
    const { selectedLayerId } = get();
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      selectedLayerId: selectedLayerId === id ? null : selectedLayerId,
    }));
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  moveLayerUp: (id) =>
    set((state) => {
      const { layers } = state;
      const idx = layers.findIndex((l) => l.id === id);
      if (idx === -1 || idx >= layers.length - 1) return state;
      const newLayers = [...layers];
      [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
      return {
        layers: newLayers.map((l, i) => ({ ...l, zIndex: i })),
      };
    }),

  moveLayerDown: (id) =>
    set((state) => {
      const { layers } = state;
      const idx = layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const newLayers = [...layers];
      [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
      return {
        layers: newLayers.map((l, i) => ({ ...l, zIndex: i })),
      };
    }),

  setCanvasScale: (scale) => set({ canvasScale: Math.max(0.2, Math.min(3, scale)) }),

  clearAll: () =>
    set({
      baseImage: null,
      baseImageWidth: 600,
      baseImageHeight: 600,
      layers: [],
      selectedLayerId: null,
      canvasScale: 1,
      canvasOffsetX: 0,
      canvasOffsetY: 0,
    }),

  loadWork: (work) =>
    set({
      baseImage: work.baseImage,
      baseImageWidth: work.baseImageWidth,
      baseImageHeight: work.baseImageHeight,
      layers: [...work.layers],
      selectedLayerId: null,
    }),
}));
