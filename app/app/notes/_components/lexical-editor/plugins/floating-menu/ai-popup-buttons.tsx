import { Sparkles } from 'lucide-react';
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
  openDropdown: () => void;
  replaceText: (text: string) => void;
};

export default function AIPopupButtons({
  open,
  loading,
  openDropdown,
  replaceText,
}: AIPopupButtonsProps) {
  return (
    <>
      {loading ? (
        <>
          <Pencil />
        </>
      ) : (
        <button onClick={openDropdown} className='popup-item spaced'>
          <Sparkles className="self-center size-4 stroke-purple-500 fill-purple-300" />
        </button>
      )}
      {open ? (
        <div className="absolute shadow-md left-0 top-[2.125rem] bg-background border rounded-md p-1 flex flex-col space-y-1">
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
    </>
  );
}
