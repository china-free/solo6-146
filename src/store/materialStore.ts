import { create } from 'zustand';
import type { Category, MaterialImage } from '@/types';
import { generateId, loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import { DEFAULT_CATEGORIES, DEFAULT_TEMPLATES } from '@/utils/mockData';
import { useEditorStore } from '@/store/editorStore';

interface MaterialStore {
  categories: Category[];
  materials: MaterialImage[];
  selectedCategory: string;
  initStore: () => void;
  addCategory: (name: string, emoji: string) => void;
  deleteCategory: (id: string) => void;
  uploadMaterial: (file: File, categoryId: string) => Promise<void>;
  deleteMaterial: (id: string) => void;
  setSelectedCategory: (id: string) => void;
  useMaterial: (id: string) => void;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 600, height: 600 });
    img.src = url;
  });
}

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  categories: [],
  materials: [],
  selectedCategory: 'all',

  initStore: () => {
    const storedCategories = loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const storedMaterials = loadFromStorage<MaterialImage[]>(STORAGE_KEYS.MATERIALS, []);
    const systemCategories = DEFAULT_CATEGORIES.filter(
      (c) => !storedCategories.some((sc) => sc.id === c.id)
    );
    const systemTemplates = DEFAULT_TEMPLATES.filter(
      (t) => !storedMaterials.some((sm) => sm.name === t.name && sm.isSystem)
    );
    const allCategories = [...systemCategories, ...storedCategories];
    const allMaterials = [...systemTemplates, ...storedMaterials];
    set({
      categories: allCategories,
      materials: allMaterials,
    });
  },

  addCategory: (name, emoji) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      emoji,
      isSystem: false,
    };
    const newCategories = [...get().categories, newCategory];
    const userCategories = newCategories.filter((c) => !c.isSystem);
    saveToStorage(STORAGE_KEYS.CATEGORIES, userCategories);
    set({ categories: newCategories });
  },

  deleteCategory: (id) => {
    const target = get().categories.find((c) => c.id === id);
    if (!target || target.isSystem) return;
    const newCategories = get().categories.filter((c) => c.id !== id);
    const newMaterials = get().materials.filter((m) => m.category !== id);
    const userCategories = newCategories.filter((c) => !c.isSystem);
    const userMaterials = newMaterials.filter((m) => !m.isSystem);
    saveToStorage(STORAGE_KEYS.CATEGORIES, userCategories);
    saveToStorage(STORAGE_KEYS.MATERIALS, userMaterials);
    set({
      categories: newCategories,
      materials: newMaterials,
      selectedCategory: get().selectedCategory === id ? 'all' : get().selectedCategory,
    });
  },

  uploadMaterial: async (file, categoryId) => {
    const url = await readFileAsDataURL(file);
    const dims = await getImageDimensions(url);
    const newMaterial: MaterialImage = {
      id: generateId(),
      url,
      name: file.name.replace(/\.[^/.]+$/, ''),
      category: categoryId,
      width: dims.width,
      height: dims.height,
      createdAt: Date.now(),
      isSystem: false,
    };
    const newMaterials = [...get().materials, newMaterial];
    const userMaterials = newMaterials.filter((m) => !m.isSystem);
    saveToStorage(STORAGE_KEYS.MATERIALS, userMaterials);
    set({ materials: newMaterials });
  },

  deleteMaterial: (id) => {
    const target = get().materials.find((m) => m.id === id);
    if (!target || target.isSystem) return;
    const newMaterials = get().materials.filter((m) => m.id !== id);
    const userMaterials = newMaterials.filter((m) => !m.isSystem);
    saveToStorage(STORAGE_KEYS.MATERIALS, userMaterials);
    set({ materials: newMaterials });
  },

  setSelectedCategory: (id) => set({ selectedCategory: id }),

  useMaterial: (id) => {
    const material = get().materials.find((m) => m.id === id);
    if (material) {
      useEditorStore.getState().setBaseImage(material.url, material.width, material.height);
    }
  },
}));
