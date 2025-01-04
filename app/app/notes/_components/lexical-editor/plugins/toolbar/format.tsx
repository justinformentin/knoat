'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTriggerChevron,
} from '@/components/ui/dropdown-menu';

import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
} from 'lexical';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';
import {
  FormatDropdownItem,
  SharedFormatDropdownProps,
} from './format-dropdown-item';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';

interface FormatDropdownItemProps extends SharedFormatDropdownProps {
  command: ElementFormatType;
}

const items: FormatDropdownItemProps[] = [
  {
    command: 'left',
    label: 'Left Align',
    shortcut: 'LEFT_ALIGN',
    Icon: AlignLeft,
  },
  {
    command: 'center',
    label: 'Center Align',
    shortcut: 'CENTER_ALIGN',
    Icon: AlignCenter,
  },
  {
    command: 'justify',
    label: 'Justify Align',
    shortcut: 'JUSTIFY_ALIGN',
    Icon: AlignJustify,
  },
  {
    command: 'right',
    label: 'Right Align',
    shortcut: 'RIGHT_ALIGN',
    Icon: AlignRight,
  },
];

export function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  const triggerIcon: Record<ElementFormatType, Element> | any = {
    left: <AlignLeft className="format w-4 h-4" />,
    center: <AlignCenter className="format w-4 h-4" />,
    justify: <AlignJustify className="format w-4 h-4" />,
    right: <AlignRight className="format w-4 h-4" />,
  };
  return (
    <DropdownMenu>
      <DropdownMenuTriggerChevron className="toolbar-item">
        {value ? triggerIcon[value] : triggerIcon.left}
      </DropdownMenuTriggerChevron>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        {items.map((item) => (
          <FormatDropdownItem
            key={item.label}
            label={item.label}
            shortcut={item.shortcut}
            Icon={item.Icon}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, item.command);
            }}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
