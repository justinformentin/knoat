import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  return (
    <div className="w-full h-full">
      <AppHeader>
        <Link href="/notes" className="self-center ml-4">
          <Button size="sm" variant="outline">
            Go to Notes
          </Button>
        </Link>
      </AppHeader>
      <div className="flex justify-center my-8">Note App</div>
    </div>
  );
}
