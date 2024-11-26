import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="w-full h-full">
        <AppHeader>
          <SidebarTrigger className="self-center ml-2" />
        </AppHeader>
        {children}
      </div>
    </SidebarProvider>
  );
}
