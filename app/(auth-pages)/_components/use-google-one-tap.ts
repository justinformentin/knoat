//@ts-ignore
import { CredentialResponse } from 'google-one-tap';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/utils/supabase/client';

export const useGoogleOneTap = (suppressedCb:any) => {
  const supabase = browserClient();
  const router = useRouter();

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      //@ts-ignore
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

  return async () => {
    const [nonce, hashedNonce] = await generateNonce();

    // check if there's already an existing session before initializing the one-tap UI
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session', error);
    }
    if (data.session) {
      router.push('/');
      return;
    }

    //@ts-ignore
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: true,
      promptParentId: 'oneTap',
      callback: async (response: CredentialResponse) => {
        try {
          // send id token returned in response.credential to supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          });

          if (error) throw error;
          // redirect to protected page
          router.push('/app/notes');
        } catch (error) {
          console.error('Error logging in with Google One Tap', error);
        }
      },
      nonce: hashedNonce,
      // with chrome's removal of third-party cookiesm, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
      use_fedcm_for_prompt: true,
    });
    //@ts-ignore
    google.accounts.id.prompt(notification => {
      if(typeof notification === 'object'){
        const keys = Object.keys(notification);
        if(keys && keys.length > 0){
          keys.forEach(k => notification[k] && notification[k].includes('suppressed') && suppressedCb())
        }
      }
    }); // Display the One Tap UI
  };
};
