'use client';
import Script from 'next/script';

import { signInWithOAuth } from '@/app/actions';
import { providerButtons, Provider } from './provider-buttons';
import { useGoogleOneTap } from './use-google-one-tap';

export default function AuthButton() {
  const initializeGoogleOneTap = useGoogleOneTap();

  const onClick = (provider: Provider) => {
    provider === 'google'
      ? initializeGoogleOneTap()
      : signInWithOAuth(provider);
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />

      <div className="my-2 border-b pt-2 pb-8">
        <div className="grid grid-cols-2 items-center justify-center gap-4">
          {providerButtons.map((provider) => {
            return (
              <button
                id="oneTap"
                key={provider.authKey}
                onClick={() => onClick(provider.authKey)}
                className={
                  'inline-flex items-center min-h-15 border border-slate-500 rounded-md ' +
                  provider.buttonBg
                }
              >
                <div className="border-r border-slate-500">
                  <div className={'self-center p-1 m-1  '}>{provider.icon}</div>
                </div>

                <div className="px-2 text-white">
                  Sign in with {provider.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* <div id="oneTap" className="fixed top-0 right-0 z-[100]" /> */}
    </>
  );
}
