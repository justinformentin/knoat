import AppHeader from '@/components/app-header/app-header';
import Footer from '@/components/footer';
import HomeHero from '@/components/home-hero';
import { loadUserDataSSR } from '@/lib/server/load-app-data';
import { serverClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const client = await serverClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  let data;
  if (user) {
    data = await loadUserDataSSR(user.id);
  }
  return (
    <>
      <AppHeader ssrData={data} />
      <div className="w-full h-full">
        <HomeHero />
      </div>
      <Footer />
    </>
  );
}
