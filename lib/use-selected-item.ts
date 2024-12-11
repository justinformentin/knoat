import { TreeItem } from '@/server/types';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';

interface SelectedItemStore {
  selectedItem: TreeItem | null;
  setSelectedItem: (item: TreeItem) => void;
  clearSelectedItem: () => void;
}

export const selectedItemStore: UseBoundStore<StoreApi<SelectedItemStore>> =
  create(
    persist(
      (set) => ({
        selectedItem: null,
        setSelectedItem: (selectedItem: TreeItem) => set({ selectedItem }),
        clearSelectedItem: () => set({ selectedItem: null }),
      }),
      { name: 'knoat-selected-item' }
    )
  );

export const useSelectedItemStore = selectedItemStore;
