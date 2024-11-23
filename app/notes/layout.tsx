import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';

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

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar  />
      <div className="w-full h-full">
        <AppHeader />
        {children}
      </div>
    </SidebarProvider>
  );
}
