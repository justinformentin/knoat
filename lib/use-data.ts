import { Directory, Note, Tree } from '@/server/types';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand/';
// import { persist } from 'zustand/middleware';
import { Todos, TodosList } from './database.types';
// import { getAllIndexDbData } from './idb';
import { subscribeWithSelector } from 'zustand/middleware';
// import { update, insertNote, deleteIdbNotes, syncDbToIdb, getAllIndexDbData } from './idb';

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
  deleteNotes: (ids: string[]) => void;
  addNote: (note: Note) => void;
  updateDirectory: (tree: Tree) => void;
  updateTodos: (list: TodosList[]) => void;
}

const DB_NAME = 'knoat-db';
const OBJECT_STORE_NAME = 'knoat-store';
const VERSION = 1;

export const useDataStore: UseBoundStore<StoreApi<DataStore>> = create(
  // persist(
  subscribeWithSelector(
    (set) => ({
      user: { id: '' },
      notes: [],
      directory: { id: '', label: '', created_at: '', tree: [] },
      todos: { id: '', list: [] },
      setUser: (user: { id: string }) => set({ user }),
      setNotes: (notes: Note[]) => set({ notes }),
      setDirectory: (directory: Directory) => set({ directory }),
      setTodos: (todos: Todos) => set({ todos }),
      initialize: ({ user, notes, directory, todos }: InitializeArgs) => {
        console.log('initialize', {user, directory, todos})
        return set({ user, notes, directory, todos })
      },
      updateNotes: (note: Note) =>
        set((state) => {
          const notes = state.notes?.length
            ? state.notes.filter((n) => n.id !== note.id)
            : [];
          return { notes: [...notes, note] };
        }),
      deleteNotes: (ids: string[]) =>
        set((state) => ({
          notes: state.notes.filter((n) => !ids.includes(n.id)),
        })),
      addNote: (note: Note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),
      // addNote: (note: Note) =>
      //   set((state) => {
      //     return {
      //       notes: [...state.notes, note],
      //       directory: {
      //         ...state.directory,
      //         tree: [
      //           ...state.directory.tree,
      //           {
      //             id: note.id,
      //             label: note.label,
      //             created_at: note.created_at,
      //             updated_at: note.updated_at,
      //             type: 'note',
      //           },
      //         ],
      //       },
      //     };
      //   }),
      updateDirectory: (tree: Tree) =>
        set((state) => ({
          directory: { ...state.directory, tree },
        })),
      updateTodos: (list: TodosList[]) =>
        set((state) => ({
          todos: { ...state.todos, list },
        })),
    })
    // { name: 'knoat-state' }
  )
);
// );

// Initializing the store from IndexedDb
// async function hydrate() {
//   if (!globalThis.indexedDB) return;

//   const indexedDBData = await getAllIndexDbData();

//   useDataStore.setState((state) => ({
//     notes: indexedDBData.notes,
//     directory: indexedDBData.directory,
//     todos: indexedDBData.todos,
//   }));
// }
// hydrate();

// const notesUnsub = useDataStore.subscribe(
//   (state) => state.notes,
//   (notes, previousNotes) => console.log({ notes, previousNotes })
// );
// const dirUnsub = useDataStore.subscribe(
//   (state) => state.directory,
//   //@ts-ignore
//   async (directory, prevDirectory) => {
//     const diff = directory.tree.length !== prevDirectory.tree.length || JSON.stringify(directory.tree) !== JSON.stringify(prevDirectory.tree)
//     if(diff){
//       update('directories', directory);
//       if (navigator.onLine) {
//         // We need to remove the user id
//         await client.from('directories').update({tree: directory.tree}).eq('id', directory.id);
//       } else {
//         updateOfflineCache('directories', 'update', data);
//       }
//     }
//   }
// );
// useDataStore.subscribe(async (state, prevState) => {
//   const stateKeys = Object.keys(state);
//   const prevStateKeys = Object.keys(prevState);
//   console.log('STORE SUB');
//   console.log('state', state);
//   console.log('prevState', prevState);
//   console.log('stateKeys', stateKeys);
//   console.log('prevStateKeys', prevStateKeys);
  // Do not run for hydration.
  // if (prevStateKeys.length === 0) return;

  // Find newly added or changed items.
  // for (let i = 0; i < stateKeys.length; ++i) {
  //   const key = stateKeys[i];
  //   const value = state[key];
  //   // New item
  //   if (!prevStateKeys.includes(key)) {
  //     await addDataToIndexedDB(value);
  //     break;
  //   }
  //   // Changed item
  //   const prevValue = prevState[key];
  //   if (JSON.stringify(value) !== JSON.stringify(prevValue)) {
  //     await editDataFromIndexedDB(value);
  //     break;
  //   }
  // }
// });
// export const useDataStore = dataStore;
