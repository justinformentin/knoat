'use client';
import PopoverInput from './popover-input';
import { useDbAdapter } from '@/server/dbAdapter';
import { useDataStore } from '@/lib/use-data';
import { v4 as uuidv4 } from 'uuid';

type DirectoryDbType = {
  id: string;
  label: string;
  created_at: string;
  type: 'note' | 'directory';
  children?: [];
};
export default function FileTreeHeaderOptions() {
  const dbAdapter = useDbAdapter();

  const user = useDataStore((state) => state.user);
  const directory = useDataStore((state) => state.directory);
  const updateDirectory = useDataStore((state) => state.updateDirectory);
  const addNote = useDataStore((state) => state.addNote);
  
  const updateDbDirectory = (item: DirectoryDbType) =>
    dbAdapter.update('directories', {
      id: directory.id,
      tree: [...directory.tree, item],
    });

  const createNote = (fileName: string) =>
    // We only need the user_id, label, and full_path for postgres, as everything else is auto generated
    // but for indexdb we need to pass everything else
    dbAdapter.insert('notes', {
      user_id: user.id,
      label: fileName,
      full_path: fileName,
      content: '',
    });

  const addFile = async (fileName: string) => {
    const note = await createNote(fileName);
    await updateDbDirectory({
      label: fileName,
      id: note.id,
      created_at: note.created_at,
      type: 'note',
    });
    addNote(note);
  };

  const updateTree = async (fileName: string) => {
    const dir = await updateDbDirectory({
      label: fileName,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      type: 'directory',
      children: [],
    });
    updateDirectory(dir.tree);
  };

  return (
    <>
      <PopoverInput text="Note" confirmCallback={addFile} />
      <PopoverInput text="Directory" confirmCallback={updateTree} />
    </>
  );
}
