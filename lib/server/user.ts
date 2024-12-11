import { serverClient } from '@/utils/supabase/server';
import { serviceClient } from '@/utils/supabase/service';
import { redirect } from 'next/navigation';

export const loadUser = async () => {
  const client = await serverClient();
  const service = await serviceClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return redirect('/sign-in');
  // Remove since this happens on the backend
  const res = await service
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();
  if (!res.data) {
    await service.from('users').insert({ id: user.id, email: user.email! });
  }
  return user;
};
