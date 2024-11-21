'use client';
import { useEffect, useState } from 'react';
import Editor from './text-editor/editor';
import { useParams } from 'next/navigation';
import { browserClient } from '@/utils/supabase/client';

export default function NoteArea({ user }: { user: any }) {
  const [note, setNote] = useState();
  const params = useParams();

  const getNote = async () => {
    const client = browserClient();
    const hash = window.location.hash.replace('#', '');

    const res = await client
      .from('notes')
      .select('*')
      .eq('full_path', hash)
      .single();

    setNote(res.data || null);
  };

  useEffect(() => {
    getNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div>{note !== undefined ? <Editor user={user} note={note} /> : null}</div>
  );
}
