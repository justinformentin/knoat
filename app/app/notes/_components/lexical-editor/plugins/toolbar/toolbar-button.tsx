export interface SharedButtonProps {
  label: string;
  Icon: any;
}
interface ToolbarButtonProps extends SharedButtonProps {
  onClick: () => void;
  activeClass?: string;
  className?: string;
}

export const ToolbarButton = ({
  onClick,
  label,
  Icon,
  activeClass,
  className,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`spaced ${className} ${activeClass}`}
      aria-label={'Format ' + label}
    >
      <Icon className="size-4" />
    </button>
  );
};
