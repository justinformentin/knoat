'use client';
import { useRef } from 'react';
import Nestable, { NestableProps } from 'react-nestable';
import FileTreeItem from './file-tree-item';
import { ChevronRight } from 'lucide-react';
import { useDbAdapter } from '@/server/dbAdapter';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import 'react-nestable/dist/styles/index.css';

export default function FileTreeView({
  updateDirectory,
  directory,
}: {
  updateDirectory: any;
  directory: any;
}) {
  const refNestable = useRef(null);

  // const isMobile = useIsMobile();
  // const setOpenMobile = useSidebarStore((state) => state.setOpenMobile);
  // const [tree, setTree] = useState(treeView);

  const dbAdapter = useDbAdapter();

  if (!directory.tree?.length) return null;

  const onChange = (e: any) => {
    updateDirectory(e.items);
    dbAdapter.update('directories', { id: directory.id, tree: e.items });
  };

  const renderItem: NestableProps['renderItem'] = (props) => (
    // @ts-ignore
    <FileTreeItem {...props} />
  );

  const renderCollapseIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <ChevronRight
      className={`inline-block self-center size-4 opacity-50 transition-all ${isCollapsed ? '' : 'rotate-90'}`}
    />
  );

  // Don't allow items to be nested under files
  // Right now we're just using the existance of the content property
  // but we might want to change that in the future since we don't
  // need the content property to exist in the tree
  const confirmChange = (dragItem: any) => {
    const dp = dragItem?.destinationParent;
    return !dp?.type || dp?.type !== 'note';
  };

  return (
    <div className="w-full h-full px-2">
      <ScrollArea>
        <Nestable
          items={directory.tree}
          collapsed={false}
          disableCollapse={false}
          renderCollapseIcon={renderCollapseIcon}
          disableDrag={false}
          renderItem={renderItem}
          ref={refNestable}
          onChange={onChange}
          confirmChange={confirmChange}
        />
      </ScrollArea>
    </div>
  );
}
