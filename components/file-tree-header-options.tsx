'use client';
import { FolderPlus, SquarePen } from 'lucide-react';
import PopoverInput from './popover-input';
import { useDbAdapter } from '@/server/dbAdapter';
import { useDataStore } from '@/lib/use-data';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { TooltipWrap } from './tooltip-wrap';

type DirectoryDbType = {
  id: string;
  label: string;
  created_at: string;
  children?: [];
};
export default function FileTreeHeaderOptions() {
  const dbAdapter = useDbAdapter();

  const { user, directory, updateDirectory, addNote } = useDataStore(
    (state) => state
  );

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
    });
    addNote(note);
  };

  const updateTree = async (fileName: string) => {
    const dir = await updateDbDirectory({
      label: fileName,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      children: [],
    });
    updateDirectory(dir.tree);
  };

  return (
    <>
      <PopoverInput text="Note" confirmCallback={addFile}>
        <TooltipWrap text="New Note" side="bottom">
          <Button variant="outline" size="iconsm">
            <SquarePen className="size-4" />
          </Button>
        </TooltipWrap>
      </PopoverInput>
      <PopoverInput text="Directory" confirmCallback={updateTree}>
        <TooltipWrap text="New Directory" side="bottom">
          <Button variant="outline" size="iconsm">
            <FolderPlus className="size w-4" />
          </Button>
        </TooltipWrap>
      </PopoverInput>
    </>
  );
}