import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function AuthButton({ userId }: { userId: string }) {
  return (
    <div className="flex items-center gap-4">
      {userId ? (
        <form action={()=>{
          localStorage.clearItem('knoat-user-id')
          signOutAction();
        }}>
          <Button type="submit" variant={'outline'} size="sm" className="h-8">
            Sign out
          </Button>
        </form>
      ) : (
        <Button asChild size="sm" variant={'outline'}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
