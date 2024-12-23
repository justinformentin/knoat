import { Directory, Note, Tables } from '@/server/types';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Todos } from './database.types';

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
  todos: {
    value: Todos;
    key: string;
  };
}

let db: IDBPDatabase<KnoatDB>;

async function initDb() {
  return await openDB<KnoatDB>('knoat-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
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

export const getAllIndexDbData = async () => {
  const db = await openIndexedDb();
  const userId = localStorage.getItem('knoat-user-id');
  if(!userId) return null;
  //@ts-ignore
  const notes = await db?.getAllFromIndex('notes', 'user_id', userId);
  //@ts-ignore
  const directory = await db?.getFromIndex('directories', 'user_id', userId);
  //@ts-ignore
  const todos = await db?.getFromIndex('todos', 'user_id', userId);
  return { user: {id: userId}, notes, directory: directory!, todos: todos! };
};

export const insertNote = async (data: KnoatDB['notes']['value']) => {
  const insertedNote = await db?.add('notes', data);
  console.log('insertedNote', insertedNote);
  return insertedNote;
};

export const update = async (
  tableName: Tables,
  data: KnoatDB[Tables]['value']
) => {
  const updated = await db?.put(tableName, data);
  console.log('updated', updated);
  return updated;
};

export const deleteIdbNotes = async (ids: string[]) => {
  const all = await Promise.all([...ids.map((id) => db.delete('notes', id))]);
  console.log('delete notes all', all);
  return all;
};

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
      console.log('sync to db res', res);
      return res
        ? await db?.put(tableName, resource)
        : await db?.add(tableName, resource);
    };

    console.log('SYNCING TO DB', {user, directory, notes})
    const all = await Promise.all([
      addOrUpdate('users', user),
      addOrUpdate('todos', todos),
      addOrUpdate('directories', directory),
      ...notes.map((note) => addOrUpdate('notes', note)),
    ]);

    lockUpdate = false;
    return all;
  }
};
