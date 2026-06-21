import { create } from 'zustand';
import type { MemeWork, UserInfo, MemeProject, TextLayer } from '@/types';
import { MEME_PROJECT_VERSION, isMemeProject } from '@/types';
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

type SaveWorkData =
  | { title: string; thumbnail: string; project: MemeProject }
  | {
      title: string;
      thumbnail: string;
      baseImage: string;
      baseImageWidth: number;
      baseImageHeight: number;
      layers: TextLayer[];
    };

interface WorksStore {
  works: MemeWork[];
  user: UserInfo | null;
  initStore: () => void;
  saveWork: (data: SaveWorkData) => void;
  updateWork: (id: string, updates: Partial<MemeWork>) => void;
  deleteWork: (id: string) => void;
  publishWork: (id: string) => void;
  editWork: (id: string) => void;
}

export const useWorksStore = create<WorksStore>((set, get) => ({
  works: [],
  user: null,

  initStore: () => {
    const rawWorks = loadFromStorage<Array<Record<string, unknown>>>(STORAGE_KEYS.WORKS, []);
    const storedUser = loadFromStorage<UserInfo | null>(STORAGE_KEYS.USER, null);
    let user = storedUser;
    if (!user) {
      user = createDefaultUser();
      saveToStorage(STORAGE_KEYS.USER, user);
    }

    const storedWorks = rawWorks.map((raw) => {
      if ('project' in raw && isMemeProject(raw.project)) {
        return raw as unknown as MemeWork;
      }
      const work = raw as Record<string, unknown>;
      return {
        id: work.id,
        title: work.title,
        thumbnail: work.thumbnail,
        project: {
          version: MEME_PROJECT_VERSION,
          baseImage: (work.baseImage as string) ?? '',
          baseImageWidth: (work.baseImageWidth as number) ?? 600,
          baseImageHeight: (work.baseImageHeight as number) ?? 600,
          layers: (work.layers as TextLayer[]) ?? [],
        },
        createdAt: work.createdAt,
        updatedAt: work.updatedAt,
        isPublic: work.isPublic,
        likes: work.likes,
        comments: work.comments,
        author: work.author,
      } as MemeWork;
    });

    set({
      works: storedWorks,
      user,
    });
  },

  saveWork: (data) => {
    const { user } = get();
    if (!user) return;
    const now = Date.now();

    let project: MemeProject;
    if ('project' in data && isMemeProject(data.project)) {
      project = { ...data.project, layers: [...data.project.layers] };
    } else {
      project = {
        version: MEME_PROJECT_VERSION,
        baseImage: (data as { baseImage: string }).baseImage,
        baseImageWidth: (data as { baseImageWidth: number }).baseImageWidth,
        baseImageHeight: (data as { baseImageHeight: number }).baseImageHeight,
        layers: [...(data as { layers: TextLayer[] }).layers],
      };
    }

    const newWork: MemeWork = {
      id: generateId(),
      title: data.title,
      thumbnail: data.thumbnail,
      project,
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
    useEditorStore.getState().loadProject(work.project);
  },
}));
