import { useSelectedItemStore } from '@/lib/use-selected-item';
import { TreeItem } from '@/server/types';

type FileTreeItemProps = {
  item: TreeItem;
  handler: any;
  collapseIcon: any;
};
export default function FileTreeItem({
  item,
  handler,
  collapseIcon,
}: FileTreeItemProps) {

  const { setSelectedItem, selectedItem } = useSelectedItemStore(
    (state) => state
  );

  const handleSelect = () => setSelectedItem(item);

  const selectedClass =
    selectedItem?.id === item.id ? 'bg-[#e2ecfd] rounded-[2px] pr-2' : '';
  return (
    <div id="tree-item" className={`relative cursor-pointer text-lg md:text-sm`} onClick={handleSelect}>
      {handler}
      <div className={`flex ${selectedClass}`}>
        <div className="self-center mr-1 flex [&>span]:flex">
          {collapseIcon}
        </div>
        <span className="truncate self-center">{item.label}</span>
      </div>
    </div>
  );
}
