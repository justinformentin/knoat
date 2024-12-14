'use client';
import { Tree, TreeItem } from '@/server/types';
import { useDataStore } from '@/lib/use-data';
import FileTreeView from './file-tree-view';
import { SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import FilterDropdown, { SortKeys } from './popover-sort';
import { FuzzySearch } from './fuzzy-search';
import FileTreeHeaderOptions from './file-tree-header-options';
import PopoverDelete from './popover-delete';
import { useSelectedItemStore } from '@/lib/use-selected-item';

export default function FileTree() {
  const updateDirectory = useDataStore((state) => state.updateDirectory);
  const directory = useDataStore((state) => state.directory);
  const clearSelectedItem = useSelectedItemStore(
    (state) => state.clearSelectedItem
  );

  const sortFunc = (a: TreeItem, b: TreeItem, sortKey: SortKeys) => {
    // if (sortKey === SortKeys.Alphabetically)
    //   return a.label.localeCompare(b.label);
    if (sortKey === SortKeys.AlphabeticallyReversed)
      return b.label.localeCompare(a.label);
    if (sortKey === SortKeys.Created)
      return a.created_at.localeCompare(b.created_at);
    if (sortKey === SortKeys.CreatedReversed)
      return b.created_at.localeCompare(a.created_at);
    if (sortKey === SortKeys.Updated && a.updated_at && b.updated_at)
      return a.updated_at.localeCompare(b.updated_at);
    if (sortKey === SortKeys.UpdatedReversed && a.updated_at && b.updated_at)
      return b.updated_at.localeCompare(a.updated_at);

    return a.label.localeCompare(b.label);
  };

  const updateSorting = (sortKey: SortKeys) => {
    const walkTree = (arr: Tree): Tree =>
      arr.map((item) =>
        item.children
          ? {
              ...item,
              children: walkTree(
                item.children.sort((a, b) => sortFunc(a, b, sortKey))
              ),
            }
          : item
      );
    const sortedList = walkTree(
      directory.tree.sort((a, b) => sortFunc(a, b, sortKey))
    );
    updateDirectory(sortedList);
  };

  // Clicking inside the tree container, but not a tree-item
  // will clear the selected item selection
  const handleOutsideClick = (e: any) =>
    !e.target.closest('#tree-item') && clearSelectedItem();

  return (
    <>
      <SidebarHeader>
        <div className="w-full">
          <FuzzySearch />
        </div>
        <div className="flex justify-center w-full space-x-2">
          <FileTreeHeaderOptions />
          <FilterDropdown sortList={updateSorting} />
          <PopoverDelete
            directory={directory}
            updateDirectory={updateDirectory}
          />
        </div>
      </SidebarHeader>
      <SidebarContent onClick={handleOutsideClick}>
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
          <FileTreeView
            directory={directory}
            updateDirectory={updateDirectory}
          />
        </div>
      </SidebarContent>
    </>
  );
}
