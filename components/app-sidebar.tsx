import { Sidebar, SidebarFooter } from '@/components/ui/sidebar';
import FileTree from './file-tree';

export async function AppSidebar() {
  return (
    <Sidebar>
      <FileTree />

      <SidebarFooter />
    </Sidebar>
  );
}
