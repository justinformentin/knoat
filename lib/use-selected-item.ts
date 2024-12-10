import { Directory, Note } from '@/server/types';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';

interface SelectedItemStore {
  selectedItem: Note | Directory | null;
  setSelectedItem: (item: Note | Directory) => void;
  clearSelectedItem: () => void;
}

export const selectedItemStore: UseBoundStore<StoreApi<SelectedItemStore>> =
  create(
    persist(
      (set) => ({
        selectedItem: null,
        setSelectedItem: (selectedItem: Note | Directory) =>
          set({ selectedItem }),
        clearSelectedItem: () => set({ selectedItem: null }),
      }),
      { name: 'knoat-selected-item' }
    )
  );
  
export const useSelectedItemStore = selectedItemStore;
