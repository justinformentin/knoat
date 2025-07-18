'use client';
import Link from 'next/link';
import HeaderAuth from '@/components/app-header/header-auth';
import { ThemeSwitcher } from '@/components/app-header/theme-switcher';
import { Logo } from './logo';
import { SidebarTrigger } from '../ui/sidebar';
import { useEffect, useState } from 'react';
import AppHeaderLinks from './app-header-links';
import { browserClient } from '@/utils/supabase/client';
import { usePathname, redirect } from 'next/navigation';
import { useDataStore } from '@/lib/use-data';

export default function AppHeader() {
  const client = browserClient();
  const pathname = usePathname();
  const [userId, setUserId] = useState('');
  const initialize = useDataStore((state) => state.initialize);

  const init = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();
    console.log('user', user);
    // if (pathname !== '/sign-in' && !user) redirect('/sign-in');
    if (user?.id) {
      const { data } = await client
        .from('users')
        .select('id, directories (*), notes (*), todos (*)')
        .eq('id', user.id)
        .single();

      if (user.id) {
        setUserId(user.id);
        // prettier-ignore
        // @ts-ignore Typing is correct, the dir/notes/todos have a unique id fkey, so the output is an object instead of an array
        initialize({ user, todos: data.todos, notes: data.notes, directory: data.directories});
      }
    }
  };

  console.log('user', userId);
  // const dbAdapter = useDbAdapter();
  // const dbSync = () => {
  //   // Initialize store data with indexeddb data first
  //   dbAdapter.syncFromIdb(ssrData?.id).then((userId) => {
  //     // If there's no ssrData.id (the user id) try to get it from indexeddb
  //     if (!ssrData?.id) setUserId(userId);
  //   });

  //   if (ssrData && ssrData.id) {
  //     // If we're online and we get data from the server,
  //     // sync the store and idb with fresh db data
  //     dbAdapter.syncFromDb(ssrData);
  //   }
  // };
  useEffect(() => {
    init();
  }, []);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 z-50">
      {userId ? <SidebarTrigger className="self-center ml-2" /> : null}
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold hidden sm:block">
              Knoat
            </span>
          </Link>
        </div>
        {userId ? <AppHeaderLinks /> : null}
        <div className="flex justify-between">
          <ThemeSwitcher />
          <HeaderAuth userId={userId} />
        </div>
      </div>
    </nav>
  );
}
