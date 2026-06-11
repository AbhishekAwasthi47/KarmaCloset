import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturedListings from '@/components/home/FeaturedListings';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import CTABanner from '@/components/home/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <HowItWorks />
      <TrustSection />
      <CTABanner />
    </>
  );
}
