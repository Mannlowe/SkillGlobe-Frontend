import Header from '@/components/layout/Header';
import MobileNavigation from '@/components/layout/MobileNavigation';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <MobileNavigation />
      
      {/* Bottom padding for mobile navigation */}
      <div className="h-20 md:h-0"></div>
    </main>
  );
}