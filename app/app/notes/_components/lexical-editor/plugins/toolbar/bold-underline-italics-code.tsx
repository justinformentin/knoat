import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { SharedButtonProps, ToolbarButton } from './toolbar-button';
import { Bold, Code, Italic, Underline } from 'lucide-react';

interface ButtonItem extends SharedButtonProps {
  command: TextFormatType;
  stateKey: string;
}
const items: ButtonItem[] = [
  { label: 'Bold', Icon: Bold, command: 'bold', stateKey: 'isBold' },
  { label: 'Italic', Icon: Italic, command: 'italic', stateKey: 'isItalic' },
  {
    label: 'Underline',
    Icon: Underline,
    command: 'underline',
    stateKey: 'isUnderline',
  },
  { label: 'Code', Icon: Code, command: 'code', stateKey: 'isCode' },
];

export const BoldUnderlineItalicsCode = ({ editor, toolbarState }: any) => {
  return items.map((item) => (
    <ToolbarButton
      key={item.label}
      label={item.label}
      Icon={item.Icon}
      className="toolbar-item"
      activeClass={toolbarState[item.stateKey] ? 'active' : ''}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, item.command);
      }}
    ></ToolbarButton>
  ));
};
