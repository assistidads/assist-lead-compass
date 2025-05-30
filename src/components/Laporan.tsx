
import { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useReportData } from './reports/hooks/useReportData';
import { useAuth } from '@/contexts/AuthContext';
import { ReportChart } from './reports/ReportChart';
import { ReportTable } from './reports/ReportTable';

interface LaporanProps {
  reportType?: string;
  filteredData?: any[];
}

export function Laporan({ reportType = 'sumber-leads', filteredData }: LaporanProps) {
  const { loading } = useSupabaseData();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'cs_support';
  const [activeTab, setActiveTab] = useState(reportType);
  const {
    sumberLeadsChartData,
    kodeAdsChartData,
    layananChartData,
    kotaKabupatenChartData,
    performaCSData,
    heatmapData
  } = useReportData(filteredData);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Memuat data laporan...</div>
        </div>
      </div>
    );
  }

  const getDataAndColumns = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return {
          data: sumberLeadsChartData,
          columns: ['Sumber Leads', 'Prospek', 'Leads', 'CTR Leads']
        };
      case 'kode-ads':
        return {
          data: kodeAdsChartData,
          columns: ['Kode', 'Prospek', 'Leads', 'CTR Leads']
        };
      case 'layanan-assist':
        return {
          data: layananChartData,
          columns: ['Name', 'Prospek', 'Leads', 'CTR Leads']
        };
      case 'kota-kabupaten':
        return {
          data: kotaKabupatenChartData,
          columns: ['Kota/Kabupaten', 'Prospek', 'Leads', 'CTR Leads']
        };
      case 'heatmap':
        return {
          data: heatmapData.dayActivity.map(item => ({ ...item, value: item.prospek })),
          columns: ['Hari', 'Prospek', 'Leads', 'CTR Leads']
        };
      case 'performa-cs':
        return {
          data: performaCSData,
          columns: ['Nama CS', 'Total Prospek', 'Leads', 'Bukan Leads', 'CTR Leads']
        };
      default:
        return { data: [], columns: [] };
    }
  };

  const { data, columns } = getDataAndColumns();

  const getTitle = () => {
    switch (activeTab) {
      case 'sumber-leads': return 'Distribusi Sumber Leads';
      case 'kode-ads': return 'Distribusi Kode Ads';
      case 'layanan-assist': return 'Distribusi Layanan Assist';
      case 'performa-cs': return 'Performa CS';
      case 'kota-kabupaten': return 'Distribusi Kota/Kabupaten';
      case 'heatmap': return 'Heatmap Aktivitas Prospek & Leads';
      default: return 'Laporan';
    }
  };

  // Filter tabs based on user role
  const tabs = [
    { id: 'sumber-leads', label: 'Sumber Leads' },
    { id: 'kode-ads', label: 'Kode Ads' },
    { id: 'layanan-assist', label: 'Layanan' },
    { id: 'performa-cs', label: 'Performa CS' },
    { id: 'kota-kabupaten', label: 'Kota/Kabupaten' },
    ...(userRole === 'admin' ? [{ id: 'heatmap', label: 'Heatmap' }] : [])
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Distribusi Sumber Leads</h2>
        <p className="text-gray-600 mb-6">Analisis performa leads dan prospek</p>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* For heatmap, show full width */}
      {activeTab === 'heatmap' ? (
        <div>
          <ReportChart
            activeTab={activeTab}
            data={data}
            heatmapData={heatmapData.heatmapMatrix}
            title={getTitle()}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportChart
            activeTab={activeTab}
            data={data}
            title={getTitle()}
          />
          <div className="space-y-6">
            <ReportTable
              activeTab={activeTab}
              data={data}
              columns={columns}
            />
          </div>
        </div>
      )}
    </div>
  );
}
