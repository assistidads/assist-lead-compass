
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
        return (
          <Tabs defaultValue="user" className="space-y-6">
            <TabsList>
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="layanan">Layanan</TabsTrigger>
              <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
              <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
              <TabsTrigger value="tipe-faskes">Tipe Faskes</TabsTrigger>
              <TabsTrigger value="status-leads">Status Leads</TabsTrigger>
              <TabsTrigger value="bukan-leads">Bukan Leads</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <SupabaseDataMaster type="user" />
            </TabsContent>
            <TabsContent value="layanan">
              <SupabaseDataMaster type="layanan" />
            </TabsContent>
            <TabsContent value="kode-ads">
              <SupabaseDataMaster type="kode-ads" />
            </TabsContent>
            <TabsContent value="sumber-leads">
              <SupabaseDataMaster type="sumber-leads" />
            </TabsContent>
            <TabsContent value="tipe-faskes">
              <SupabaseDataMaster type="tipe-faskes" />
            </TabsContent>
            <TabsContent value="status-leads">
              <SupabaseDataMaster type="status-leads" />
            </TabsContent>
            <TabsContent value="bukan-leads">
              <SupabaseDataMaster type="bukan-leads" />
            </TabsContent>
          </Tabs>
        );
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
