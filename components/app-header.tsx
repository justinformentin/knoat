import Link from 'next/link';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from './logo';
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';

export default function AppHeader({ userId, children }: any) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 fixed relative">
      {/* {children || null} */}
      <SidebarTrigger className="self-center ml-2" />
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold">Knoat</span>
          </Link>
        </div>
        {userId ? (
          <div className="flex justify-between space-x-4">
            <Button asChild size="sm" variant={'outline'} className="h-8">
              <Link href="/app/notes">Notes</Link>
            </Button>
            <Button asChild size="sm" variant={'outline'} className="h-8">
              <Link href="/app/todo">Todo</Link>
            </Button>
          </div>
        ) : null}
        <div className="flex justify-between">
          <ThemeSwitcher />
          <HeaderAuth userId={userId} />
        </div>
      </div>
    </nav>
  );
}
