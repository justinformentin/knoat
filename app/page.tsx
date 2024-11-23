import { serverClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  return redirect(user ? '/notes' : '/sign-in');
}
