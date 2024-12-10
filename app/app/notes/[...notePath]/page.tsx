import NoteWrapper from './note-wrapper';
// import { loadUserNotes } from '@/lib/server/notes';
// import { loadUser } from '@/lib/server/user';
// import { serverClient } from '@/utils/supabase/server';

export default async function NotePage(props: any) {
  const { notePath } = await props.params;
  // const user = await loadUser();

  // const client = await serverClient();
  // const note = await client.from('notes').select('*').eq('user_id', user.id).eq('full_path', notePath.join('/')).single();
  // const notes = await loadUserNotes(user.id);
  return (
    <NoteWrapper notePath={notePath}
    //  userId={user.id}
      />
  );
}
