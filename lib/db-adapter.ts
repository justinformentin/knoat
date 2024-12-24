import { browserClient } from '@/utils/supabase/client';
import { useDataStore } from './use-data';
import {
  update,
  insertNote,
  deleteIdbNotes,
  syncDbToIdb,
  getAllIndexDbData,
} from './idb';
import { Directory, Note, Tree, TreeItem } from '@/server/types';
import { Todos } from './database.types';
import { useOfflineCache } from './offline-cache';

export const useUpdateDirectory = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const updateStoreDirectory = useDataStore((state) => state.updateDirectory);
  const directory = useDataStore((state) => state.directory);

  return async ({ tree, treeItem }: { tree?: Tree; treeItem?: TreeItem }) => {
    if (!tree && !treeItem) return;

    const newTree =
      tree && tree.length ? tree : treeItem! && [...directory.tree, treeItem];
    updateStoreDirectory(newTree);
    update('directories', { ...directory, tree: newTree });
    if (navigator.onLine) {
      await client
        .from('directories')
        .update({ tree: newTree })
        .eq('id', directory.id);
    } else {
      updateOfflineCache('directories', 'update', {
        id: directory.id,
        tree: newTree,
      });
    }
  };
};

export const useUpdateTodos = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const updateStoreTodos = useDataStore((state) => state.updateTodos);

  return async (data: Todos) => {
    updateStoreTodos(data.list);
    update('todos', data);
    if (navigator.onLine) {
      await client.from('todos').update({ list: data.list }).eq('id', data.id);
    } else {
      updateOfflineCache('todos', 'update', data);
    }
  };
};
export const useAddNote = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const addStoreNote = useDataStore((state) => state.addNote);

  return async (note: Note) => {
    addStoreNote(note);
    insertNote(note);
    if (navigator.onLine) {
      await client.from('notes').insert(note);
    } else {
      updateOfflineCache('notes', 'insert', note);
    }
  };
};

export const useUpdateNote = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const updateStoreNote = useDataStore((state) => state.updateNotes);

  return async (note: Note) => {
    updateStoreNote(note);
    update('notes', note);
    if (navigator.onLine) {
      //@ts-ignore - Need to remove fts before updating
      const { fts, ...rest } = note;
      await client.from('notes').update(rest).eq('id', note.id);
    } else {
      updateOfflineCache('notes', 'update', note);
    }
  };
};

export const useDeleteNote = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const deleteStoreNotes = useDataStore((state) => state.deleteNotes);

  return async (ids: string[]) => {
    deleteStoreNotes(ids);
    deleteIdbNotes(ids);
    navigator.onLine
      ? await client.from('notes').delete().in('id', ids)
      : updateOfflineCache('notes', 'delete', ids);
  };
};

export const useDbAdapter = () => {
  const initialize = useDataStore((state) => state.initialize);

  const syncFromDb = (d: {
    id: string;
    notes: Note[];
    directories: Directory;
    todos: Todos;
  }) => {
    // Initializing IndexedDb and Store from our DB data
    const data = {
      user: { id: d.id },
      notes: d.notes,
      directory: d.directories,
      todos: d.todos,
    };
    initialize(data);
    syncDbToIdb(data);
  };

  const syncFromIdb = async (userId?: string) => {
    // If we are offline and we load the page, we won't load data from the server
    // So we need to get the saved data from indexeddb if it exists
    const indexedDBData = await getAllIndexDbData(userId);
    if (indexedDBData) {
      initialize(indexedDBData);
      return indexedDBData.user;
    }
    return null;
  };

  return {
    syncFromDb,
    syncFromIdb,
  };
};

// export const useDataStoreSubs = () => {
//   const client = browserClient();

//   const { updateOfflineCache } = useOfflineCache();

//   const notesUnsub = useDataStore.subscribe(
//     (state) => state.notes,
//     //@ts-ignore

//     async (notes: Note[], previousNotes: Note[]) => {
//       // NOTE ADDED
//       if (notes.length > previousNotes.length) {
//         const addedNote = notes.filter((prevNote) =>
//           previousNotes.every((n) => n.id !== prevNote.id)
//         )[0];
//         console.log('note added', addedNote);

//         insertNote(addedNote);
//         if (navigator.onLine) {
//           await client.from('notes').insert(addedNote);
//         } else {
//           updateOfflineCache('notes', 'insert', addedNote);
//         }
//         // NOTE DELETED
//       } else if (notes.length < previousNotes.length) {
//         const deletedNotes = previousNotes.filter((prevNote) =>
//           notes.every((n) => n.id !== prevNote.id)
//         );
//         const deletedIds = deletedNotes.map((n) => n.id);
//         deleteIdbNotes(deletedIds);
//         navigator.onLine
//           ? await client.from('notes').delete().in('id', deletedIds)
//           : updateOfflineCache('notes', 'delete', deletedIds);
//       } else {
//         // NOTE CHANGED
//         const foundNote = notes.find((c) => {
//           const found = previousNotes.find((p) => p.id === c.id);
//           if (found && found.content !== c.content) return c;
//         });
//         console.log('note updated', foundNote);

//         if (!foundNote) return;
//         update('notes', foundNote);
//         if (navigator.onLine) {
//           //@ts-ignore - Need to remove fts before updating
//           const { fts, ...rest } = foundNote;
//           await client.from('notes').update(rest).eq('id', foundNote.id);
//         } else {
//           updateOfflineCache('notes', 'update', foundNote);
//         }
//       }
//     }
//   );

//   const dirUnsub = useDataStore.subscribe(
//     (state) => state.directory,
//     //@ts-ignore
//     async (directory: Directory, prevDirectory: Directory) => {
//       console.log('directory updated');
//       const diff =
//         directory.tree.length !== prevDirectory.tree.length ||
//         JSON.stringify(directory.tree) !== JSON.stringify(prevDirectory.tree);
//       if (diff) {
//         console.log('directory diff');
//         update('directories', directory);
//         if (navigator.onLine) {
//           await client
//             .from('directories')
//             .update({ tree: directory.tree })
//             .eq('id', directory.id);
//         } else {
//           updateOfflineCache('directories', 'update', directory);
//         }
//       }
//     }
//   );

//   const todosUnsub = useDataStore.subscribe(
//     (state) => state.todos,
//     //@ts-ignore
//     async (todos: Todos, previousTodos: Todos) => {
//       const diff =
//         todos.list.length !== previousTodos.list.length ||
//         JSON.stringify(todos.list) !== JSON.stringify(previousTodos.list);
//       if (diff) {
//         update('todos', todos);
//         navigator.onLine
//           ? await client
//               .from('todos')
//               .update({ list: todos.list })
//               .eq('id', todos.id)
//           : updateOfflineCache('todos', 'update', todos);
//       }
//     }
//   );
// };
