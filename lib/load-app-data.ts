import { browserClient } from '@/utils/supabase/client';
import { serverClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const loadUser = async (client: SupabaseClient) => {
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
};

export const loadUserData = (client: SupabaseClient, userId: string) =>
  client
    .from('users')
    .select('id, directories (*), notes (*), todos (*)')
    .eq('id', userId)
    .single();

export const loadUserDataSSR = cache(async (userId: string) => {
  const client = await serverClient();
  return loadUserData(client, userId);
});
export const loadUserDataClient = cache(async (userId: string) => {
  const client = browserClient();
  return loadUserData(client, userId);
});
