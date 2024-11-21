import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { FileTreeDemo } from "./file-tree-demo"
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';
  
  export function AppSidebar({notes}: {notes:any}) {


    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          {/* <SidebarGroup /> */}
          {/* <TreeView data={data} /> */}
          <FileTreeDemo notes={notes} />
          {/* <SidebarGroup /> */}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  