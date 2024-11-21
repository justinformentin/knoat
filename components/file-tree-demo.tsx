'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useState } from 'react';

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

export function FileTreeDemo() {
  const initialList = [
    {
      id: '1',
      label: 'notes-one',
      fullPath: 'notes-one',
      children: [
        {
          id: '2',
          fullPath: 'notes-one/inner-notes-1',
          label: 'inner-notes-1',
          children: [
            {
              id: '4',
              label: 'todo.md',
              fileName: 'todo.md',
              fullPath: 'notes-one/inner-notes/inner-todo.md',
            },
            {
              id: '5',
              label: 'tasks.md',
              fileName: 'tasks.md',
              fullPath: 'notes-one/inner-notes/inner-tasks.md',
            },
          ],
        },
        {
          id: '3',
          label: 'todo.md',
          fileName: 'todo.md',
          fullPath: 'notes-one/todo.md',
        },
      ],
    },
    {
      id: '6',
      label: 'notes-two',
      fullPath: 'notes-two',
      children: [
        {
          id: '7',
          label: 'other-note.md',
          fileName: 'other-note.md',
          fullPath: 'notes-two/other-note.md',
        },
      ],
    },
  ];

  const [list, setList] = useState(initialList);

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
            fullPath: path + fileName,
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

  console.log('list', list);
  const renderDirectory = (item: any) => {
    if (item.fileName) {
      return (
        <File value={item.id} key={item.id}>
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

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
      <Tree
        className="p-2 overflow-hidden rounded-md bg-background"
        initialSelectedId="2"
        initialExpandedItems={
          [
            //   '1',
            //   '2',
            //   '3',
            //   '4',
            //   '5',
            //   '6',
            //   '7',
            //   '8',
            //   '9',
            //   '10',
            //   '11',
          ]
        }
        elements={ELEMENTS}
      >
        {list.map(renderDirectory)}
      </Tree>
    </div>
  );
}

const ELEMENTS = [
  {
    id: '1',
    isSelectable: true,
    name: 'src',
    children: [
      {
        id: '2',
        isSelectable: true,
        name: 'app',
        children: [
          {
            id: '3',
            isSelectable: true,
            name: 'layout.tsx',
          },
          {
            id: '4',
            isSelectable: true,
            name: 'page.tsx',
          },
        ],
      },
      {
        id: '5',
        isSelectable: true,
        name: 'components',
        children: [
          {
            id: '6',
            isSelectable: true,
            name: 'header.tsx',
          },
          {
            id: '7',
            isSelectable: true,
            name: 'footer.tsx',
          },
        ],
      },
      {
        id: '8',
        isSelectable: true,
        name: 'lib',
        children: [
          {
            id: '9',
            isSelectable: true,
            name: 'utils.ts',
          },
        ],
      },
    ],
  },
];
