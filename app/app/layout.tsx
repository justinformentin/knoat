import AppHeader from '@/components/app-header/app-header';
import { Toaster } from 'sonner';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
      <Toaster />
    </>
  );
}
