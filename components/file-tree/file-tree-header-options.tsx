'use client';
import { useAddNote, useUpdateDirectory } from '@/lib/db-adapter';
import PopoverInput from './popover-input';
import { useDataStore } from '@/lib/use-data';
import { v4 as uuidv4 } from 'uuid';
import { TreeItem } from '@/server/types';

export default function FileTreeHeaderOptions() {
  const updateDirectory = useUpdateDirectory();
  const addNote = useAddNote();

  const user = useDataStore((state) => state.user);

  const addNewNote = async (fileName: string) => {
    const note = {
      user_id: user.id,
      label: fileName,
      content: '',
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    addNote(note);
    updateDirectory({treeItem: { ...note, type: 'note' }});
  };

  const addNewTreeItem = async (fileName: string) => {
    const newDirItem: TreeItem = {
      label: fileName,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      type: 'directory',
      children: [],
    };
    updateDirectory({treeItem: newDirItem});
  };

  return (
    <>
      <PopoverInput text="Note" confirmCallback={addNewNote} />
      <PopoverInput text="Directory" confirmCallback={addNewTreeItem} />
    </>
  );
}
