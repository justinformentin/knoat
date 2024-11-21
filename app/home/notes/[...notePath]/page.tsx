import { serverClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Editor from '../../_components/text-editor/editor';

export default async function NotePage(props: any) {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect('/sign-in');

  const { notePath } = await props.params;

  const note = await client
    .from('notes')
    .select('*')
    .eq('full_path', notePath.join('/'))
    .eq('user_id', user.id)
    .single();

  return <Editor user={user} note={note.data} />;
}
