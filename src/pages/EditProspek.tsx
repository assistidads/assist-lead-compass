
import { Layout } from '@/components/Layout';
import { ProspekForm } from '@/components/ProspekForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

const EditProspek = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <Layout>
        {() => (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Prospek (ID: {id})
              </h1>
            </div>
            <ProspekForm />
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default EditProspek;
