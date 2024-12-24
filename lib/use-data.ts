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

export const useDataStore: UseBoundStore<StoreApi<DataStore>> = create(
  // persist(
  subscribeWithSelector((set) => ({
    user: { id: '' },
    notes: [],
    directory: { id: '', label: '', created_at: '', tree: [] },
    todos: { id: '', user_id: '', list: [] },
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
    deleteNotes: (ids: string[]) =>
      set((state) => ({
        notes: state.notes.filter((n) => !ids.includes(n.id)),
      })),
    addNote: (note: Note) =>
      set((state) => ({
        notes: [...state.notes, note],
      })),
    updateDirectory: (tree: Tree) =>
      set((state) => ({
        directory: { ...state.directory, tree },
      })),
    updateTodos: (list: TodosList[]) =>
      set((state) => ({
        todos: { ...state.todos, list },
      })),
  }))
);

// const notesUnsub = useDataStore.subscribe(
//   (state) => state.notes,
//   //@ts-ignore

//   async (notes: Note[], previousNotes: Note[]) => {
//     // NOTE ADDED
//     if (notes.length > previousNotes.length) {
//       insertNote(note);
//       if (navigator.onLine) {
//         await client.from('notes').insert(note);
//       } else {
//         updateOfflineCache('notes', 'insert', note);
//       }
//       // NOTE DELETED
//     } else if (notes.length < previousNotes.length) {
//       const deletedNotes = previousNotes.filter((prevNote) =>
//         notes.every((n) => n.id !== prevNote.id)
//       );
//       const deletedIds = deletedNotes.map((n) => n.id);
//       deleteIdbNotes(deletedIds);
//       navigator.onLine
//         ? await client.from('notes').delete().in('id', deletedIds)
//         : updateOfflineCache('notes', 'delete', deletedIds);
//     } else {
//       // NOTE CHANGED
//       const foundNote = notes.find((c) => {
//         const found = previousNotes.find((p) => p.id === c.id);
//         if (found && found.content !== c.content) return c;
//       });
//       update('notes', foundNote);
//       if (navigator.onLine) {
//         //@ts-ignore - Need to remove fts before updating
//         const { fts, ...rest } = foundNote;
//         await client.from('notes').update(rest).eq('id', foundNote.id);
//       } else {
//         updateOfflineCache('notes', 'update', foundNote);
//       }
//     }
//   }
// );

// const dirUnsub = useDataStore.subscribe(
//   (state) => state.directory,
//   //@ts-ignore
//   async (directory: Directory, prevDirectory: Directory) => {
//     const diff =
//       directory.tree.length !== prevDirectory.tree.length ||
//       JSON.stringify(directory.tree) !== JSON.stringify(prevDirectory.tree);
//     if (diff) {
//       update('directories', directory);
//       if (navigator.onLine) {
//         await client
//           .from('directories')
//           .update({ tree: directory.tree })
//           .eq('id', directory.id);
//       } else {
//         updateOfflineCache('directories', 'update', directory);
//       }
//     }
//   }
// );

// const todosUnsub = useDataStore.subscribe(
//   (state) => state.todos,
//   //@ts-ignore
//   async (todos: Todos, previousTodos: Todos) => {
//     const diff =
//       todos.list.length !== previousTodos.list.length ||
//       JSON.stringify(todos.list) !== JSON.stringify(previousTodos.list);
//     if (diff) {
//       update('todos', todos);
//       navigator.onLine
//         ? await client
//             .from('todos')
//             .update({ list: todos.list })
//             .eq('id', todos.id)
//         : updateOfflineCache('todos', 'update', todos);
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
