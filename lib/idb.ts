import { Directory, Note, Tables } from '@/server/types';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Todos } from './database.types';

interface KnoatDB extends DBSchema {
  current_user: {
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
  todos: {
    value: Todos;
    key: string;
  };
}

let db: IDBPDatabase<KnoatDB>;

async function initDb() {
  return await openDB<KnoatDB>('knoat-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('current_user')) {
        db.createObjectStore('current_user', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('directories')) {
        const dirStore = db.createObjectStore('directories', { keyPath: 'id' });
        //@ts-ignore
        dirStore.createIndex('user_id', 'user_id');
      }
      if (!db.objectStoreNames.contains('todos')) {
        const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
        //@ts-ignore
        todoStore.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        //@ts-ignore
        noteStore.createIndex('user_id', 'user_id');
        //   noteStore.createIndex('user_note', ['user_id', 'full_path']);
      }
    },
  });
}
async function openIndexedDb() {
  if (db) {
    return db;
  } else {
    db = await initDb();
    return db;
  }
}

const getCurrentUser = async (userId?: string) => {
  // Need multiple try catches in case the db keys dont exist
  // Need to figure out how to get around the idb lib's error throwing
  if (userId) {
    try {
      const user = await db?.get('current_user', userId);
      if (user) {
        return user;
      } else {
        await db?.add('current_user', { id: userId });
        return { id: userId };
      }
    } catch (error) {
      await db?.add('current_user', { id: userId });
      return { id: userId };
    }
  } else {
    const users = await db?.getAll('current_user');
    return users[0];
  }
};
export const getAllIndexDbData = async (userId?: string) => {
  const db = await openIndexedDb();
  const user = await getCurrentUser(userId);
  if (!user?.id) return null;
  //@ts-ignore
  const notes = await db?.getAllFromIndex('notes', 'user_id', user.id);
  //@ts-ignore
  const directory = await db?.getFromIndex('directories', 'user_id', user.id);
  //@ts-ignore
  const todos = await db?.getFromIndex('todos', 'user_id', user.id);
  return { user, notes, directory: directory!, todos: todos! };
};

export const insertNote = (data: KnoatDB['notes']['value']) =>
  db?.add('notes', data);

export const update = (tableName: Tables, data: KnoatDB[Tables]['value']) =>
  db?.put(tableName, data);

export const deleteIdbNotes = (ids: string[]) =>
  Promise.all([...ids.map((id) => db.delete('notes', id))]);

let lockUpdate = false;
export const syncDbToIdb = async ({
  directory,
  todos,
  notes,
  user,
}: {
  directory: Directory;
  todos: Todos;
  notes: Note[];
  user: { id: string };
}) => {
  if (!lockUpdate) {
    const db = await openIndexedDb();

    lockUpdate = true;
    const addOrUpdate = async (
      tableName: Tables,
      resource: Directory | Note | Todos | { id: string }
    ) => {
      const res = await db?.get(tableName, resource.id);
      return res
        ? await db?.put(tableName, resource)
        : await db?.add(tableName, resource);
    };

    const all = await Promise.all([
      addOrUpdate('current_user', user),
      addOrUpdate('todos', todos),
      addOrUpdate('directories', directory),
      ...notes.map((note) => addOrUpdate('notes', note)),
    ]);

    lockUpdate = false;
    return all;
  }
};
