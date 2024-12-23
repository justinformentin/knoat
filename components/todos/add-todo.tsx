'use client';

type AddTodoProps = {
  text: string;
  children: any;
  onClick: any;
  className?: string;
};
export const AddTodo = ({
  text,
  children,
  onClick,
  className,
}: AddTodoProps) => {
  return (
    <button
      type="button"
      onClick={onClick && onClick}
      className={
        'flex justify-around rounded-md border hover:bg-muted ' +
        (className || '')
      }
    >
      {children}
      <div className="p-2 h-8 text-sm self-center border border-none w-full flex justify-start leading-[1.1rem]">
        {text}
      </div>
    </button>
  );
};
