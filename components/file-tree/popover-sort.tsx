'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { ArrowDownNarrowWide } from 'lucide-react';
import { useState } from 'react';
import { TooltipWrap } from '../tooltip-wrap';

export enum SortKeys {
  Alphabetically = 'Alphabetically',
  AlphabeticallyReversed = 'AlphabeticallyReversed',
  Created = 'Created',
  CreatedReversed = 'CreatedReversed',
  Updated = 'Updated',
  UpdatedReversed = 'UpdatedReversed',
}
export default function SortDropdown({ sortList }: any) {
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState(SortKeys.Alphabetically);

  const onValueChange = (key: string) => {
    setSortKey(key as SortKeys);
    sortList(key);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipWrap side="bottom" text="Sort">
        <Button variant="outline" size="iconsm" onClick={() => setOpen(true)}>
          <ArrowDownNarrowWide className="h-4 w-4" />
        </Button>
      </TooltipWrap>
      <DropdownMenuTrigger />
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Notes By:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortKey} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value={SortKeys.Alphabetically}>
            Alphabetically
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.AlphabeticallyReversed}>
            Alphabetically Reversed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.Created}>
            Created
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.CreatedReversed}>
            Created Reversed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.Updated}>
            Updated
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.UpdatedReversed}>
            Updated Reversed
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
