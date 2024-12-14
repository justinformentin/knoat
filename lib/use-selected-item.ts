import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';

export type SelectedItem = {
  id: string;
  label: string;
  type?: 'note' | 'directory';
};
interface SelectedItemStore {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem) => void;
  clearSelectedItem: () => void;
}

export const selectedItemStore: UseBoundStore<StoreApi<SelectedItemStore>> =
  create(
    persist(
      (set) => ({
        selectedItem: null,
        setSelectedItem: (selectedItem: SelectedItem) => set({ selectedItem }),
        clearSelectedItem: () => set({ selectedItem: null }),
      }),
      { name: 'knoat-selected-item-2' }
    )
  );

export const useSelectedItemStore = selectedItemStore;
