import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTriggerChevron,
} from '@/components/ui/dropdown-menu';
import {
  ALargeSmall,
  CaseLower,
  CaseUpper,
  Strikethrough,
  Subscript,
  Superscript,
  Trash2,
} from 'lucide-react';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { clearFormatting } from '../../utils/clear-formatting';
import { SHORTCUTS } from '../shortcuts/shortcuts';
import {
  FormatDropdownItem,
  SharedFormatDropdownProps,
} from './format-dropdown-item';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';

interface FormatDropdownItemProps extends SharedFormatDropdownProps {
  command: string;
  stateKey: string;
}

const items: FormatDropdownItemProps[] = [
  {
    command: 'lowercase',
    stateKey: 'isLowercase',
    label: 'Lowercase',
    shortcut: 'LOWERCASE',
    Icon: CaseLower,
  },
  {
    command: 'uppercase',
    stateKey: 'isUppercase',
    label: 'Uppercase',
    shortcut: 'UPPERCASE',
    Icon: CaseUpper,
  },
  {
    command: 'capitalize',
    stateKey: 'isCapitalize',
    label: 'Capitalize',
    shortcut: 'CAPITALIZE',
    Icon: ALargeSmall,
  },
  {
    command: 'strikethrough',
    stateKey: 'isStrikethrough',
    label: 'Strikethrough',
    shortcut: 'STRIKETHROUGH',
    Icon: Strikethrough,
  },
  {
    command: 'subscript',
    stateKey: 'isSubscript',
    label: 'Subscript',
    shortcut: 'SUBSCRIPT',
    Icon: Subscript,
  },
  {
    command: 'superscript',
    stateKey: 'isSuperscript',
    label: 'Superscript',
    shortcut: 'SUPERSCRIPT',
    Icon: Superscript,
  },
];

export function Decoration({ editor, disabled, toolbarState }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTriggerChevron className="toolbar-item spaced" disabled={disabled}>
        <ALargeSmall className="h-4 w-4" />
      </DropdownMenuTriggerChevron>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        {items.map((item) => (
          <FormatDropdownItem
            key={item.label}
            label={item.label}
            shortcut={item.shortcut}
            activeClass={toolbarState[item.stateKey] ? 'dropdown-item-active' : ''}
            Icon={item.Icon}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, item.command);
            }}
          />
        ))}

        <DropdownMenuItem
          onClick={() => clearFormatting(editor)}
          className="flex justify-between"
          title="Clear text formatting"
          aria-label="Clear all text formatting"
        >
          <div className="flex">
            <Trash2 className="size-4 self-center" />
            <span className="self-center ml-2">Clear Formatting</span>
          </div>
          <span className="text-xs text-foreground/70 ml-2">
            {SHORTCUTS.CLEAR_FORMATTING}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
