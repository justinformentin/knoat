'use client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { SortableTree } from './sortable/components/SortableTree';
import { Tree } from '@/server/types';
import { useUpdateDirectory } from '@/lib/db-adapter';

export default function FileTreeView({ directory }: { directory: any }) {
  const updateDirectory = useUpdateDirectory();
  // Just updates the structures of the tree
  const onTreeUpdate = (tree: Tree) => updateDirectory({ tree });

  if (!directory?.tree?.length) return null;

  return (
    <div className="w-full h-full px-2 pb-8">
      <ScrollArea>
        <SortableTree
          collapsible
          defaultItems={directory?.tree?.length ? directory.tree : []}
          onTreeUpdate={onTreeUpdate}
        />
      </ScrollArea>
    </div>
  );
}
