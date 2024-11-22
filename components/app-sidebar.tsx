import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { FileTreeDemo } from './file-tree-demo';
import { serverClient } from '@/utils/supabase/server';
import { Database } from '@/lib/database.types';

type Note = Database['public']['Tables']['directories']['Row'];
type Directory = Database['public']['Tables']['directories']['Row'];
type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };

export async function AppSidebar() {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return;

  const { data: notes } = await client
    .from('notes')
    .select('*')
    .eq('user_id', user.id);
  const { data: directories } = await client
    .from('directories')
    .select('*')
    .eq('user_id', user.id);

  const combineDirectoriesAndNotes = (
    directories: Directory[] | null,
    notes: Note[] | null
  ) => {
    const treeView: TreeViewDirectory[] = [...directories!];
    const findDir = (fullPath: string) => {
      const path = fullPath.split('/').slice(0, -1).join('/');
      if (path === '') return;
      return treeView?.find((d) => d.full_path === path);
    };

    notes?.forEach((n) => {
      const foundDir = findDir(n.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(n);
      }
    });

    treeView?.forEach((d) => {
      if (!d.children) d.children = [];

      const foundDir = findDir(d.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(d);
        const currIdx = treeView.findIndex((dd) => dd.id === d.id);
        if (currIdx !== -1) treeView.splice(currIdx, 1);
      }
    });
    return directories;
  };

  const treeView = combineDirectoriesAndNotes(directories, notes);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <FileTreeDemo notes={notes} initialTreeView={treeView} user={user} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
