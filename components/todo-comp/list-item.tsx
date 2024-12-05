'use client'
import { Input } from '../ui/input';
import { X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Todo } from '@/lib/database.types';

type ListItemProps = {
  item: Todo;
  onCheckedChange: any;
  onDelete: any;
  onClick?: any;
  onBlur?: any;
  onChange?: any;
  className?: string;
  inputDisabled?: boolean;
  inputClass?: string;
};

export const ListItem = ({
  item,
  onCheckedChange,
  onClick,
  onBlur,
  onChange,
  onDelete,
  className,
  inputDisabled,
  inputClass
}: ListItemProps) => {
  return (
    <div
      className={
        'flex justify-around rounded-md border focus-within:bg-sky-50 hover:bg-sky-50 ' +
        className
      }
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={onCheckedChange && onCheckedChange}
        className="self-center ml-2"
      />
      <Input
        id={item.id}
        disabled={inputDisabled}
        value={item.content}
        placeholder="Enter task"
        className={"p-2 h-8 bg-transparent outline-none border-none " + (inputClass || '')}
        onClick={onClick && onClick}
        onBlur={onBlur && onBlur}
        onChange={onChange && onChange}
      />
      <button type="button" onClick={onDelete}>
        <X className="h-4 w-4 mr-2" />
      </button>
    </div>
  );
};
