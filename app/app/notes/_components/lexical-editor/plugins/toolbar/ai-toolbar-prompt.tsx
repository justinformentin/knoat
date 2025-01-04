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
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  ParagraphNode,
} from 'lexical';

export function AIToolbarPrompt() {
  const [editor] = useLexicalComposerContext();
  const prevCompletionLength = useRef<number | null>(null);
  const pnode = useRef<ParagraphNode | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);

  const { completion, complete } = useCompletion({
    api: '/api/text-stream',
  });

  useEffect(() => {
    if (completion) {
      editor.update(() => {
        // If there is no node, we create the node and save it
        if (!pnode.current) {
          const paragraphNode = $createParagraphNode();
          pnode.current = paragraphNode;
        }

        // The completion comes in chunks, so we set the text as the 
        // completion minus the cumulative previous chunks so the text
        // gets added one chunk at a time
        const text = prevCompletionLength.current
          ? completion.slice(prevCompletionLength.current)
          : completion;

        const textNode = $createTextNode(text);
        pnode.current.append(textNode);

        // If this is the first completion chunk, append the paragraph node to the editor
        if (!prevCompletionLength.current) {
          const root = $getRoot();
          root.append(pnode.current);
        }
        prevCompletionLength.current = completion.length;
      });
    }
  }, [completion]);

  const submitPrompt = async (prompt: string) => {
    await complete(prompt);
    pnode.current = null;
    prevCompletionLength.current = null;
  };

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
