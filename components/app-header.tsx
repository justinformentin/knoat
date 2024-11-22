import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { EnvVarWarning } from '@/components/env-var-warning';

export default function AppHeader() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10">
      <SidebarTrigger className="self-center ml-2" />
      <div className="w-full flex justify-between items-center p-2 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>Knoat</Link>
        </div>
        <ThemeSwitcher />
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  );
}
