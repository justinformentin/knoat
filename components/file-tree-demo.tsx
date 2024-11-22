'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { browserClient } from '@/utils/supabase/client';

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
  noteList,
}: {
  user: any;
  notes: any;
  noteList: any;
}) {
  const params = useParams();

  const [list, setList] = useState(noteList);

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
    const dir = await client
      .from('notes')
      .insert({ user_id: user.id, label: fileName, full_path: fullPath });
    console.log('create dir', dir);
  };

  const addFile = (path: string) => {
    const listCopy = [...list];
    const foundDir = addResource(path, listCopy);

    const time = String(new Date().getTime()).slice(-5);
    const fileName = 'new-file' + time + '.md';
    const fullPath = `${path}/${fileName}`;
    foundDir.children.push({
      id: new Date().toISOString(),
      label: fileName,
      fileName,
      fullPath,
    });
    setList(listCopy);
    createNote(fileName, fullPath);
  };

  const createDirectory = async (fileName: string, fullPath: string) => {
    const client = browserClient();
    const dir = await client
      .from('directories')
      .insert({ user_id: user.id, label: fileName, full_path: fullPath });
    console.log('create dir', dir);
  };

  const addDirectory = (path: string) => {
    const listCopy = [...list];
    const foundDir = addResource(path, listCopy);
    const time = String(new Date().getTime()).slice(-5);
    const fileName = 'new-directory' + time;
    const fullPath = `${path}/${fileName}`;
    foundDir.children.push({
      id: new Date().toISOString(),
      label: fileName,
      fullPath,
      children: [],
    });
    setList(listCopy);
    createDirectory(fileName, fullPath);
  };

  const renderDirectory = (item: any) => {
    if (item.children) {
      return (
        <Folder
          key={item.id}
          value={item.id}
          element={item.label}
          newDirClick={() => addDirectory(item.full_path)}
          newFileClick={() => addFile(item.full_path)}
        >
          {item.children.map(renderDirectory)}
        </Folder>
      );
    } else {
      return (
        <Link href={'/notes/' + item.full_path} key={item.id}>
          <File value={item.id}>
            <p>{item.label}</p>
          </File>
        </Link>
      );
    }
  };

  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >();

  console.log('file tree params', params);
  useEffect(() => {
    if (
      params.notePath &&
      params.notePath.length &&
      Array.isArray(params.notePath)
    ) {
      const notePath: string[] = params.notePath;
      const found = notes.find(
        (note: any) => note.full_path === notePath.join('/')
      );
      found && found.id !== initialSelectedId && setInitialSelectedId(found.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
      <Tree
        className="p-2 overflow-hidden rounded-md bg-background"
        initialSelectedId={initialSelectedId}
        elements={list}
      >
        {list.map(renderDirectory)}
      </Tree>
    </div>
  );
}
