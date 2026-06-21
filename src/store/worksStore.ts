import { create } from 'zustand';
import type { MemeWork, UserInfo, TextLayer } from '@/types';
import { generateId, loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import { useEditorStore } from '@/store/editorStore';
import { useCommunityStore } from '@/store/communityStore';

const defaultNicknames = ['快乐创作家', '表情包小能手', '创意无限', '脑洞王者', 'Meme达人'];
const defaultSeeds = ['apple', 'banana', 'cherry', 'dragon', 'mango'];

function createDefaultUser(): UserInfo {
  const idx = Math.floor(Math.random() * defaultNicknames.length);
  return {
    id: generateId(),
    nickname: defaultNicknames[idx],
    avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${defaultSeeds[idx]}${Date.now()}`,
  };
}

interface WorksStore {
  works: MemeWork[];
  user: UserInfo | null;
  initStore: () => void;
  saveWork: (data: {
    title: string;
    baseImage: string;
    baseImageWidth: number;
    baseImageHeight: number;
    layers: TextLayer[];
    thumbnail: string;
  }) => void;
  updateWork: (id: string, updates: Partial<MemeWork>) => void;
  deleteWork: (id: string) => void;
  publishWork: (id: string) => void;
  editWork: (id: string) => void;
}

export const useWorksStore = create<WorksStore>((set, get) => ({
  works: [],
  user: null,

  initStore: () => {
    const storedWorks = loadFromStorage<MemeWork[]>(STORAGE_KEYS.WORKS, []);
    const storedUser = loadFromStorage<UserInfo | null>(STORAGE_KEYS.USER, null);
    let user = storedUser;
    if (!user) {
      user = createDefaultUser();
      saveToStorage(STORAGE_KEYS.USER, user);
    }
    set({
      works: storedWorks,
      user,
    });
  },

  saveWork: (data) => {
    const { user } = get();
    if (!user) return;
    const now = Date.now();
    const newWork: MemeWork = {
      id: generateId(),
      title: data.title,
      baseImage: data.baseImage,
      baseImageWidth: data.baseImageWidth,
      baseImageHeight: data.baseImageHeight,
      layers: [...data.layers],
      thumbnail: data.thumbnail,
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      likes: 0,
      comments: [],
      author: user,
    };
    const newWorks = [newWork, ...get().works];
    saveToStorage(STORAGE_KEYS.WORKS, newWorks);
    set({ works: newWorks });
  },

  updateWork: (id, updates) => {
    const newWorks = get().works.map((work) =>
      work.id === id ? { ...work, ...updates, updatedAt: Date.now() } : work
    );
    saveToStorage(STORAGE_KEYS.WORKS, newWorks);
    set({ works: newWorks });
  },

  deleteWork: (id) => {
    const newWorks = get().works.filter((work) => work.id !== id);
    saveToStorage(STORAGE_KEYS.WORKS, newWorks);
    set({ works: newWorks });
  },

  publishWork: (id) => {
    const work = get().works.find((w) => w.id === id);
    if (!work) return;
    const newWork: MemeWork = { ...work, isPublic: true, updatedAt: Date.now() };
    const newWorks = get().works.map((w) => (w.id === id ? newWork : w));
    saveToStorage(STORAGE_KEYS.WORKS, newWorks);
    set({ works: newWorks });
    useCommunityStore.getState().addWork(newWork);
  },

  editWork: (id) => {
    const work = get().works.find((w) => w.id === id);
    if (!work) return;
    useEditorStore.getState().loadWork({
      baseImage: work.baseImage,
      baseImageWidth: work.baseImageWidth,
      baseImageHeight: work.baseImageHeight,
      layers: work.layers,
    });
  },
}));
