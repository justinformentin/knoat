import AppHeader from '@/components/app-header/app-header';
import Footer from '@/components/footer';
import HomeHero from '@/components/home-hero';

export default async function HomePage() {
  return (
    <>
      <AppHeader />
      <div className="w-full h-full">
        <HomeHero />
      </div>
      <Footer />
    </>
  );
}
