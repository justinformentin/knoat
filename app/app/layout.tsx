import { loadUser } from '@/lib/server/user';
import AppHeader from '@/components/app-header';

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
    </>
  );
}
