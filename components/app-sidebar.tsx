import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { FileTreeDemo } from "./file-tree-demo"
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';
  
  export function AppSidebar() {

const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2',
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2',
  },
];

    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          {/* <SidebarGroup /> */}
          {/* <TreeView data={data} /> */}
          <FileTreeDemo />
          {/* <SidebarGroup /> */}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  