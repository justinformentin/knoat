import { serverClient } from '@/utils/supabase/server';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const loadUser = cache(async () => {
  const client = await serverClient();
  const {data: { user } } = await client.auth.getUser();
  if (!user) return redirect('/sign-in');
  return user;
});
