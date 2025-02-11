'use client';
import Link from 'next/link';
import HeaderAuth from '@/components/app-header/header-auth';
import { ThemeSwitcher } from '@/components/app-header/theme-switcher';
import { Logo } from './logo';
import { SidebarTrigger } from '../ui/sidebar';
import { useEffect, useState } from 'react';
import AppHeaderLinks from './app-header-links';
import { useDbAdapter } from '@/lib/db-adapter';

export default function AppHeader({ ssrData }: any) {
  const dbAdapter = useDbAdapter();

  const [userId, setUserId] = useState(ssrData?.id);

  const init = async () => {
    // Initialize store data with indexeddb data first
    dbAdapter.syncFromIdb(ssrData?.id).then((userId) => {
      // If there's no ssrData.id (the user id) try to get it from indexeddb
      if (!ssrData?.id) setUserId(userId);
    });

    if (ssrData && ssrData.id) {
      // If we're online and we get data from the server,
      // sync the store and idb with fresh db data
      dbAdapter.syncFromDb(ssrData);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 z-50">
      {ssrData?.id || userId ? (
        <SidebarTrigger className="self-center ml-2" />
      ) : null}
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold hidden sm:block">Knoat</span>
          </Link>
        </div>
        {ssrData?.id || userId ? <AppHeaderLinks /> : null}
        <div className="flex justify-between">
          <ThemeSwitcher />
          <HeaderAuth userId={ssrData?.id || userId || null} />
        </div>
      </div>
    </nav>
  );
}
