
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
          <Tabs defaultValue="sumber-leads" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
              <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
              <TabsTrigger value="layanan-assist">Layanan Assist</TabsTrigger>
              <TabsTrigger value="kota-kabupaten">Kota/Kabupaten</TabsTrigger>
              <TabsTrigger value="funnel-konversi">Funnel Konversi</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="performa-cs">Performa CS</TabsTrigger>
            </TabsList>
            <TabsContent value="sumber-leads">
              <Laporan reportType="sumber-leads" />
            </TabsContent>
            <TabsContent value="kode-ads">
              <Laporan reportType="kode-ads" />
            </TabsContent>
            <TabsContent value="layanan-assist">
              <Laporan reportType="layanan" />
            </TabsContent>
            <TabsContent value="kota-kabupaten">
              <Laporan reportType="kota-kabupaten" />
            </TabsContent>
            <TabsContent value="funnel-konversi">
              <Laporan reportType="funnel" />
            </TabsContent>
            <TabsContent value="heatmap">
              <Laporan reportType="heatmap" />
            </TabsContent>
            <TabsContent value="performa-cs">
              <Laporan reportType="performa-cs" />
            </TabsContent>
          </Tabs>
        );
      default:
        return <Dashboard />;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
