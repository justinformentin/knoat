import { loadUser } from '@/lib/server/user';
import AppHeader from '@/components/app-header';
import { Toaster } from 'sonner';
import { serverClient } from '@/utils/supabase/server';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await loadUser();
  const client = await serverClient();

  const { data } = await client
    .from('users')
    .select('id, directories (*), notes (*), todos (*)')
    .eq('id', user.id)
    .single();

  return (
    <>
      <AppHeader userId={user.id} data={data} />
      {children}
      <Toaster />
    </>
  );
}
