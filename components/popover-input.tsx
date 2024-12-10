'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';

export default function PopoverInput({ text, confirmCallback, children }: any) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const itemNameChange = (e: any) => setItemName(e.target.value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create new {text}</h4>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Input
              id="name"
              placeholder={`Enter ${text} name`}
              value={itemName}
              onChange={itemNameChange}
              className="col-span-2 h-8"
            />
            <Button
              onClick={() => {
                confirmCallback(itemName);
                setItemName('');
                setOpen(false);
              }}
              size="sm"
              variant="outline"
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
