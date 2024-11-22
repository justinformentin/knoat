'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { browserClient } from '@/utils/supabase/client';
import { FolderPlus } from 'lucide-react';
import PopoverView from './popover-view';

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

export function FileTreeDemo({
  user,
  notes,
  initialTreeView,
}: {
  user: any;
  notes: any;
  initialTreeView: any;
}) {
  const params = useParams();
  const router = useRouter();
  const [noteList, setNoteList] = useState(notes);
  const [treeView, setTreeView] = useState(initialTreeView);

  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >();

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
    const client = browserClient();
    const note = await client
      .from('notes')
      .insert({ user_id: user.id, label: fileName, full_path: fullPath })
      .select('*')
      .single();
    console.log('create note', note);
    return note.data;
  };

  const addFile = async (path: string, itemName: string) => {
    const noteListCopy = [...noteList];
    const treeViewCopy = [...treeView];
    const foundDir = addResource(path, treeViewCopy);
    const fileName = `${itemName}.md`;
    const fullPath = `${path}/${fileName}`;
    const note = await createNote(fileName, fullPath);
    foundDir.children.push(note);
    setTreeView(treeViewCopy);
    noteListCopy.push(note);
    setNoteList(noteListCopy);
    router.push('/notes/' + fullPath);
  };

  const createDirectory = async (fileName: string, fullPath: string) => {
    const client = browserClient();
    const dir = await client
      .from('directories')
      .insert({ user_id: user.id, label: fileName, full_path: fullPath })
      .select('*')
      .single();
    console.log('create dir', dir);
    return dir.data;
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
    if (
      params.notePath &&
      params.notePath.length &&
      Array.isArray(params.notePath)
    ) {
      const notePath: string[] = params.notePath;
      const found = noteList.find(
        (note: any) => note.full_path === notePath.join('/')
      );
      found && found.id !== initialSelectedId && setInitialSelectedId(found.id);
    }
  }, [params, router]);

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
