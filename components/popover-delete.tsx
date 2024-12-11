'use client';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { TooltipWrap } from './tooltip-wrap';
import { useSelectedItemStore } from '@/lib/use-selected-item';
import { FileX, FolderX } from 'lucide-react';
import { Tree } from '@/server/types';
// import { useDbAdapter } from '@/server/dbAdapter';
import { browserClient } from '@/utils/supabase/client';

function removeByIdAndCollectIds(
  data: Tree,
  targetId: string
): { idsToDelete: string[]; data: Tree | null } {
  let idsToDelete: string[] = [];

  const collectIds = (children: Tree): string[] =>
    children.flatMap((child) => [
      child.id,
      ...(child.children ? collectIds(child.children) : []),
    ]);

  const updatedData = data
    .map((item) => {
      if (item.id === targetId) {
        if (item.children) idsToDelete.push(...collectIds(item.children));
        return null; // Remove this item
      }

      const children = item.children
        ? removeByIdAndCollectIds(item.children, targetId)
        : { data: item.children, idsToDelete };

      idsToDelete.push(...children.idsToDelete);

      return { ...item, children: children.data };
    })
    .filter(Boolean);

  //@ts-ignore
  return { idsToDelete, data: updatedData };
}

export default function PopoverDelete({
  directory,
  updateDirectory,
}: {
  updateDirectory: any;
  directory: any;
}) {
  // const dbAdapter = useDbAdapter();

  const [open, setOpen] = useState(false);
  const { selectedItem, clearSelectedItem } = useSelectedItemStore(
    (state) => state
  );

  const client = browserClient();

  const handleDelete = async () => {
    setOpen(false);

    const { data, idsToDelete } = removeByIdAndCollectIds(
      directory.tree,
      selectedItem!.id
    );

    updateDirectory(data);
    await client
      .from('directories')
      .update({ tree: data })
      .eq('id', directory.id);
    const ids = idsToDelete?.length ? idsToDelete : [selectedItem!.id];
    await client.from('notes').delete().in('id', ids);
    clearSelectedItem();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipWrap text="Delete" side="bottom">
        <Button
          variant="outline"
          size="iconsm"
          disabled={!selectedItem}
          onClick={() => setOpen(true)}
        >
          {selectedItem?.type === 'note' ? (
            <FileX className="size w-4" />
          ) : (
            <FolderX className="size w-4" />
          )}
        </Button>
      </TooltipWrap>
      <PopoverTrigger />

      <PopoverContent className="w-full min-w-52 border-[#d59999]">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none text-center">
            Delete{' '}
            {selectedItem?.type === 'note'
              ? 'note '
              : 'all notes in directory '}
            {selectedItem?.label}?
          </h4>

          <div className="text-center">Are you sure?</div>
          <Button onClick={handleDelete} size="sm" variant="destructive">
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
