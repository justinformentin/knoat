import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pencil } from '@/components/loaders/pencil';

const buttons = [
  { label: 'Improve writing', action: 'Improve this writing: ' },
  { label: 'Make shorter', action: 'Make this writing shorter: ' },
  { label: 'Make longer', action: 'Make this writing longer: ' },
  { label: 'Summarize', action: 'Summarize this writing: ' },
  { label: 'Casual tone', action: 'Make this writing more casual: ' },
  { label: 'Serious tone', action: 'Make this writing more serious: ' },
];

type AIPopupButtonsProps = {
  open: boolean;
  loading: boolean;
  buttonRef: any;
  location: { x: number; y: number };
  openDropdown: () => void;
  replaceText: (text: string) => void;
};

export default function AIPopupButtons({
  open,
  loading,
  buttonRef,
  location,
  openDropdown,
  replaceText,
}: AIPopupButtonsProps) {
  return (
    <div
      ref={buttonRef}
      className="absolute z-50"
      style={{
        left: `${location.x + 5}px`,
        top: `${location.y + 5}px`,
      }}
    >
      {loading ? (
        <>
          <Pencil />
        </>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="size-8 p-1 rounded-md cursor-pointer"
        >
          <Sparkles
            className="size-5 stroke-purple-500 fill-purple-300"
            onClick={openDropdown}
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
  );
}
