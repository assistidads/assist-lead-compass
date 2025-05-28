
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { SupabaseProspekTable } from '@/components/SupabaseProspekTable';
import { DataMaster } from '@/components/DataMaster';
import { Laporan } from '@/components/Laporan';
import { useSearchParams } from 'react-router-dom';

const AppContent = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="data-prospek">Data Prospek</TabsTrigger>
          <TabsTrigger value="data-master">Data Master</TabsTrigger>
          <TabsTrigger value="laporan">Laporan</TabsTrigger>
        </TabsList>

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
