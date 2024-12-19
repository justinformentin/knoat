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
  
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
