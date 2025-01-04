import { SidebarWrapper } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWrapper className="h-[calc(100%-50px)]">
      <AppSidebar />
      <div className="w-full h-full">{children}</div>
    </SidebarWrapper>
  );
}
