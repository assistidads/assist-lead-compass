
import { Layout } from '@/components/Layout';
import { AppContent } from '@/components/AppContent';
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = () => {
  return (
    <ProtectedRoute>
      <Layout>
        {({ currentPage }: { currentPage: string }) => (
          <AppContent currentPage={currentPage} />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default Index;
