import { create } from 'zustand';
import type { MemeWork, UserInfo, Comment, MemeProject, TextLayer } from '@/types';
import { MEME_PROJECT_VERSION, isMemeProject } from '@/types';
import { generateId, loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import { COMMUNITY_WORKS } from '@/utils/mockData';
import { useEditorStore } from '@/store/editorStore';

interface CommunityStore {
  works: MemeWork[];
  likedIds: string[];
  sortBy: 'latest' | 'hot';
  user: UserInfo | null;
  initStore: () => void;
  addWork: (work: MemeWork) => void;
  toggleLike: (id: string) => void;
  addComment: (workId: string, content: string) => void;
  setSortBy: (sort: 'latest' | 'hot') => void;
  useAsTemplate: (id: string) => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  works: [],
  likedIds: [],
  sortBy: 'latest',
  user: null,

  initStore: () => {
    const rawWorks = loadFromStorage<Array<Record<string, unknown>>>(STORAGE_KEYS.COMMUNITY, []);
    let storedWorks: MemeWork[];
    if (rawWorks.length === 0) {
      storedWorks = COMMUNITY_WORKS;
      saveToStorage(STORAGE_KEYS.COMMUNITY, storedWorks);
    } else {
      storedWorks = rawWorks.map((raw) => {
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
    }
    const storedLiked = loadFromStorage<string[]>(STORAGE_KEYS.LIKED, []);
    const storedUser = loadFromStorage<UserInfo | null>(STORAGE_KEYS.USER, null);
    set({
      works: storedWorks,
      likedIds: storedLiked,
      user: storedUser,
    });
  },

  addWork: (work) => {
    const existing = get().works.find((w) => w.id === work.id);
    let newWorks: MemeWork[];
    if (existing) {
      newWorks = get().works.map((w) => (w.id === work.id ? work : w));
    } else {
      newWorks = [work, ...get().works];
    }
    saveToStorage(STORAGE_KEYS.COMMUNITY, newWorks);
    set({ works: newWorks });
  },

  toggleLike: (id) => {
    const { likedIds, works } = get();
    const isLiked = likedIds.includes(id);
    let newLikedIds: string[];
    if (isLiked) {
      newLikedIds = likedIds.filter((wid) => wid !== id);
    } else {
      newLikedIds = [...likedIds, id];
    }
    const newWorks = works.map((w) =>
      w.id === id ? { ...w, likes: isLiked ? w.likes - 1 : w.likes + 1 } : w
    );
    saveToStorage(STORAGE_KEYS.LIKED, newLikedIds);
    saveToStorage(STORAGE_KEYS.COMMUNITY, newWorks);
    set({ likedIds: newLikedIds, works: newWorks });
  },

  addComment: (workId, content) => {
    const { user, works } = get();
    if (!user) return;
    const newComment: Comment = {
      id: generateId(),
      content,
      authorName: user.nickname,
      authorAvatar: user.avatar,
      createdAt: Date.now(),
      likes: 0,
    };
    const newWorks = works.map((w) =>
      w.id === workId ? { ...w, comments: [...w.comments, newComment] } : w
    );
    saveToStorage(STORAGE_KEYS.COMMUNITY, newWorks);
    set({ works: newWorks });
  },

  setSortBy: (sort) => set({ sortBy: sort }),

  useAsTemplate: (id) => {
    const work = get().works.find((w) => w.id === id);
    if (!work) return;
    useEditorStore.getState().loadProject(work.project);
  },
}));
