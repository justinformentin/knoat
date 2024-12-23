import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';
import { Directory, Note, Tables } from '@/server/types';
import { Todos } from './database.types';

type OfflineCacheValue = {
  tableName: Tables;
  action: 'insert' | 'update' | 'delete';
  data: Note | Directory | Todos | string[];
};

interface OfflineCacheStore {
  offlineCache: Record<string, OfflineCacheValue>;
}

export const useOfflineCacheStore: UseBoundStore<StoreApi<OfflineCacheStore>> =
  create(
    persist(
      (set) => ({
        offlineCache: {},
      }),
      { name: 'knoat-offline-cache' }
    )
  );

export const setStore = useOfflineCacheStore.setState;
