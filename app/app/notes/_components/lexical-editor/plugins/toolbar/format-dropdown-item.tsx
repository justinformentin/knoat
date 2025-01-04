import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SHORTCUTS } from '../shortcuts/shortcuts';

export interface SharedFormatDropdownProps {
  label: string;
  shortcut: keyof typeof SHORTCUTS;
  Icon: any;
}
interface FormatMenuItemProps extends SharedFormatDropdownProps {
  onClick: () => void;
  activeClass?: string;
}

export const FormatDropdownItem = ({
  onClick,
  label,
  shortcut,
  activeClass,
  Icon,
}: FormatMenuItemProps) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={"flex justify-between " + activeClass}
      title={label}
      aria-label={'Format text to ' + label}
    >
      <div className="flex">
        <Icon className="size-4 self-center" />
        <span className="self-center ml-2">{label}</span>
      </div>
      <span className="text-xs text-foreground/70 ml-2">{SHORTCUTS[shortcut]}</span>
    </DropdownMenuItem>
  );
};
