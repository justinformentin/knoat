'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ListTodo, NotebookPen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TooltipWrap } from '../tooltip-wrap';

export default function AppHeaderLinks() {
  const pathname = usePathname();
  return (
    <div className="flex justify-between space-x-2">
      <Link href="/app/notes">
        <TooltipWrap text="Notes">
          <Button
            size="iconsm"
            variant={'outline'}
            className={`${pathname === '/app/notes' ? 'bg-muted' : ''}`}
          >
            <NotebookPen className="size-5" />
          </Button>
        </TooltipWrap>
      </Link>

      <Link href="/app/todo">
        <TooltipWrap text="Todo">
          <Button
            size="iconsm"
            variant={'outline'}
            className={`${pathname === '/app/todo' ? 'bg-muted' : ''}`}
          >
            <ListTodo className="size-5" />
          </Button>
        </TooltipWrap>
      </Link>
    </div>
  );
}
