
import { Layout } from '@/components/Layout';
import { AppContent } from '@/components/AppContent';

const Index = () => {
  return (
    <Layout>
      {({ currentPage }: { currentPage: string }) => (
        <AppContent currentPage={currentPage} />
      )}
    </Layout>
  );
};

export default Index;
