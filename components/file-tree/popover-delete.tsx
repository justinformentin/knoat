'use client';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { TooltipWrap } from '../tooltip-wrap';
import { useSelectedItemStore } from '@/lib/use-selected-item';
import { FileX, FolderX } from 'lucide-react';
import { Tree } from '@/server/types';
import { useDeleteNote, useUpdateDirectory } from '@/lib/db-adapter';

function removeByIdAndCollectIds(
  data: Tree,
  targetId: string
): { idsToDelete: string[]; data: Tree } {
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

export default function PopoverDelete({ directory }: { directory: any }) {
  const [open, setOpen] = useState(false);
  const { selectedItem, clearSelectedItem } = useSelectedItemStore(
    (state) => state
  );

  const updateDirectory = useUpdateDirectory();
  const deleteNotes = useDeleteNote();

  const handleDelete = async () => {
    setOpen(false);

    const { data, idsToDelete } = removeByIdAndCollectIds(
      directory.tree,
      selectedItem!.id
    );

    updateDirectory({tree: data });

    const ids = idsToDelete?.length ? idsToDelete : [selectedItem!.id];
    deleteNotes(ids);

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
