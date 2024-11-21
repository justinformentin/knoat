import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { FileTreeDemo } from './file-tree-demo';

export function AppSidebar({ notes, noteList }: { notes: any; noteList: any }) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {/* <SidebarGroup /> */}
        <FileTreeDemo notes={notes} noteList={noteList} />
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
