import AppHeader from '@/components/app-header/app-header';
import { Toaster } from 'sonner';
import { loadAppData } from '@/lib/server/load-app-data';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await loadAppData();
  return (
    <>
      <AppHeader data={data} />
      {children}
      <Toaster />
    </>
  );
}
