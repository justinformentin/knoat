'use client';
import { useSelectedText } from './use-selected-text';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOutsideClick } from '@/lib/use-outside-click';
import { useRef, useState } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const buttons = [
  { label: 'Improve writing', action: 'Improve this writing: ' },
  { label: 'Make shorter', action: 'Make this writing shorter: ' },
  { label: 'Make longer', action: 'Make this writing longer: ' },
  { label: 'Summarize', action: 'Summarize this writing: ' },
  { label: 'Casual tone', action: 'Make this writing more casual: ' },
  { label: 'Serious tone', action: 'Make this writing more serious: ' },
];

export default function AIPopup() {
  const selectedText = useSelectedText();

  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClick = () => setOpen(true);

  useOutsideClick(buttonRef, () => setOpen(false));

  const replaceText = async (action: string) => {
    const anchorNode = selectedText.selection!.anchorNode;
    setOpen(false);
    setLoading(true);
    anchorNode!.parentElement!.classList.add('animate-pulse', 'bg-gray-400/30');

    const res = await fetch('/api/text-replace', {
      method: 'POST',
      body: JSON.stringify({
        prompt: action + selectedText.text,
      }),
    });
    const json = await res.json();


    const startPos = selectedText.selection!.anchorOffset;
    const endPos = startPos + selectedText.text.length;
    const wholeText = anchorNode!.textContent;
    anchorNode!.textContent =
      wholeText!.slice(0, startPos) + json.text + wholeText!.slice(endPos);
    anchorNode!.parentElement!.classList.remove(
      'animate-pulse',
      'bg-gray-400/30'
    );

    setLoading(false);
  };

  const showButton =
    selectedText?.text && selectedText?.location.x && selectedText?.location.y;
  return showButton ? (
    <div
      ref={buttonRef}
      className="absolute z-50"
      style={{
        left: selectedText.location.x + 'px',
        top: selectedText.location.y + 'px',
      }}
    >
      {loading ? (
        <>
          <LoadingSpinner className="size-6" />
        </>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="size-8 p-1 rounded-md cursor-pointer"
        >
          <Sparkles
            className="size-5 stroke-purple-500 fill-purple-300"
            onClick={onClick}
          />
        </Button>
      )}
      {open ? (
        <div className="bg-background border rounded-md p-1 flex flex-col space-y-1">
          {buttons.map((button) => (
            <button
              key={button.label}
              className="text-left py-[1px] px-2 hover:bg-muted"
              onClick={() => replaceText(button.action)}
            >
              {button.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;
}
