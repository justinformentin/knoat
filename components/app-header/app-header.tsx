'use client';
import Link from 'next/link';
import HeaderAuth from '@/components/app-header/header-auth';
import { ThemeSwitcher } from '@/components/app-header/theme-switcher';
import { Logo } from './logo';
import { SidebarTrigger } from '../ui/sidebar';
import { useDataStore } from '@/lib/use-data';
import { useEffect, useState } from 'react';
import AppHeaderLinks from './app-header-links';
import { browserClient } from '@/utils/supabase/client';

export default function AppHeader({ data }: any) {
  const client = browserClient();

  const initialize = useDataStore((store) => store.initialize);

  const [user, setUser] = useState(data?.id);

  const init = async () => {
    if (data && data.id) {
      initialize({
        user: { id: data.id },
        notes: data.notes,
        directory: data.directories,
        todos: data.todos?.list,
      });
    } else {
      const {
        data: { user },
        error,
      } = await client.auth.getUser();
      if (user) setUser(user.id);
    }
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 fixed relative">
      {user ? <SidebarTrigger className="self-center ml-2" /> : null}
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold">Knoat</span>
          </Link>
        </div>
        {user && user ? <AppHeaderLinks /> : null}
        <div className="flex justify-between">
          <ThemeSwitcher />
          <HeaderAuth userId={user || null} />
        </div>
      </div>
    </nav>
  );
}
