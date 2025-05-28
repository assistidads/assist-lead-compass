
import { Dashboard } from './Dashboard';
import { DataMaster } from './DataMaster';
import { SupabaseDataMaster } from './SupabaseDataMaster';
import { ProspekTable } from './ProspekTable';
import { SupabaseProspekTable } from './SupabaseProspekTable';
import { Laporan } from './Laporan';
import { SupabaseLaporan } from './SupabaseLaporan';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppContentProps {
  currentPage: string;
}

export default function AppContent({ currentPage }: AppContentProps) {
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'data-master':
        return (
          <Tabs defaultValue="supabase" className="space-y-6">
            <TabsList>
              <TabsTrigger value="supabase">Data Master (Supabase)</TabsTrigger>
              <TabsTrigger value="demo">Data Master (Demo)</TabsTrigger>
            </TabsList>
            <TabsContent value="supabase">
              <SupabaseDataMaster />
            </TabsContent>
            <TabsContent value="demo">
              <DataMaster />
            </TabsContent>
          </Tabs>
        );
      case 'data-prospek':
        return (
          <Tabs defaultValue="supabase" className="space-y-6">
            <TabsList>
              <TabsTrigger value="supabase">Data Prospek (Supabase)</TabsTrigger>
              <TabsTrigger value="demo">Data Prospek (Demo)</TabsTrigger>
            </TabsList>
            <TabsContent value="supabase">
              <SupabaseProspekTable />
            </TabsContent>
            <TabsContent value="demo">
              <ProspekTable />
            </TabsContent>
          </Tabs>
        );
      case 'laporan':
        return (
          <Tabs defaultValue="analisis" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analisis">Analisis & Chart</TabsTrigger>
              <TabsTrigger value="data-real">Data Real</TabsTrigger>
            </TabsList>
            <TabsContent value="analisis">
              <Laporan />
            </TabsContent>
            <TabsContent value="data-real">
              <SupabaseLaporan />
            </TabsContent>
          </Tabs>
        );
      default:
        return <Dashboard />;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
