
import { Layout } from '@/components/Layout';
import { SupabaseProspekForm } from '@/components/SupabaseProspekForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

const EditProspek = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    navigate('/?tab=data-prospek');
  };

  const handleSuccess = () => {
    navigate('/?tab=data-prospek');
  };

  return (
    <ProtectedRoute>
      <Layout>
        {() => (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Prospek
              </h1>
            </div>
            <SupabaseProspekForm isEdit={true} prospekId={id} onSuccess={handleSuccess} />
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default EditProspek;
