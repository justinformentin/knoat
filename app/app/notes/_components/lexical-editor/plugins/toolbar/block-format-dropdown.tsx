import { LexicalEditor } from 'lexical';
import { blockTypeToBlockName } from './toolbar-context';
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListChecks,
  ListOrdered,
  MessageSquareQuote,
  Text,
} from 'lucide-react';
import {
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from './utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTriggerChevron,
} from '@/components/ui/dropdown-menu';
import { FormatDropdownItem } from './format-dropdown-item';
import { SHORTCUTS } from '../shortcuts/shortcuts';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';

type BlockFormatItem = {
  label: string;
  onClick: () => void;
  shortcut: keyof typeof SHORTCUTS;
  stateKey: keyof typeof blockTypeToBlockName;
};
type IconsType = Record<keyof typeof blockTypeToBlockName, any>;

export function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const icons: IconsType = {
    paragraph: Text,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    bullet: List,
    number: ListOrdered,
    check: ListChecks,
    quote: MessageSquareQuote,
    code: Code,
    h4: null,
    h5: null,
    h6: null,
  };
  const items: BlockFormatItem[] = [
    {
      stateKey: 'paragraph',
      label: 'Normal',
      shortcut: 'NORMAL',
      onClick: () => formatParagraph(editor),
    },
    {
      stateKey: 'h1',
      label: 'Heading 1',
      shortcut: 'HEADING1',
      onClick: () => formatHeading(editor, blockType, 'h1'),
    },
    {
      stateKey: 'h2',
      label: 'Heading 2',
      shortcut: 'HEADING2',
      onClick: () => formatHeading(editor, blockType, 'h2'),
    },
    {
      stateKey: 'h3',
      label: 'Heading 3',
      shortcut: 'HEADING3',
      onClick: () => formatHeading(editor, blockType, 'h3'),
    },
    {
      stateKey: 'bullet',
      label: 'Bullet List',
      shortcut: 'BULLET_LIST',
      onClick: () => formatBulletList(editor, blockType),
    },
    {
      stateKey: 'number',
      label: 'Numbered List',
      shortcut: 'NUMBERED_LIST',
      onClick: () => formatNumberedList(editor, blockType),
    },

    {
      stateKey: 'check',
      label: 'Check List',
      shortcut: 'CHECK_LIST',
      onClick: () => formatCheckList(editor, blockType),
    },
    {
      stateKey: 'quote',
      label: 'Quote',
      shortcut: 'QUOTE',
      onClick: () => formatQuote(editor, blockType),
    },
    {
      stateKey: 'code',
      label: 'Code Block',
      shortcut: 'CODE_BLOCK',
      onClick: () => formatCode(editor, blockType),
    },
  ];
  const ActiveIcon = icons[blockType];
  return (
    <DropdownMenu>
      <DropdownMenuTriggerChevron className="toolbar-item spaced" disabled={disabled}>
        <ActiveIcon className="size-4" />
      </DropdownMenuTriggerChevron>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        {items.map((item) => (
          <FormatDropdownItem
            key={item.label}
            label={item.label}
            shortcut={item.shortcut}
            activeClass={blockType === item.stateKey ? 'dropdown-item-active' : ''}
            Icon={icons[item.stateKey]}
            onClick={item.onClick}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
