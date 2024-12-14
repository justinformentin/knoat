import { Directory, Note, Tree } from '@/server/types';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
import { persist } from 'zustand/middleware';
import { Todos } from './database.types';

type User = { id: string };

type InitializeArgs = {
  user: User;
  notes: Note[];
  directory: Directory;
  todos: Todos;
};

interface DataStore {
  user: User;
  notes: Note[];
  directory: Directory;
  todos: Todos;
  setUser: (user: User) => void;
  setNotes: (notes: Note[]) => void;
  setTodos: (todos: Todos) => void;
  setDirectory: (directory: Directory) => void;
  initialize: (args: InitializeArgs) => void;
  updateNotes: (note: Note) => void;
  addNote: (note: Note) => void;
  updateDirectory: (tree: Tree) => void;
}

// const addResource = (path: string, listCopy: TreeViewDirectory) => {
//   console.log('ADD RESOURCE STARTING=============');
//   const findPath = (
//     paths: string[],
//     dir: TreeViewDirectory
//   ): GeneratedDir | undefined => {
//     const remainingPaths = [...paths];
//     const nextPath = remainingPaths.shift();

//     const foundDir = dir.find((item: any) => item.label === nextPath);
//     if (foundDir) {
//       return remainingPaths.length > 1 && foundDir.children
//         ? findPath(remainingPaths, foundDir.children)
//         : foundDir;
//     }
//   };

//   const pathSplit = path.split('/');
//   return findPath(pathSplit, listCopy);
// };

export const dataStore: UseBoundStore<StoreApi<DataStore>> = create(
  persist(
    (set) => ({
      user: { id: '' },
      notes: [],
      directory: { id: '', label: '', created_at: '', tree: [] },
      todos: [{ title: '', items: [] }],
      setUser: (user: { id: string }) => set({ user }),
      setNotes: (notes: Note[]) => set({ notes }),
      setDirectory: (directory: Directory) => set({ directory }),
      setTodos: (todos: Todos) => set({ todos }),
      initialize: ({ user, notes, directory, todos }: InitializeArgs) =>
        set({ user, notes, directory, todos }),
      updateNotes: (note: Note) =>
        set((state) => {
          const notes = state.notes?.length
            ? state.notes.filter((n) => n.id !== note.id)
            : [];
          return { notes: [...notes, note] };
        }),
      addNote: (note: Note) =>
        set((state) => {
          return {
            notes: [...state.notes, note],
            directory: {
              ...state.directory,
              tree: [
                ...state.directory.tree,
                {
                  id: note.id,
                  label: note.label,
                  created_at: note.created_at,
                  updated_at: note.updated_at,
                  type: 'note',
                },
              ],
            },
          };
        }),
      updateDirectory: (tree: Tree) =>
        set((state) => ({
          directory: { ...state.directory, tree },
        })),
    }),
    { name: 'knoat-state' }
  )
);

export const useDataStore = dataStore;
