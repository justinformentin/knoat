'use client';
import { Bot } from 'lucide-react';
import { useCompletion } from 'ai/react';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TooltipWrap } from '@/components/tooltip-wrap';
import { Textarea } from '@/components/ui/text-area';

export default function AIToolbarPrompt({
  editorRef,
  saveNote,
}: {
  editorRef: any;
  saveNote: (md: string) => void;
}) {
  const editorCurr = useRef('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);

  const { completion, complete } = useCompletion({
    api: '/api/text-stream',
  });

  useEffect(() => {
    if (completion) {
      editorRef.current.setMarkdown(editorCurr.current + '\n\n' + completion);
    }
  }, [completion]);

  const submitPrompt = async (prompt: string) => {
    await complete(prompt);
    editorCurr.current = editorRef.current.getMarkdown();
    saveNote(editorCurr.current);
  };

  useEffect(() => {
    if (editorRef?.current) {
      editorCurr.current = editorRef.current.getMarkdown();
    }
  }, [editorRef]);

  const confirmInput = () => {
    submitPrompt(inputRef.current!.value);
    setOpen(false);
    inputRef.current!.value = '';
  };

  const onKeyDownCapture = (e: KeyboardEvent) => {
    e.key === 'Enter' && confirmInput();
  };

  const handleClose = () => {
    setOpen(false);
    inputRef.current!.value = '';
  };
  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal>
        <TooltipWrap side="bottom" text={'AI Prompt'}>
          <Button variant="ghost" size="iconsm" onClick={() => setOpen(true)}>
            <Bot className="size-4" />
          </Button>
        </TooltipWrap>
        <PopoverTrigger />

        <PopoverContent className="w-[30rem]" align={'start'} alignOffset={-50}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Textarea
                id="name"
                ref={inputRef}
                rows={4}
                placeholder="Enter prompt"
                className="col-span-2"
                onKeyDownCapture={onKeyDownCapture}
              />
              <Button onClick={handleClose} size="sm" variant="outline">
                Cancel
              </Button>
              <Button onClick={confirmInput} size="sm" className="bg-blue-500">
                Generate
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
