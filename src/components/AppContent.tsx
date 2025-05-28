
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { SupabaseProspekTable } from '@/components/SupabaseProspekTable';
import { DataMaster } from '@/components/DataMaster';
import { Laporan } from '@/components/Laporan';

interface AppContentProps {
  currentPage: string;
}

const AppContent = ({ currentPage }: AppContentProps) => {
  return (
    <div className="space-y-6">
      <Tabs value={currentPage} className="space-y-6">
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="data-prospek">
          <SupabaseProspekTable />
        </TabsContent>

        <TabsContent value="data-master">
          <DataMaster />
        </TabsContent>

        <TabsContent value="laporan">
          <Laporan />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppContent;
