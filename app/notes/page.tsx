import { serverClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ForwardRefEditor } from './_components/markdown-editor/editor';

export default async function NotePage() {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect('/sign-in');

  return <ForwardRefEditor markdown={''} />;
}
