import { facebookIcon, googleIcon, linkedInIcon, twitterIcon } from './icons';

export type Provider = 'google' | 'facebook' | 'twitter' | 'linkedin_oidc';

type ProviderButtonProps = {
  authKey: Provider;
  label: string;
  buttonBg: string;
  icon: any;
}[];

export const providerButtons: ProviderButtonProps = [
  {
    authKey: 'google',
    label: 'Google',
    buttonBg: 'bg-[#4285F4]',
    icon: googleIcon,
  },
  // {
  //   authKey: 'facebook',
  //   label: 'Facebook',
  //   buttonBg: 'bg-[#3c5a9a]',
  //   icon: facebookIcon,
  // },
  // {
  //   authKey: 'twitter',
  //   label: 'Twitter',
  //   buttonBg: 'bg-[#000]',
  //   icon: twitterIcon,
  // },
  // {
  //   authKey: 'linkedin_oidc',
  //   label: 'LinkedIn',
  //   buttonBg: 'bg-[#0A66C2]',
  //   icon: linkedInIcon,
  // },
];
