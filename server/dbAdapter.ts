import { indexDb } from './indexDbAdapter';
import { supabaseAdapter } from './supabaseAdapter';
import {
  Directory,
  DirectoryInsert,
  GetOneProps,
  Note,
  NoteInsert,
  Tables,
} from './types';
import { v4 as uuidv4 } from 'uuid';

const isOnline = () => {
  //   if (typeof window !== 'undefined' && window.navigator) {
  return navigator.onLine;
  //   } else {
  //     return fetch('http://localhost:3000/api/health')
  //       .then((r) => {
  //         console.log('r', r);
  //         return r.json();
  //       })
  //       .then((res) => {
  //         console.log('HEALTH CHECK RES', res);
  //         return res;
  //       });
  //   }
};

// const offlineCache: {
//   tableName: Tables;
//   action: 'insert' | 'update';
//   data: Note | Directory;
// }[] = [];
type OfflineCacheValue = {
  tableName: Tables;
  action: 'insert' | 'update';
  data: Note | Directory;
};
const lsMap = localStorage.getItem('knoat-map') || '{}';
const parsedMap = JSON.parse(lsMap);
const offlineCache: Map<string, OfflineCacheValue> = new Map(
  Object.entries(parsedMap)
);

const handleSync = async () => {
  console.log('handle sync');
  const promises: Promise<any>[] = [];

  offlineCache.forEach((item: OfflineCacheValue, key) => {
    if (item.action === 'update') {
      promises.push(supabaseAdapter.update(item.tableName, item.data));
    } else if (item.action === 'insert') {
      promises.push(supabaseAdapter.insert(item.tableName, item.data));
    }
  });
  const p = await Promise.all(promises);
  offlineCache.clear();
  localStorage.setItem('knoat-map', '{}');
  console.log('p', p);
};

if (lsMap !== '{}') {
  handleSync();
}
let offlineCacheObj: any = {};

const updateOfflineCache = (
  tableName: Tables,
  action: 'update' | 'insert',
  data: any
) => {
  offlineCache.set(data.id, { tableName, action, data });
  offlineCacheObj = {};
  offlineCache.forEach((value, key) => {
    offlineCacheObj[key] = value;
  });
  localStorage.setItem('knoat-map', JSON.stringify(offlineCacheObj));
};

export const getOne = async ({
  tableName,
  queries,
  queryKey,
  queryId,
}: GetOneProps) => {
  const online = isOnline();
  console.log('is online', online);
  const idbGetOne = async () => (await indexDb).getOne(tableName, queryId);

  if (online) {
    const args: GetOneProps = { tableName, queryId };
    if (queries) {
      args.queries = queries;
    } else if (queryKey && queryId) {
      args.queryKey = queryKey;
    }
    const idbReturn = await idbGetOne();
    console.log('idbReturn', idbReturn);

    return await supabaseAdapter.getOne(args);
  } else return idbGetOne();
};

export const getAll = async (
  tableName: Tables,
  queryKey: string,
  queryId: string
) => {
  const online = isOnline();
  console.log('is online', online);
  const idbGetAll = async () => (await indexDb).getAll(tableName, queryId);

  if (online) {
    const idbReturn = await idbGetAll();
    console.log('idbReturn', idbReturn);
    return supabaseAdapter.getAll(tableName, queryKey, queryId);
  } else return await idbGetAll();
};

export const update = async (tableName: Tables, data: Note | Directory) => {
  const idbUpdate = async () => (await indexDb).update(tableName, data);

  const online = isOnline();

  if (online) {
    const idbReturn = await idbUpdate();
    console.log('online idbReturn update', idbReturn);
    const updated = await supabaseAdapter.update(tableName, data);
    console.log('supabae updated', updated)
    return updated;
  } else {
    updateOfflineCache(tableName, 'update', data);
    const idbReturn = await idbUpdate();
    console.log('offline idbReturn update', idbReturn);
    return data;
  }
};

export const insert = async (
  tableName: Tables,
  data: NoteInsert | DirectoryInsert
) => {
  // When we insert a row in postgres, the id is auto generated.
  // When offline, we need to create an id ourselves.
  // We also want the online/offline version to match, so if we're online,
  // we need to wait for the postgres await to complete to put auto generated id in indexeddb
  const idbInsert = async (appendedIdData: any) =>
    (await indexDb).insert(tableName, appendedIdData);

  const online = isOnline();

  if (online) {
    // Fix types - right now everything is conditional and doesn't have definitive typing
    const inserted: any = await supabaseAdapter.insert(tableName, data);
    console.log('online inserted', inserted);
    const idbReturn = await idbInsert(inserted?.id);
    console.log('online idbReturn insert', idbReturn);
    return inserted;
  } else {
    const appendedIdData = { ...data, id: uuidv4() };
    updateOfflineCache(tableName, 'update', appendedIdData);

    const idbReturn = await idbInsert(appendedIdData);
    console.log('offline idbReturn insert', idbReturn);
    return idbReturn;
  }
};

let currentNetwork = '';

console.log('window', window);
window.addEventListener('online', () => {
  console.log('online', currentNetwork);
  if (currentNetwork === 'offline') {
    currentNetwork = 'online';
    handleSync();
  }
});

window.addEventListener('offline', () => {
  console.log('offline');
  currentNetwork = 'offline';
});
