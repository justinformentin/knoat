import { serverClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Editor from './_components/text-editor/editor';

export default async function NotePage(props: any) {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect('/sign-in');

  return <Editor user={user} />;
}
