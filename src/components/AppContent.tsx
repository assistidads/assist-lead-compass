
import { Dashboard } from './Dashboard';
import { SupabaseDataMaster } from './SupabaseDataMaster';
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
        return <SupabaseDataMaster />;
      case 'data-prospek':
        return <SupabaseProspekTable />;
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
