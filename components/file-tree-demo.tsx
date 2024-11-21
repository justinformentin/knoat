'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'

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

export function FileTreeDemo({notes, noteList}:{notes: any, noteList: any}) {


  const [list, setList] = useState(noteList);

  const addFile = (path: string) => {
    const listCopy = [...list];

    const findPath = (paths: string[], dir: any) => {
      const remainingPaths = [...paths];
      const nextPath = remainingPaths.shift();
      const foundDir = dir.find((item: any) => item.label === nextPath);
      if (foundDir) {
        if (remainingPaths.length) {
          return findPath(remainingPaths, foundDir.children);
        } else {
          const time = String(new Date().getTime()).slice(-5);
          const fileName = 'new-file' + time + '.md';
          foundDir.children.push({
            id: new Date().toISOString(),
            label: fileName,
            fileName,
            fullPath: `${path}/${fileName}`,
          });
          setList(listCopy);
        }
      }
    };

    const pathSplit = path.split('/');
    findPath(pathSplit, listCopy);
  };

  const addDirectory = (path: string) => {
    const listCopy = [...list];

    const findPath = (paths: string[], dir: any) => {
      const remainingPaths = [...paths];
      const nextPath = remainingPaths.shift();
      const foundDir = dir.find((item: any) => item.label === nextPath);
      if (foundDir) {
        if (remainingPaths.length) {
          return findPath(remainingPaths, foundDir.children);
        } else {
          foundDir.children.push({
            id: new Date().toISOString(),
            label: 'New-Directory',
            fullPath: path + '/New-Directory',
            children: [],
          });
          setList(listCopy);
        }
      }
    };

    const pathSplit = path.split('/');
    findPath(pathSplit, listCopy);
  };
  const router = useRouter()

 const fileClick = (item:any) => {
    router.push(`#${item.fullPath}`)
 }

  const renderDirectory = (item: any) => {
    if (item.fileName) {
      return (
        <File value={item.id} key={item.id} handleSelect={()=>fileClick(item)}>
          <p>{item.fileName}</p>
        </File>
      );
    } else if (item.children) {
      return (
        <Folder
          key={item.id}
          value={item.id}
          element={item.label}
          newDirClick={() => addDirectory(item.fullPath)}
          newFileClick={() => addFile(item.fullPath)}
        >
          {item.children.map(renderDirectory)}
        </Folder>
      );
    }
    return null;
  };

  const [initialSelectedId, setInitialSelectedId] = useState<string | undefined>();
  const params = useParams()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const found = notes.find((note:any) => note.fullPath === hash)
      found && found.id !== initialSelectedId && setInitialSelectedId(found.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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
