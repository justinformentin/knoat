'use client';
import { useEffect, useState } from 'react';
import { useDataStore } from '@/lib/use-data';
import { SelectedItem, useSelectedItemStore } from '@/lib/use-selected-item';
import { findPathById } from '@/lib/find-note-path-by-id';
import { findNoteIdByPath } from '@/lib/find-path-by-note-id';
import { Note } from '@/server/types';

export function useGetNote() {
  const notes = useDataStore((state) => state.notes);
  const directory = useDataStore((state) => state.directory);
  const selectedItem = useSelectedItemStore((state) => state.selectedItem);

  const getNoteFromSelectedItem = (n: Note[], sel: SelectedItem | null) =>
    n.find((ni) => ni.id === sel?.id && sel?.type === 'note');

  const getNote = (notes: Note[]) => {
    if (typeof window !== 'undefined') {
      if (selectedItem?.id) {
        return getNoteFromSelectedItem(notes, selectedItem);
      } else {
        const noteId = findNoteIdByPath(
          directory.tree,
          window.location.hash.slice(1)
        );
        return notes.find((n) => n.id === noteId);
      }
    }
  };

  const [note, setNote] = useState(getNote(notes));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedItem?.type === 'note') {
        setNote(getNoteFromSelectedItem(notes, selectedItem));
        const fullPath = findPathById(directory?.tree, selectedItem?.id!);
        if (fullPath) {
          window.location.hash = '#' + fullPath;
        }
      }
    }
  }, [notes, selectedItem]);

  return note;
}
