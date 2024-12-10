'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { ArrowDownNarrowWide } from 'lucide-react';

export enum SortKeys {
  Alphabetically = 'Alphabetically',
  AlphabeticallyReversed = 'AlphabeticallyReversed',
  Created = 'Created',
  CreatedReversed = 'CreatedReversed',
  Updated = 'Updated',
  UpdatedReversed = 'UpdatedReversed',
}
export default function SortDropdown({ sortKey, setSortKey }: any) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="iconsm"><ArrowDownNarrowWide className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Notes By:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortKey} onValueChange={setSortKey}>
          <DropdownMenuRadioItem value={SortKeys.Alphabetically}>Alphabetically</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.AlphabeticallyReversed}>Alphabetically Reversed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.Created}>Created</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.CreatedReversed}>Created Reversed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.Updated}>Updated</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortKeys.UpdatedReversed}>Updated Reversed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
