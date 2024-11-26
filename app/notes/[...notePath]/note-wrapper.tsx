'use client';
import { useEffect, useState } from 'react';
import { ForwardRefEditor } from '../_components/markdown-editor/editor';
import { type Note } from '@/server/types';
import { getOne } from '@/server/dbAdapter';

export default function NoteWrapper({ notePath, notes, userId }: any) {
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    const isNotePath =
      notePath?.length && notePath[notePath.length - 1].slice(-3) === '.md';

    const getNote = async () => {
      const full_path = notePath.join('/');
      const n = await getOne({
        tableName: 'notes',
        queries: { full_path, user_id: userId },
        queryId: full_path,
      });
      setNote(n);
    };
    if (isNotePath) {
      if (notes?.length) {
        setNote(notes.find((n: any) => n.full_path === notePath.join('/')));
      } else {
        getNote();
      }
    }
  }, [notePath]);

  if (!note) return;
  return (
    //@ts-ignore - Will be fixed when changing the location of data loading and subsequent prop passing is fixed
    <ForwardRefEditor note={note} userId={userId} />
  );
}




