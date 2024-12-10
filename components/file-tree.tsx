'use client';
import { useCallback, useMemo, useState } from 'react';
import { GeneratedDir, Note, TreeViewDirectory } from '@/server/types';
import { useDataStore } from '@/lib/use-data';
import FileTreeView from './file-tree-view';
import { SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import FilterDropdown, { SortKeys } from './popover-sort';
import { FuzzySearch } from './fuzzy-search';
import FileTreeHeaderOptions from './file-tree-header-options';

export default function FileTree() {

  const [sortKey, setSortKey] = useState<SortKeys>(SortKeys.Alphabetically);
  const { notes, treeView } = useDataStore((state) => state);

  console.log('FILLE TREE treeView', treeView);
  console.log('FILLE TREE notes', notes);

  const sortFunc = useCallback(
    (a: GeneratedDir | Note, b: GeneratedDir | Note) => {
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
    },
    [sortKey]
  );

  const sortedTreeView = useMemo(() => {
    const walkTree = (arr: TreeViewDirectory): TreeViewDirectory =>
      arr.map((item: Note | GeneratedDir) =>
        // @ts-ignore Type error will be fixed when changing the note/dir types
        item.children ? { ...item, children: walkTree(item.children.sort(sortFunc)) } : item
      );

    return walkTree(treeView.sort(sortFunc));
  }, [sortKey, treeView]);

  return (
    <>
      <SidebarHeader>
        <div className="w-full">
          <FuzzySearch notes={notes} />
        </div>
        <div className="flex justify-center w-full space-x-2">
          <FileTreeHeaderOptions />
          <FilterDropdown sortKey={sortKey} setSortKey={setSortKey} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background">
          <FileTreeView notes={notes} treeView={sortedTreeView} />
        </div>
      </SidebarContent>
    </>
  );
}
