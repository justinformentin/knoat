'use client';
import { File, Folder, Tree } from '@/components/ui/file-tree';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useIsMobile } from '@/lib/use-is-mobile';
import { useSidebarStore } from '@/lib/use-sidebar';
import { GeneratedDir, Note } from '@/server/types';

export default function FileTreeView({
  notes,
  treeView,
}: {
  notes: any;
  treeView: any;
}) {
  const params = useParams();

  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >();

  const isMobile = useIsMobile();

  const setOpenMobile = useSidebarStore((state) => state.setOpenMobile);

  useEffect(() => {
    if (
      params.notePath &&
      params.notePath.length &&
      Array.isArray(params.notePath)
    ) {
      const np = params.notePath.join('/');

      if (
        notes?.length
        // && notePath !== np
      ) {
        const found = notes.find((note: any) => note.full_path === np);
        found &&
          found.id !== initialSelectedId &&
          setInitialSelectedId(found.id);
        // setNotePath(np);
      }
    }
  }, [params, notes, treeView]);

  if (!treeView?.length) return null;

  const renderDirectory = (item: Note | GeneratedDir) => {
    if (item.label.slice(-3) === '.md') {
      return (
        <Link
          href={'/app/notes/' + item.full_path}
          key={item.id}
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <File
            item={item}
            value={item.id}
            isSelect={item.id === initialSelectedId}
            className="ml-[15px]"
          >
            <p>{item.label}</p>
          </File>
        </Link>
      );
      // @ts-ignore Type error will be fixed when note/dir types change
    } else if (item.children) {
      return (
        <Folder key={item.id} value={item.id} element={item.label} item={item}>
          {/* @ts-ignore Type error will be fixed when note/dir types change */}
          {item.children.map(renderDirectory)}
        </Folder>
      );
    }
  };
  return (
    <Tree
      className="p-2 overflow-hidden rounded-md bg-background"
      initialSelectedId={initialSelectedId}
      elements={treeView}
    >
      {treeView.map(renderDirectory)}
    </Tree>
  );
}
