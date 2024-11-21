import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { EnvVarWarning } from '@/components/env-var-warning';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

type Note = {
  id: string;
  label: string;
  fileName: string;
  fullPath: string;
};
type Directory = {
  id: string;
  label: string;
  fullPath: string;
  children?: Array<Note | Directory>;
};

// const notes = [
//   {
//     id: '1',
//     label: 'notes-one',
//     fullPath: 'notes-one',
//     children: [
//       {
//         id: '2',
//         fullPath: 'notes-one/inner-notes-1',
//         label: 'inner-notes-1',
//         children: [
//           {
//             id: '4',
//             label: 'todo.md',
//             fileName: 'todo.md',
//             fullPath: 'notes-one/inner-notes/inner-todo.md',
//           },
//           {
//             id: '5',
//             label: 'tasks.md',
//             fileName: 'tasks.md',
//             fullPath: 'notes-one/inner-notes/inner-tasks.md',
//           },
//         ],
//       },
//       {
//         id: '3',
//         label: 'todo.md',
//         fileName: 'todo.md',
//         fullPath: 'notes-one/todo.md',
//       },
//     ],
//   },
//   {
//     id: '6',
//     label: 'notes-two',
//     fullPath: 'notes-two',
//     children: [
//       {
//         id: '7',
//         label: 'other-note.md',
//         fileName: 'other-note.md',
//         fullPath: 'notes-two/other-note.md',
//       },
//     ],
//   },
// ];

export default function Layout({ children }: { children: React.ReactNode }) {
  const directories: Directory[] = [
    {
      id: '1',
      label: 'notes-one',
      fullPath: 'notes-one',
    },
    {
      id: '2',
      label: 'inner-notes',
      fullPath: 'notes-one/inner-notes',
    },
    {
      id: '6',
      label: 'notes-two',
      fullPath: 'notes-two',
    },
  ];
  const flatNotes = [
    {
      id: '4',
      label: 'todo.md',
      fileName: 'todo.md',
      fullPath: 'notes-one/inner-notes/inner-todo.md',
    },
    {
      id: '5',
      label: 'tasks.md',
      fileName: 'tasks.md',
      fullPath: 'notes-one/inner-notes/inner-tasks.md',
    },
    {
      id: '3',
      label: 'todo.md',
      fileName: 'todo.md',
      fullPath: 'notes-one/todo.md',
    },
    {
      id: '7',
      label: 'other-note.md',
      fileName: 'other-note.md',
      fullPath: 'notes-two/other-note.md',
    },
  ];

  const findDir = (fullPath: string) => {
    const path = fullPath.split('/').slice(0, -1).join('/');
    if (path === '') return;
    return directories.find((d) => d.fullPath === path);
  };

  flatNotes.forEach((n) => {
    const foundDir = findDir(n.fullPath);
    if (foundDir) {
      if (!foundDir.children) foundDir.children = [];
      foundDir.children.push(n);
    }
  });

  directories.forEach((d) => {
    const foundDir = findDir(d.fullPath);
    if (foundDir) {
      if (!foundDir.children) foundDir.children = [];
      foundDir.children.push(d);
      const currIdx = directories.findIndex((dd) => dd.id === d.id);
      if (currIdx !== -1) directories.splice(currIdx, 1);
    }
  });

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar notes={directories} />
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <SidebarTrigger />
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={'/'}>Knoat</Link>
            </div>
            <ThemeSwitcher />
            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
          </div>
        </nav>
        {children}
      </div>
    </SidebarProvider>
  );
}
