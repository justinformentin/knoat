import { Directory, Note, Tables } from '@/server/types';
import { browserClient } from '@/utils/supabase/client';
import { useEffect, useRef, useState } from 'react';
import { Todos } from './database.types';
import { useOfflineCacheStore } from './use-offline-cache';

enum NetworkStatus {
  Online = 'online',
  Offline = 'offline',
}
type OfflineCacheValue = {
  tableName: Tables;
  action: 'insert' | 'update' | 'delete';
  data: Note | Directory | Todos | string[];
};

export const useOfflineCache = () => {
  const offlineCacheStore = useOfflineCacheStore((state) => state);
  // console.log('offlineCache', offlineCacheStore);
  const offlineCache = offlineCacheStore.offlineCache;
  const [navigatorStatus, setNavigatorStatus] = useState<boolean | undefined>();
  const networkStatus = useRef<NetworkStatus>();
  const client = browserClient();

  const handleUpdateSupabaseWithOfflineCache = async () => {
    if (!offlineCache?.size) return;

    const promises: any = [];

    Object.keys(offlineCache).forEach((key:string) => {
      const item: OfflineCacheValue = offlineCache[key];

      if (item.action === 'update') {
        promises.push(
          //@ts-ignore
          client.from(item.tableName).update(item.data).eq('id', item.data.id)
        );
      } else if (item.action === 'insert') {
        promises.push(client.from(item.tableName).insert(item.data));
      } else if (item.action === 'delete') {
        //@ts-ignore
        promises.push(client.from(item.tableName).delete().in('id', item.data));
      }
    });
    const p = await Promise.all(promises);
    useOfflineCacheStore.setState({ offlineCache: {} });
    // console.log('p', p);
    return p;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNavigatorStatus(navigator.onLine);
      networkStatus.current =
        NetworkStatus[navigator.onLine ? 'Online' : 'Offline'];
    }
  }, []);

  const onlineCallback = async () => {
    // If we were offline and now we're online again
    if (networkStatus?.current === NetworkStatus.Offline) {
      await handleUpdateSupabaseWithOfflineCache();
    }
    networkStatus.current = NetworkStatus.Online;
  };

  const offlineCallback = () => {
    networkStatus.current = NetworkStatus.Offline;
  };

  useEffect(() => {
    if (navigatorStatus !== undefined) {
      window.addEventListener('online', onlineCallback);
      window.addEventListener('offline', offlineCallback);
      if (navigatorStatus === true) {
        // If loading the page and we're online when we were previously offline
        // check if we have to update supabase
        handleUpdateSupabaseWithOfflineCache();
      }
    }
    return () => {
      window.removeEventListener('online', onlineCallback);
      window.removeEventListener('offline', offlineCallback);
    };
  }, [navigatorStatus]);

  const updateOfflineCache = (
    tableName: Tables,
    action: 'update' | 'insert' | 'delete',
    data: any
  ) => {
    useOfflineCacheStore.setState((prev) => {
      // Convert the object to a map so we know are not getting dupicates
      // And the order of actions is maintained
      const toMap = new Map(Object.entries(prev.offlineCache));
      toMap.set(data.id, { tableName, action, data });
      const fromMap = Object.fromEntries(toMap);

      return {
        offlineCache: fromMap,
      };
    });
  };

  return { updateOfflineCache };
};
