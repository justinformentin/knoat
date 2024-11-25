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
        // dirStore.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        //@ts-ignore
        // noteStore.createIndex('user_id', 'user_id');
      }
    },
  });
  return dbPromise;
}

const indexDbBase = async () => {
  const db = await createStoresInDB();

  const getOne = async (tableName: Tables, query: string) => {
    const one = await db.get(tableName, query);
    // console.log('one', one);
    return one;
  };
  const getAll = async (tableName: Tables, query?: string) => {
    const all = await db.getAll(tableName);
    // const all = await db.getAllFromIndex('directories', 'user_id');
    return all;
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

  const sync = async (
    directories: Directory[],
    notes: Note[],
    user: { id: string }
  ) => {
    const promises: Promise<string>[] = [];
    const addOrUpdate = async (
      tableName: Tables,
      resource: Directory | Note
    ) => {
      const res = await getOne(tableName, resource.id);
      return res
        ? await db.put(tableName, resource)
        : await db.add(tableName, resource);
    };
    directories.forEach((directory) => {
      promises.push(addOrUpdate('directories', directory));
    });
    notes.forEach((notes) => {
      promises.push(addOrUpdate('notes', notes));
    });

    return Promise.all(promises);
  };

  const desync = () => {
    // const notes = getAll('note')
  };

  return { getOne, getAll, update, insert, sync, desync };
};

export const indexDb = indexDbBase();
