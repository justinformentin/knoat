'use client';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';

export default function PopoverDelete({ text, confirmCallback, children }: any) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full min-w-52 border-[#d59999]">
        <div className="grid gap-4">
            <h4 className="font-medium leading-none text-center">Delete {text}</h4>

            <div className="text-center">Are you sure?</div>
            <Button
              onClick={() => {
                confirmCallback(confirmCallback);
                setOpen(false);
              }}
              size="sm"
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
      </PopoverContent>
    </Popover>
  );
}
