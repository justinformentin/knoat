import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { FileTreeDemo } from './file-tree-demo';
import { serverClient } from '@/utils/supabase/server';

export async function AppSidebar(
  // { notes, noteList }: { notes: any; noteList: any }
) {
  const client = await serverClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if(!user) return;

  const {data: notes} = await client.from('notes').select('*').eq('user_id', user.id);
  const {data: directories} = await client.from('directories').select('*').eq('user_id', user.id);

  
  console.log('notes', notes);
  console.log('directories', directories);


  const combineDirectoriesAndNotes = (directories:any, notes:any) => {
    const findDir = (fullPath: string) => {
      const path = fullPath.split('/').slice(0, -1).join('/');
      if (path === '') return;
      return directories.find((d) => d.full_path === path);
    };
  
    notes.forEach((n) => {
      const foundDir = findDir(n.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(n);
      }
    });
  
    directories.forEach((d) => {
      const foundDir = findDir(d.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(d);
        const currIdx = directories.findIndex((dd) => dd.id === d.id);
        if (currIdx !== -1) directories.splice(currIdx, 1);
      }
    });
    return directories;
  }

  const noteList = combineDirectoriesAndNotes(directories, notes);
  console.log('noteList', noteList)
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {/* <SidebarGroup /> */}
        <FileTreeDemo notes={notes} noteList={noteList} user={user} />
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
