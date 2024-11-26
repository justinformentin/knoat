import NoteWrapper from './note-wrapper';
import { loadUserNotes } from '@/lib/server/notes';
import { loadUser } from '@/lib/server/user';

export default async function NotePage(props: any) {
  const { notePath } = await props.params;
  const user = await loadUser();
  const notes = await loadUserNotes(user.id);
  return (
    <NoteWrapper notePath={notePath} notes={notes} userId={user.id} />
  );
}
