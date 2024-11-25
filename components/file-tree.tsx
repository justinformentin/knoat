'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { memo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { browserClient } from '@/utils/supabase/client';
import { FolderPlus } from 'lucide-react';
import PopoverView from './popover-view';
import { indexDb } from '@/server/indexDbAdapter';
import { Directory, Note } from '@/server/types';
import { getAll, insert } from '@/server/dbAdapter';

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

function FileTree({
  user,
  //   notes,
  //   directories,
  //   initialTreeView,
}: {
  user: any;
  //   notes: any;
  //   directories: any;
  //   initialTreeView: any;
}) {
  const params = useParams();
  const router = useRouter();

  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >();
  const [treeView, setTreeView] = useState<TreeViewDirectory[] | []>([]);
  const [notePath, setNotePath] = useState<string[]>([]);
  const [noteList, setNoteList] = useState<Note[] | []>([]);

  const combineDirectoriesAndNotes = (
    directories: Directory[] | null,
    notes: Note[] | null
  ) => {
    const treeView: TreeViewDirectory[] = [...directories!];
    const findDir = (fullPath: string) => {
      const path = fullPath.split('/').slice(0, -1).join('/');
      if (path === '') return;
      return treeView?.find((d) => d.full_path === path);
    };

    notes?.forEach((n) => {
      const foundDir = findDir(n.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(n);
      }
    });

    treeView?.forEach((d) => {
      if (!d.children) d.children = [];

      const foundDir = findDir(d.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        //@ts-ignore
        foundDir.children.push(d);
        const currIdx = treeView.findIndex((dd) => dd.id === d.id);
        if (currIdx !== -1) treeView.splice(currIdx, 1);
      }
    });
    return directories;
  };

  useEffect(() => {
    // const syncDb = async () => {
    //   console.log('synced', synced);
    // };
    // syncDb();

    const getData = async () => {
      const notes = await getAll('notes', 'user_id', user.id);
      const directories = await getAll('directories', 'user_id', user.id);

      console.log('sidebar notes', notes);
      console.log('sidebar directories', directories);

      const treeView = combineDirectoriesAndNotes(directories, notes);
      //   setDirectories(directories);
      setNoteList(notes || []);
      setTreeView(treeView || []);

      //@ts-ignore - fix later
      const synced = (await indexDb).sync(directories, notes, { id: user.id });
    };

    getData();
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
    const note = await insert('notes', data);
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
    const dir = await insert('directories', {
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
        <Link href={'/notes/' + item.full_path} key={item.id}>
          <File value={item.id} isSelect={item.id === initialSelectedId}>
            <p>{item.label}</p>
          </File>
        </Link>
      );
    }
  };

  useEffect(() => {
    console.log('====UE=====')
    console.log('params', params);
    console.log('router', router);
    if(noteList?.length && notePath !== params.notePath){
    if (
    
      params.notePath &&
      params.notePath.length &&
      Array.isArray(params.notePath)
    ) {

      const np: string[] = params.notePath;
      const found = noteList.find(
        (note: any) => note.full_path === np.join('/')
      );
      
      found && found.id !== initialSelectedId && setInitialSelectedId(found.id);
      setNotePath(params.notePath)
    }
}
  }, [params, router, noteList]);

  if (!treeView) return null;

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="justify-end flex w-full mr-12">
        <PopoverView text="Directory" confirmCallback={addRootDirectory}>
          <FolderPlus className="h-4 w-4 opacity-60 hover:opacity-100 hover:cursor-pointer" />
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

export default memo(FileTree)