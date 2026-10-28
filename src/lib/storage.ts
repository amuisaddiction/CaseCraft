import { openDB } from 'idb';
import type { ConsumerCase } from '../types/case';

const DB_NAME = 'haq-local';
const STORE_NAME = 'cases';

async function database() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveCase(consumerCase: ConsumerCase): Promise<void> {
  const db = await database();
  await db.put(STORE_NAME, consumerCase);
}

export async function getCase(id: string): Promise<ConsumerCase | undefined> {
  const db = await database();
  return db.get(STORE_NAME, id);
}

export async function deleteCase(id: string): Promise<void> {
  const db = await database();
  await db.delete(STORE_NAME, id);
}
