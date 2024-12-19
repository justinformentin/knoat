import { Message } from '@/components/form-message';
import Link from 'next/link';
import AuthContainer from '../_components/auth_container';
import AuthButton from '../_components/auth-buttons';

export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  // const searchParams = await props.searchParams;
  return (
    <AuthContainer>
      <div className="flex flex-col min-w-64 gap-2 [&>input]:mb-3 mt-8">
        <div className="mb-2 text-center">
          <h1 className="text-3xl text-foreground font-semibold font-geist tracking-tighter">
            Sign In
          </h1>
        </div>
      <AuthButton />

        <div className="py-2 text-center text-sm">
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            To combat spam, we require signing in through a third party.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            We do not collect or share any personal information with anyone.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Please refer to our{' '}
            <Link className="underline" href="/privacy">
              Privacy Policy
            </Link>{' '}
            for more information.
          </p>
        </div>
      </div>
    </AuthContainer>
  );
}
