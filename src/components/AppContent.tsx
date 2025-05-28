
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { SupabaseProspekTable } from '@/components/SupabaseProspekTable';
import { SupabaseDataMaster } from '@/components/SupabaseDataMaster';
import { SupabaseLaporan } from '@/components/SupabaseLaporan';
import { useAuth } from '@/contexts/AuthContext';

interface AppContentProps {
  currentPage: string;
}

const AppContent = ({ currentPage }: AppContentProps) => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <Tabs value={currentPage} className="space-y-6">
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="data-prospek">
          <SupabaseProspekTable />
        </TabsContent>

        {profile?.role === 'admin' && (
          <TabsContent value="data-master">
            <SupabaseDataMaster />
          </TabsContent>
        )}

        <TabsContent value="laporan">
          <SupabaseLaporan />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppContent;
