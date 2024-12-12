'use client';
import Link from 'next/link';
import HeaderAuth from '@/components/app-header/header-auth';
import { ThemeSwitcher } from '@/components/app-header/theme-switcher';
import { Logo } from './logo';
import { SidebarTrigger } from '../ui/sidebar';
import { useDataStore } from '@/lib/use-data';
import { useEffect } from 'react';
import AppHeaderLinks from './app-header-links';

export default function AppHeader({ data }: any) {
  const { setDirectory, setNotes, setTodos, setUser } = useDataStore(
    (store) => store
  );

  useEffect(() => {
    if (data && data.id) {
      if (data.id) setUser({ id: data.id });
      if (data.notes) setNotes(data.notes);
      if (data.directories) setDirectory(data.directories);
      if (data.todos) setTodos(data.todos.list);
    }
  }, []);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 fixed relative">
      <SidebarTrigger className="self-center ml-2" />
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold">Knoat</span>
          </Link>
        </div>
        {data && data?.id ? <AppHeaderLinks /> : null}
        <div className="flex justify-between">
          <ThemeSwitcher />
          <HeaderAuth userId={(data && data?.id) || null} />
        </div>
      </div>
    </nav>
  );
}
