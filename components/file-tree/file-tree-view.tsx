'use client';
import { useDbAdapter } from '@/server/dbAdapter';
import { ScrollArea } from '@radix-ui/react-scroll-area';
// import 'react-nestable/dist/styles/index.css';
import { SortableTree } from './sortable/components/SortableTree';
// import { useSelectedItemStore } from '@/lib/use-selected-item';
import { Tree } from '@/server/types';

export default function FileTreeView({
  updateDirectory,
  directory,
}: {
  updateDirectory: any;
  directory: any;
}) {
  // const { selectedItem, setSelectedItem } = useSelectedItemStore(
  //   (state) => state
  // );

  // const isMobile = useIsMobile();
  // const setOpenMobile = useSidebarStore((state) => state.setOpenMobile);
  // const [tree, setTree] = useState(treeView);

  const dbAdapter = useDbAdapter();

  // if (!directory.tree?.length) return null;

  const onTreeUpdate = (tree: Tree) => {
    updateDirectory(tree);
    dbAdapter.update('directories', { id: directory.id, tree });
  };

  if (!directory.tree?.length) return null;

  return (
    <div className="w-full h-full px-2 pb-8">
      <ScrollArea>
        <SortableTree
          collapsible
          defaultItems={directory.tree?.length ? directory.tree : []}
          onTreeUpdate={onTreeUpdate}
        />
      </ScrollArea>
    </div>
  );
}
