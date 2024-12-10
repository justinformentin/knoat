'use client';
import { useEffect, useState } from 'react';
import { ForwardRefEditor } from '../_components/markdown-editor/editor';
import { type Note } from '@/server/types';
import { useIdb } from '@/server/indexDbAdapter';
import { useDataStore } from '@/lib/use-data';

export default function NoteWrapper({ notePath, 
  // note, 
  userId }: any) {
  // console.log('noteWrapper note', note)
  const notes = useDataStore(store => store.notes);
  const isNotePath =  notePath?.length && notePath[notePath.length - 1].slice(-3) === '.md';

  const note = isNotePath ? notes.find((n) => n.full_path === notePath.join('/')) : undefined;

  // const [noteData, setNoteData] = useState<Note | undefined>(note);

  // const idb = useIdb();

  // useEffect(() => {


  //   const getNote = async () => {
  //     const fullPath = notePath.join('/');
  //     // const n = await idb.getOneUserNote(userId, fullPath)
  //     // console.log('getNote n', n);

  //     setNoteData(n);
  //   };

  //   if (isNotePath && !note) getNote();
    
  // }, [notePath]);

  return (
    //@ts-ignore - Will be fixed when changing the location of data loading and subsequent prop passing is fixed
    <ForwardRefEditor note={note
      //  || noteData
      } userId={userId} />
  );
}




