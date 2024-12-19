import { serverClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const loadUser = async (client: SupabaseClient) => {
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
};

const loadUserData = cache((client: SupabaseClient, userId: string) =>
  client
    .from('users')
    .select('id, directories (*), notes (*), todos (*)')
    .eq('id', userId)
    .single()
)

export const loadAppData = async () => {

  const client = await serverClient();
  const user = await loadUser(client);
  if(!user) return null;
  const res = await loadUserData(client, user.id);
  return res?.data || null
}