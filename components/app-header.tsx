import Link from 'next/link';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from './logo';

export default function AppHeader({ children }: any) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 fixed md:relative">
      {children || null}
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="flex space-x-1">
            <Logo />
            <span className="self-center font-semibold">Knoat</span>
          </Link>
        </div>
        <ThemeSwitcher />
        <HeaderAuth />
      </div>
    </nav>
  );
}
