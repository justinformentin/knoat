import { useEffect, useState } from 'react';
import { indexDb } from './indexDbAdapter';
import { supabaseAdapter } from './supabaseAdapter';
import {
  Directory,
  DirectoryInsert,
  Note,
  NoteInsert,
  Tables,
} from './types';
import { v4 as uuidv4 } from 'uuid';

enum NetworkStatus {
  Online = 'online',
  Offline = 'offline',
}
type OfflineCacheValue = {
  tableName: Tables;
  action: 'insert' | 'update';
  data: Note | Directory;
};

type OfflineCacheMap = Map<string, OfflineCacheValue>;

export const useDbAdapter = () => {
  const [offlineCache, setOfflineCache] = useState<OfflineCacheMap>(new Map());
  const [navigatorStatus, setNavigatorStatus] = useState<boolean | undefined>();
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>();

  const getLocalStorage = () => {
    const lsMap = localStorage.getItem('knoat-map');
    return lsMap && lsMap !== '{}' ? JSON.parse(lsMap) : null;
  };

  const syncLocalStorageToCache = () => {
    const parsedMap = getLocalStorage();
    parsedMap && setOfflineCache(new Map(Object.entries(parsedMap)));
  };

  const handleUpdateSupabaseWithOfflineCach = async () => {
    console.log('handle sync');

    let cache;
    if(offlineCache.size){
      cache = offlineCache;
    } else {
      const lsMap = getLocalStorage();
      if(lsMap) {
        cache = new Map(Object.entries(lsMap))
      }
    }
   
    if (!cache?.size) return;

    const promises: Promise<any>[] = [];

    offlineCache.forEach((item: OfflineCacheValue, key) => {
      if (item.action === 'update') {
        promises.push(supabaseAdapter.update(item.tableName, item.data));
      } else if (item.action === 'insert') {
        promises.push(supabaseAdapter.insert(item.tableName, item.data));
      }
    });
    const p = await Promise.all(promises);
    setOfflineCache(new Map());
    localStorage.setItem('knoat-map', '{}');
    console.log('p', p);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNavigatorStatus(navigator.onLine);
      setNetworkStatus(
        navigator.onLine ? NetworkStatus.Online : NetworkStatus.Offline
      );
    }
  }, []);

  const onlineCallback = () => {
    if (networkStatus === NetworkStatus.Offline) {
      handleUpdateSupabaseWithOfflineCach();
    }
    setNetworkStatus(NetworkStatus.Online);
  };

  const offlineCallback = () => setNetworkStatus(NetworkStatus.Offline);

  useEffect(() => {
    if (navigatorStatus !== undefined) {
      window.addEventListener('online', onlineCallback);
      window.addEventListener('offline', offlineCallback);
      if (navigatorStatus === true) {
        handleUpdateSupabaseWithOfflineCach();
      } else if (navigatorStatus === false) {
        syncLocalStorageToCache();
      }
    }
    return () => {
      window.removeEventListener('online', onlineCallback);
      window.removeEventListener('offline', offlineCallback);
    };
  }, [navigatorStatus]);

  useEffect(() => {
    // sync offline cache with localStorage so we can persist db actions through page reloads;
    if (offlineCache.size) {
      const offlineCacheObj: Record<string, OfflineCacheValue> = {};
      offlineCache.forEach((value, key) => {
        offlineCacheObj[key] = value;
      });
      localStorage.setItem('knoat-map', JSON.stringify(offlineCacheObj));
    }
  }, [offlineCache]);

  const updateOfflineCache = (
    tableName: Tables,
    action: 'update' | 'insert',
    data: any
  ) => {
    setOfflineCache(
      (map) => new Map(map.set(data.id, { tableName, action, data }))
    );
  };

  const update = async (tableName: Tables, data: Note | Directory) => {
    const idbUpdate = async () => (await indexDb).update(tableName, data);

    if (navigator.onLine) {
      const idbReturn = await idbUpdate();
      console.log('online idbReturn update', idbReturn);
      const updated = await supabaseAdapter.update(tableName, data);
      console.log('supabae updated', updated);
      return updated;
    } else {
      updateOfflineCache(tableName, 'update', data);
      const idbReturn = await idbUpdate();
      console.log('offline idbReturn update', idbReturn);
      return data;
    }
  };

  const insert = async (
    tableName: Tables,
    data: NoteInsert | DirectoryInsert
  ) => {
    // When we insert a row in postgres, the id is auto generated.
    // When offline, we need to create an id ourselves.
    // We also want the online/offline version to match, so if we're online,
    // we need to wait for the postgres await to complete to put auto generated id in indexeddb
    const idbInsert = async (appendedIdData: any) =>
      (await indexDb).insert(tableName, appendedIdData);

    if (navigator.onLine) {
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

  return {
    insert,
    update,
  };
};
// let currentNetwork = '';

// console.log('window', window);
// window.addEventListener('online', () => {
//   console.log('online', currentNetwork);
//   if (currentNetwork === 'offline') {
//     currentNetwork = 'online';
//     handleSync();
//   }
// });

// window.addEventListener('offline', () => {
//   console.log('offline');
//   currentNetwork = 'offline';
// });