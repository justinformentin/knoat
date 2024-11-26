'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FolderPlus } from 'lucide-react';
import PopoverView from './popover-view';
import { Directory, Note } from '@/server/types';
import { useDbAdapter } from '@/server/dbAdapter';
import { useSidebar } from './ui/sidebar';
import { combineDirectoriesAndNotes } from '@/lib/combine-note-dir';
import { useIdb } from '@/server/indexDbAdapter';

export interface ListItem {
  id: string;
  label: string;
}
export interface FolderType extends ListItem {
  children: ListItem[];
}
export interface FileType extends ListItem {
  fileName: string;
  fullPath: string;
}
export type ListType = Array<FolderType | FileType>;

type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };

export default function FileTree({
  user,
  notes,
  directories,
  initialTreeView,
}: {
  user: any;
  notes: any;
  directories: any;
  initialTreeView: any;
}) {
  console.log('=====FILE TREE====');
  const params = useParams();
  const router = useRouter();

  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >();
  const [treeView, setTreeView] = useState<TreeViewDirectory[] | []>(
    initialTreeView
  );
  const [noteList, setNoteList] = useState<Note[] | []>(notes);
  const [notePath, setNotePath] = useState<string>('');

  const idb = useIdb();
  // TODO: Offline backup. If this component loads with no notes or directories,
  // try getting them from indexeddb
  const getData = async () => {
    console.log('getData shouldnt run');
    const notes = await idb.getAllUserNotes(user.id);
    const directories = await idb.getAllUserDirectories(user.id);
    // const directories = await getAll('directories', 'user_id', user.id);
    //@ts-ignore
    const treeView = combineDirectoriesAndNotes(notes, directories);
    //@ts-ignore
    setNoteList(notes);
    //@ts-ignore
    setTreeView(treeView);
  };

  const syncData = async({notes, directories, user}:any) => {
    await idb.syncToIdb(directories, notes, user);
  }
  useEffect(() => {
    console.log('FTW UE notes, dir', { notes, directories });
    if (!navigator.onLine && !directories?.length && (!noteList?.length || !treeView?.length)) {
      getData();
    } else {
      syncData({notes, directories, user})
    }
  }, []);

  const addResource = (path: string, listCopy: any) => {
    const findPath = (paths: string[], dir: any): any => {
      const remainingPaths = [...paths];
      const nextPath = remainingPaths.shift();
      const foundDir = dir.find((item: any) => item.label === nextPath);
      if (foundDir) {
        return remainingPaths.length
          ? findPath(remainingPaths, foundDir.children)
          : foundDir;
      }
    };

    const pathSplit = path.split('/');
    return findPath(pathSplit, listCopy);
  };

  const dbAdapter = useDbAdapter();

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

  const addFile = async (path: string, itemName: string) => {
    const noteListCopy = [...noteList];
    const treeViewCopy = [...treeView];
    const foundDir = addResource(path, treeViewCopy);
    const fileName = `${itemName}.md`;
    const fullPath = `${path}/${fileName}`;
    const note = await createNote(fileName, fullPath);
    console.log('addFile', note);
    foundDir.children.push(note);
    setTreeView(treeViewCopy);
    noteListCopy.push(note);
    setNoteList(noteListCopy);
    router.push('/notes/' + fullPath);
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

  const addDirectory = async (path: string, fileName: string) => {
    const treeViewCopy = [...treeView];
    const foundDir = addResource(path, treeViewCopy);
    const fullPath = `${path}/${fileName}`;
    const dir = await createDirectory(fileName, fullPath);
    foundDir.children.push({ ...dir, children: [] });
    setTreeView(treeViewCopy);
  };

  const addRootDirectory = async (name: string) => {
    const dir = await createDirectory(name, name);
    const treeViewCopy = [...treeView];
    treeViewCopy.push({ ...dir, children: [] });
    setTreeView(treeViewCopy);
  };

  const { isMobile, setOpenMobile } = useSidebar();

  const renderDirectory = (item: any) => {
    if (item.children) {
      return (
        <Folder
          key={item.id}
          value={item.id}
          element={item.label}
          newFolderCallback={(itemName: string) => {
            addDirectory(item.full_path, itemName);
          }}
          newNoteCallback={(itemName: string) => {
            addFile(item.full_path, itemName);
          }}
        >
          {item.children.map(renderDirectory)}
        </Folder>
      );
    } else {
      return (
        <Link
          href={'/notes/' + item.full_path}
          key={item.id}
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <File value={item.id} isSelect={item.id === initialSelectedId}>
            <p>{item.label}</p>
          </File>
        </Link>
      );
    }
  };

  useEffect(() => {
    if (
      params.notePath &&
      params.notePath.length &&
      Array.isArray(params.notePath)
    ) {
      const np = params.notePath.join('/');

      if (noteList?.length && notePath !== np) {
        console.log('INSIDE FILE TREE UE IF()');
        const found = noteList.find((note: any) => note.full_path === np);

        found &&
          found.id !== initialSelectedId &&
          setInitialSelectedId(found.id);
        setNotePath(np);
      }
    }
  }, [params, router, noteList]);

  if (!treeView?.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="justify-end flex w-full mr-12">
        <PopoverView text="Directory" confirmCallback={addRootDirectory}>
          <FolderPlus className="h-5 w-5 md:h-4 md:w-4 opacity-60 hover:opacity-100 hover:cursor-pointer" />
        </PopoverView>
      </div>
      <Tree
        className="p-2 overflow-hidden rounded-md bg-background"
        initialSelectedId={initialSelectedId}
        elements={treeView}
      >
        {treeView.map(renderDirectory)}
      </Tree>
    </div>
  );
}
