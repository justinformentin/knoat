import {
  Directory,
  GeneratedDir,
  Note,
  TreeViewDirectory,
} from '@/server/types';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';
import { Todos } from './database.types';

interface DataStore {
  user: { id: string };
  notes: Note[];
  // directories: Directory[];
  treeView: TreeViewDirectory;
  todos: Todos;
  setUser: (user: { id: string }) => void;
  setNotes: (notes: Note[]) => void;
  // setDirectories: (directories: Directory[]) => void;
  setTodos: (todos: Todos) => void;
  setTreeView: (treeView: TreeViewDirectory) => void;
  updateNotes: (note: Note) => void;
  addNote: (note: Note) => void;
  addDirectory: (directory: Directory) => void;
  // addRootDirectory: (directory: Directory) => void;
}

const addResource = (path: string, listCopy: TreeViewDirectory) => {
  console.log('ADD RESOURCE STARTING=============');
  const findPath = (
    paths: string[],
    dir: TreeViewDirectory
  ): GeneratedDir | undefined => {
    const remainingPaths = [...paths];
    const nextPath = remainingPaths.shift();

    const foundDir = dir.find((item: any) => item.label === nextPath);
    if (foundDir) {
      return remainingPaths.length > 1 && foundDir.children
        ? findPath(remainingPaths, foundDir.children)
        : foundDir;
    }
  };

  const pathSplit = path.split('/');
  return findPath(pathSplit, listCopy);
};

export const dataStore: UseBoundStore<StoreApi<DataStore>> = create(
  persist(
    (set) => ({
      user: { id: '' },
      notes: [],
      // directories: [],
      treeView: [],
      todos: [{ title: '', items: [] }],
      setUser: (user: { id: string }) => set({ user }),
      setNotes: (notes: Note[]) => set({ notes }),
      // setDirectories: (directories: Directory[]) => set({ directories }),
      setTreeView: (treeView: TreeViewDirectory) => set({ treeView }),
      setTodos: (todos: Todos) => set({ todos }),
      updateNotes: (note: Note) =>
        set((state) => {
          const notes = state.notes?.length
            ? state.notes.filter((n) => n.id !== note.id)
            : [];
          return { notes: [...notes, note] };
        }),
      addNote: (note: Note) =>
        set((state) => {
          const treeViewCopy = [...state.treeView];
          const foundDir = addResource(note.full_path, treeViewCopy);
          console.log('ADDUNIG NOTE foundDir', foundDir);
          if (foundDir) {
            foundDir.children?.push(note);
            console.log('ADDING NOTE', treeViewCopy);
            return { notes: [...state.notes, note], treeView: treeViewCopy };
          } else {
            return {
              notes: [...state.notes, note],
              treeView: [...state.treeView, note],
            };
          }
        }),
      addDirectory: (directory: Directory) =>
        set((state) => {
          const treeViewCopy = [...state.treeView];
          const foundDir = addResource(directory.full_path, treeViewCopy);
          if (foundDir && foundDir.children) {
            //@ts-ignore
            foundDir.children.push({ ...directory, children: [] });
            return {
              treeView: treeViewCopy,
            };
          } else {
            return {
              treeView: [...state.treeView, { ...directory, children: [] }],
            };
          }
        }),
      // addRootDirectory: (directory: Directory) =>
      //   set((state) => ({
      //     // directories: [...state.directories, directory],
      //     treeView: [...state.treeView, { ...directory, children: [] }],
      //   })),
    }),
    { name: 'knoat-state' }
  )
);

export const useDataStore = dataStore;
