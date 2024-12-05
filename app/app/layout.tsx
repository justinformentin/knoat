import { loadUser } from '@/lib/server/user';
import AppHeader from '@/components/app-header';
import { Toaster } from 'sonner';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await loadUser();
  return (
    <>
      <AppHeader userId={user.id} />
      {children}
      <Toaster />
    </>
  );
}
