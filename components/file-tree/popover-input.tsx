'use client';
import { KeyboardEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { TooltipWrap } from '../tooltip-wrap';
import { FolderPlus, SquarePen } from 'lucide-react';

export default function PopoverInput({ text, confirmCallback }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const confirmInput = () => {
    confirmCallback(inputRef.current!.value);
    setOpen(false);
    inputRef.current!.value = '';
  };

  const onKeyDownCapture = (e: KeyboardEvent) => {
    e.key === 'Enter' && confirmInput();
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <TooltipWrap side="bottom" text={'New ' + text}>
        <Button variant="outline" size="iconsm" onClick={() => setOpen(true)}>
          {text === 'Note' ? (
            <SquarePen className="size-4" />
          ) : (
            <FolderPlus className="size-4" />
          )}
        </Button>
      </TooltipWrap>
      <PopoverTrigger />

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create new {text}</h4>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Input
              id="name"
              ref={inputRef}
              placeholder={`Enter ${text} name`}
              className="col-span-2 h-8"
              onKeyDownCapture={onKeyDownCapture}
            />
            <Button onClick={confirmInput} size="sm" variant="outline">
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
