import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { loadUserNotes } from '@/lib/server/notes';
import { loadUserDirectories } from '@/lib/server/directories';
import { loadUser } from '@/lib/server/user';
import { Directory, Note } from '@/server/types';
import { combineDirectoriesAndNotes } from '@/lib/combine-note-dir';
import FileTree from './file-tree';

// type Note = Database['public']['Tables']['directories']['Row'];
// type Directory = Database['public']['Tables']['directories']['Row'];
type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };

export async function AppSidebar() {

  const user = await loadUser();
  const notes = await loadUserNotes(user.id);
  const directories = await loadUserDirectories(user.id);

  const treeView = directories?.length && combineDirectoriesAndNotes(notes || [], directories)
  console.log('appsidebar notes', notes);
  console.log('appsidebar directories', directories);
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <FileTree initialTreeView={treeView} notes={notes} directories={directories} user={user} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
