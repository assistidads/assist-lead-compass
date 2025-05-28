
import { Layout } from '@/components/Layout';
import AppContent from '@/components/AppContent';
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = () => {
  return (
    <ProtectedRoute>
      <Layout>
        {() => (
          <AppContent />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default Index;
