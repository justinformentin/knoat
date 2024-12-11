import { SidebarWrapper } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWrapper>
      <AppSidebar />
      <div className="w-full h-full">{children}</div>
    </SidebarWrapper>
  );
}
