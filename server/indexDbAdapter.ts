import { openDB, DBSchema } from 'idb';
import { Directory, Note, Tables } from './types';

interface KnoatDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
    };
  };
  directories: {
    value: Directory;
    key: string;
  };
  notes: {
    value: Note;
    key: string;
  };
}

async function createStoresInDB() {
  const dbPromise = await openDB<KnoatDB>('knoat-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('directories')) {
        const dirStore = db.createObjectStore('directories', { keyPath: 'id' });
        //@ts-ignore
        dirStore.createIndex('user_id', 'user_id');
        // dirStore.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        //@ts-ignore
        noteStore.createIndex('user_id', 'user_id');
        //@ts-ignore
        noteStore.createIndex('user_note', ['user_id', 'full_path']);
      }
    },
  });
  return dbPromise;
}

const indexDbBase = async () => {

  if(typeof indexedDB === 'undefined')return;
  const db = await createStoresInDB();

  const getOneUserNote = async (userId: string, fullPath: string) => {
    const store = db.transaction('notes').objectStore('notes');
    //@ts-ignore
    const index = store.index('user_note');
    console.log('getOneNote index', index);
    const note = index.get(IDBKeyRange.only([userId, fullPath]));
    console.log('getOneNote note', note);
    return note;
  };
  const getAllUserNotes = async (userId: string) => {
    //@ts-ignore
    const notes = await db.getAllFromIndex('notes', 'user_id', userId);
    console.log('getallUserNote', notes);
    return notes;
  };

  const getAllUserDirectories = async (userId: string) => {
    //@ts-ignore
    const dirs = await db.getAllFromIndex('directories', 'user_id', userId);
    console.log('getallUserDirs', dirs);
    return dirs;
  };

  const insertNote = async (data: KnoatDB['notes']['value']) => {
    const insertedNote = await db.add('notes', data);
    console.log('insertedNote', insertedNote);
    return insertedNote;
  };

  const update = async (tableName: Tables, data: KnoatDB[Tables]['value']) => {
    const updated = await db.put(tableName, data);
    console.log('updated', updated);
    return updated;
  };

  const insert = async (tableName: Tables, data: KnoatDB[Tables]['value']) => {
    const inserted = await db.add(tableName, data);
    console.log('inserted', inserted);
    return data;
  };

  let lockUpdate = false;
  const syncToIdb = async (
    directories: Directory[],
    notes: Note[],
    user: { id: string }
  ) => {
    if (!lockUpdate) {
      lockUpdate = true;
      const addOrUpdate = async (
        tableName: Tables,
        resource: Directory | Note | { id: string }
      ) => {
        const res = await db.get(tableName, resource.id);
        console.log('sync to db res', res);
        return res
          ? await db.put(tableName, resource)
          : await db.add(tableName, resource);
      };
      const promises: Promise<string>[] = [addOrUpdate('users', user)];

      directories.forEach((directory) => {
        promises.push(addOrUpdate('directories', directory));
      });
      notes.forEach((notes) => {
        promises.push(addOrUpdate('notes', notes));
      });

      const all = await Promise.all(promises);
      lockUpdate = false;
      return all;
    }
  };

  const desync = () => {
    // const notes = getAll('note')
  };

  return {
    update,
    insert,
    syncToIdb,
    desync,
    getOneUserNote,
    getAllUserNotes,
    getAllUserDirectories,
    insertNote,
  };
};

export const indexDb = indexDbBase();
