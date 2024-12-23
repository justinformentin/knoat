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

  return async ({tree, treeItem}: {tree?: Tree, treeItem?: TreeItem}) => {
    if(!tree && !treeItem) return;
    console.log('UPDATE DIRECTORY', {tree, treeItem});

    const newTree = tree && tree.length ? tree : treeItem! && [...directory.tree, treeItem]
    updateStoreDirectory(newTree);
    // we only need the user id for indexeddb for the index select
    update('directories', { ...directory, tree: newTree });
    if (navigator.onLine) {
      await client.from('directories').update({tree: newTree}).eq('id', directory.id);
    } else {
      updateOfflineCache('directories', 'update', {id: directory.id, tree: newTree});
    }
  };
};

export const useUpdateTodos = () => {
  const client = browserClient();
  const user = useDataStore((state) => state.user);
  const { updateOfflineCache } = useOfflineCache();
  const updateStoreTodos = useDataStore((state) => state.updateTodos);

  return async (data: Todos) => {
    updateStoreTodos(data.list);
    update('todos', {...data, user_id: user.id});
    if (navigator.onLine) {
      await client.from('todos').update({ list: data.list }).eq('id', data.id);
    } else {
      updateOfflineCache('todos', 'update', data);
    }
  };
};
export const useAddNote = () => {
  const client = browserClient();
  const user = useDataStore((state) => state.user);
  const { updateOfflineCache } = useOfflineCache();
  const addStoreNote = useDataStore((state) => state.addNote);

  return async (note: Note) => {
    addStoreNote(note);
    insertNote({...note, user_id: user.id});
    if (navigator.onLine) {
      await client.from('notes').insert(note);
    } else {
      updateOfflineCache('notes', 'insert', note);
    }
  };
}

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
}

export const useDeleteNote = () => {
  const client = browserClient();
  const { updateOfflineCache } = useOfflineCache();
  const deleteStoreNotes = useDataStore((state) => state.deleteNotes);

  return async (ids: string[]) => {
    deleteStoreNotes(ids);
    deleteIdbNotes(ids);
    if (navigator.onLine) {
      await client.from('notes').delete().in('id', ids);
    } else {
      updateOfflineCache('notes', 'delete', ids);
    }
  };
}

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
    console.log('sync from db', d);
    initialize(data);
    syncDbToIdb(data);
  };

  const syncFromIdb = async () => {
    // If we are offline and we load the page, we won't load data from the server
    // So we need to get the saved data from indexeddb if it exists
    const indexedDBData = await getAllIndexDbData();
    if (indexedDBData) initialize(indexedDBData);
  };
  return {
    syncFromDb,
    syncFromIdb,
  };
};
