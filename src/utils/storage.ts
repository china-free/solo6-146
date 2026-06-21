export const STORAGE_KEYS = {
  USER: 'memecraft:user',
  MATERIALS: 'memecraft:materials',
  CATEGORIES: 'memecraft:categories',
  WORKS: 'memecraft:works',
  COMMUNITY: 'memecraft:community',
  LIKED: 'memecraft:liked',
} as const;

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    console.error(`Failed to load ${key} from localStorage`);
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage`, error);
  }
}
