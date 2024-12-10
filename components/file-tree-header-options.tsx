'use client';
import { useRouter } from 'next/navigation';
import { FolderPlus, SquarePen } from 'lucide-react';
import PopoverInput from './popover-input';
import { useDbAdapter } from '@/server/dbAdapter';
import { useSidebarStore } from '@/lib/use-sidebar';
import { useIsMobile } from '@/lib/use-is-mobile';
import { useDataStore } from '@/lib/use-data';
import { Button } from './ui/button';
import { useSelectedItemStore } from '@/lib/use-selected-item';

export default function FileTreeHeaderOptions() {
  const router = useRouter();

  const dbAdapter = useDbAdapter();

  const isMobile = useIsMobile();

  const setOpenMobile = useSidebarStore((state) => state.setOpenMobile);
  const selectedItem = useSelectedItemStore((state) => state.selectedItem);
  const { user, addDirectory, addNote } = useDataStore((state) => state);

  const createNote = async (fileName: string, fullPath: string) => {
    // We only need the user_id, label, and full_path for postgres, as everything else is auto generated
    // but for indexdb we need to pass everything else
    const now = new Date().toISOString();
    const data = {
      user_id: user.id,
      label: fileName,
      full_path: fullPath,
      created_at: now,
      updated_at: now,
      content: '',
    };
    const note = await dbAdapter.insert('notes', data);
    console.log('create note', note);
    return note;
  };

  const addFile = async (itemName: string) => {
    const fileName = `${itemName}.md`;

    const selectedFile =
      selectedItem?.full_path.slice(-3) === '.md'
        ? selectedItem.full_path.split('/').slice(0, -1)
        : selectedItem?.full_path;

    const selectedPath = selectedFile ? `${selectedFile}/` : '';

    const fullPath = `${selectedPath}${fileName}`;

    const note = await createNote(fileName, fullPath);
    addNote(note);
    console.log('addFile', note);
    router.push('/app/notes/' + fullPath);
    isMobile && setOpenMobile(false);
  };

  const createDirectory = async (fileName: string, fullPath: string) => {
    const now = new Date().toISOString();
    const dir = await dbAdapter.insert('directories', {
      user_id: user.id,
      label: fileName,
      full_path: fullPath,
      created_at: now,
    });
    console.log('create dir', dir);
    return dir;
  };

  const addDir = async (fileName: string) => {
    const selectedPath = selectedItem ? `${selectedItem.full_path}/` : '';
    const fullPath = `${selectedPath}${fileName}`;
    const dir = await createDirectory(fileName, fullPath);
    addDirectory(dir);
  };

  // const addRootDir = async (name: string) => {
  //   const dir = await createDirectory(name, name);
  //   addRootDirectory(dir);
  // };

  return (
    <>
      <PopoverInput text="Note" confirmCallback={addFile}>
        <Button variant="outline" size="iconsm">
          <SquarePen className="h-4 w-4" />
        </Button>
      </PopoverInput>
      <PopoverInput text="Directory" confirmCallback={addDir}>
        <Button variant="outline" size="iconsm">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </PopoverInput>
    </>
  );
}
