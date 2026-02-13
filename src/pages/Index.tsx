import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { DepartmentsSection } from '@/components/home/DepartmentsSection';
import { NewsSection } from '@/components/home/NewsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <DepartmentsSection />
      <NewsSection />
    </Layout>
  );
};

export default Index;
