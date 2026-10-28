import { openDB, type IDBPDatabase } from 'idb';
import type { ConsumerCase } from '../types/case';

const DB_NAME = 'haq-local';
const STORE_NAME = 'cases';
const ACTIVE_CASE_KEY = 'haq_active_case_id';
const LOCALSTORAGE_BACKUP_KEY = 'haq_fallback_cases';

let dbPromise: Promise<IDBPDatabase> | null = null;

function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

async function getDatabase(): Promise<IDBPDatabase | null> {
  if (!isIndexedDBAvailable()) return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    }).catch(() => null as unknown as IDBPDatabase);
  }
  return dbPromise;
}

// Fallback localStorage implementation for incognito / restricted contexts
function getLocalStorageCases(): Record<string, ConsumerCase> {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalStorageCase(c: ConsumerCase): void {
  try {
    const cases = getLocalStorageCases();
    cases[c.id] = c;
    localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(cases));
  } catch (err) {
    console.warn('Failed to save to localStorage fallback:', err);
  }
}

function deleteLocalStorageCase(id: string): void {
  try {
    const cases = getLocalStorageCases();
    delete cases[id];
    localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(cases));
  } catch (err) {
    console.warn('Failed to delete from localStorage fallback:', err);
  }
}

export async function saveCase(consumerCase: ConsumerCase): Promise<void> {
  try {
    const db = await getDatabase();
    if (db) {
      await db.put(STORE_NAME, consumerCase);
    } else {
      saveLocalStorageCase(consumerCase);
    }
    // Also track active case ID
    try {
      localStorage.setItem(ACTIVE_CASE_KEY, consumerCase.id);
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('Error saving case to primary store, attempting fallback:', err);
    saveLocalStorageCase(consumerCase);
  }
}

export async function getCase(id: string): Promise<ConsumerCase | undefined> {
  try {
    const db = await getDatabase();
    if (db) {
      const result = await db.get(STORE_NAME, id);
      if (result) return result;
    }
    return getLocalStorageCases()[id];
  } catch {
    return getLocalStorageCases()[id];
  }
}

export async function getActiveCase(): Promise<ConsumerCase | undefined> {
  try {
    const activeId = localStorage.getItem(ACTIVE_CASE_KEY);
    if (activeId) {
      const c = await getCase(activeId);
      if (c) return c;
    }
    // Otherwise look up first case in fallback
    const all = Object.values(getLocalStorageCases());
    return all[0];
  } catch {
    return undefined;
  }
}

export async function deleteCase(id: string): Promise<void> {
  try {
    const db = await getDatabase();
    if (db) {
      await db.delete(STORE_NAME, id);
    }
    deleteLocalStorageCase(id);
    const activeId = localStorage.getItem(ACTIVE_CASE_KEY);
    if (activeId === id) {
      localStorage.removeItem(ACTIVE_CASE_KEY);
    }
  } catch (err) {
    console.warn('Error deleting case:', err);
  }
}

export async function clearAllCases(): Promise<void> {
  try {
    const db = await getDatabase();
    if (db) {
      await db.clear(STORE_NAME);
    }
    localStorage.removeItem(LOCALSTORAGE_BACKUP_KEY);
    localStorage.removeItem(ACTIVE_CASE_KEY);
  } catch (err) {
    console.warn('Error clearing cases:', err);
  }
}
