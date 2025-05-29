import { useState, useEffect, lazy, Suspense } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { cn } from '@/lib/utils';

const PointsCalculator = lazy(() =>
  import('@/components/PointsCalculator').then(module => ({ default: module.PointsCalculator }))
);
const EnhancedPointsCalculator = lazy(() =>
  import('@/components/EnhancedPointsCalculator').then(module => ({ default: module.EnhancedPointsCalculator }))
);
const FeaturesSection = lazy(() =>
  import('@/components/FeaturesSection').then(module => ({ default: module.FeaturesSection }))
);
const HowToJoinSection = lazy(() =>
  import('@/components/HowToJoinSection').then(module => ({ default: module.HowToJoinSection }))
);
const TopPerformersSection = lazy(() =>
  import('@/components/TopPerformersSection').then(module => ({ default: module.TopPerformersSection }))
);
const ContactSection = lazy(() =>
  import('@/components/ContactSection').then(module => ({ default: module.ContactSection }))
);

const INITIAL_ACCOUNTS_ANALYZED = 119748;

// Fallback component for lazy loading
const LazyLoadFallback = () => (
  <div className="flex justify-center items-center h-64">
    <p>Loading section...</p>
  </div>
);

export function HomePage() {
  const [accountsAnalyzed, setAccountsAnalyzed] = useState(INITIAL_ACCOUNTS_ANALYZED);
  const [isClientForHome, setIsClientForHome] = useState(false);

  useEffect(() => {
    setIsClientForHome(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arcadeverseAccountsAnalyzed');
      if (saved) {
        setAccountsAnalyzed(Number.parseInt(saved, 10));
      }
    }
  }, []);

  const incrementAccountsAnalyzed = () => {
    setAccountsAnalyzed(prevCount => {
      const newCount = prevCount + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('arcadeverseAccountsAnalyzed', newCount.toString());
      }
      return newCount;
    });
  };

  return (
    <div className={cn("min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white")}>
      <HeroSection />
      <Suspense fallback={<LazyLoadFallback />}>
        <EnhancedPointsCalculator onProfileScanned={incrementAccountsAnalyzed} />
        <FeaturesSection />
        <HowToJoinSection />
        <TopPerformersSection />
        <ContactSection accountsAnalyzedCountFromHome={isClientForHome ? accountsAnalyzed : INITIAL_ACCOUNTS_ANALYZED} />
      </Suspense>
    </div>
  );
}
