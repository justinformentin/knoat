import AppHeader from '@/components/app-header/app-header';
import { loadUserDataSSR } from '@/lib/load-app-data';
import { serverClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return redirect('/sign-in');
  
  const {data} = await loadUserDataSSR(user.id)
  return (
    <>
      <AppHeader ssrData={data} />
      {children}
      <Toaster />
    </>
  );
}
