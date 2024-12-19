'use server';

import { serverClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signInWithOAuth = async (
  provider: 'google' | 'facebook' | 'linkedin_oidc' | 'twitter'
) => {
  const supabase = await serverClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signOutAction = async () => {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
