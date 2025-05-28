
import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

interface LaporanProps {
  reportType?: string;
}

export function Laporan({ reportType = 'sumber-leads' }: LaporanProps) {
  const { prospekData, sumberLeadsData, kodeAdsData, layananData, loading } = useSupabaseData();
  const [activeTab, setActiveTab] = useState(reportType);
  const chartRef = useRef<HTMLDivElement>(null);

  // Data untuk chart sumber leads
  const sumberLeadsChartData = useMemo(() => {
    return sumberLeadsData.map(sumber => {
      const prospekCount = prospekData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
      const leadsCount = prospekData.filter(item => 
        item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
      ).length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;
      
      return {
        name: sumber.nama,
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1))
      };
    }).filter(item => item.value > 0);
  }, [prospekData, sumberLeadsData]);

  // Data untuk chart kode ads
  const kodeAdsChartData = useMemo(() => {
    return kodeAdsData.map(kode => {
      const prospekItems = prospekData.filter(item => item.kode_ads?.kode === kode.kode);
      const prospekCount = prospekItems.length;
      const leadsCount = prospekItems.filter(item => item.status_leads === 'Leads').length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;

      return {
        name: kode.kode,
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1))
      };
    }).filter(item => item.value > 0);
  }, [prospekData, kodeAdsData]);

  // Data untuk chart layanan
  const layananChartData = useMemo(() => {
    return layananData.map(layanan => {
      const prospekItems = prospekData.filter(item => item.layanan_assist?.nama === layanan.nama);
      const prospekCount = prospekItems.length;
      const leadsCount = prospekItems.filter(item => item.status_leads === 'Leads').length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;

      return {
        name: layanan.nama,
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1))
      };
    }).filter(item => item.value > 0);
  }, [prospekData, layananData]);

  // Data untuk chart kota/kabupaten
  const kotaKabupatenChartData = useMemo(() => {
    const kotaCounts = prospekData.reduce((acc, item) => {
      const kota = item.kota;
      if (!acc[kota]) {
        acc[kota] = { prospek: 0, leads: 0 };
      }
      acc[kota].prospek++;
      if (item.status_leads === 'Leads') {
        acc[kota].leads++;
      }
      return acc;
    }, {} as Record<string, { prospek: number; leads: number }>);

    return Object.entries(kotaCounts).map(([kota, data]) => ({
      name: kota,
      value: data.prospek,
      prospek: data.prospek,
      leads: data.leads,
      ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
    })).filter(item => item.value > 0);
  }, [prospekData]);

  // Data untuk performa CS
  const performaCSData = useMemo(() => {
    const csPerformance = prospekData.reduce((acc, item) => {
      const csName = item.created_by_profile?.full_name || 'Unknown';
      if (!acc[csName]) {
        acc[csName] = { prospek: 0, leads: 0, bukanLeads: 0 };
      }
      acc[csName].prospek++;
      if (item.status_leads === 'Leads') {
        acc[csName].leads++;
      } else if (item.status_leads === 'Bukan Leads') {
        acc[csName].bukanLeads++;
      }
      return acc;
    }, {} as Record<string, { prospek: number; leads: number; bukanLeads: number }>);

    return Object.entries(csPerformance).map(([name, data]) => ({
      name,
      prospek: data.prospek,
      leads: data.leads,
      bukanLeads: data.bukanLeads,
      ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
    }));
  }, [prospekData]);

  // Data untuk heatmap (contoh implementasi sederhana)
  const heatmapData = useMemo(() => {
    const provinsiCounts = prospekData.reduce((acc, item) => {
      const provinsi = item.provinsi_nama;
      if (!acc[provinsi]) {
        acc[provinsi] = { prospek: 0, leads: 0 };
      }
      acc[provinsi].prospek++;
      if (item.status_leads === 'Leads') {
        acc[provinsi].leads++;
      }
      return acc;
    }, {} as Record<string, { prospek: number; leads: number }>);

    return Object.entries(provinsiCounts).map(([provinsi, data]) => ({
      name: provinsi,
      value: data.prospek,
      prospek: data.prospek,
      leads: data.leads,
      ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
    })).filter(item => item.value > 0);
  }, [prospekData]);

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svg = chartRef.current.querySelector('svg');
      
      if (svg && ctx) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = `chart-${activeTab}-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Memuat data laporan...</div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    let data;
    switch (activeTab) {
      case 'sumber-leads':
        data = sumberLeadsChartData;
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'kode-ads':
        data = kodeAdsChartData;
        break;
      case 'layanan-assist':
        data = layananChartData;
        break;
      case 'kota-kabupaten':
        data = kotaKabupatenChartData;
        break;
      case 'heatmap':
        data = heatmapData;
        break;
      case 'performa-cs':
        data = performaCSData;
        break;
      default:
        data = [];
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prospek" fill="#2563eb" name="Prospek" />
          <Bar dataKey="leads" fill="#16a34a" name="Leads" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const getCTRColor = (ctr: number) => {
    if (ctr >= 30) return 'bg-green-100 text-green-800';
    if (ctr >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderTable = () => {
    let data, columns;
    
    switch (activeTab) {
      case 'sumber-leads':
        data = sumberLeadsChartData;
        columns = ['Name', 'Prospek', 'Leads', 'CTR Leads'];
        break;
      case 'kode-ads':
        data = kodeAdsChartData;
        columns = ['Name', 'Prospek', 'Leads', 'CTR Leads'];
        break;
      case 'layanan-assist':
        data = layananChartData;
        columns = ['Name', 'Prospek', 'Leads', 'CTR Leads'];
        break;
      case 'kota-kabupaten':
        data = kotaKabupatenChartData;
        columns = ['Kota/Kabupaten', 'Prospek', 'Leads', 'CTR Leads'];
        break;
      case 'heatmap':
        data = heatmapData;
        columns = ['Provinsi', 'Prospek', 'Leads', 'CTR Leads'];
        break;
      case 'performa-cs':
        data = performaCSData;
        columns = ['Nama CS', 'Total Prospek', 'Leads', 'Bukan Leads', 'CTR Leads'];
        break;
      default:
        return <div className="text-center py-8 text-gray-500">Tabel akan segera tersedia</div>;
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === 'sumber-leads' ? 'Tabel Sumber Leads' :
             activeTab === 'kode-ads' ? 'Tabel Kode Ads' :
             activeTab === 'layanan-assist' ? 'Tabel Layanan Assist' :
             activeTab === 'kota-kabupaten' ? 'Tabel Kota/Kabupaten' :
             activeTab === 'heatmap' ? 'Tabel Heatmap Provinsi' :
             activeTab === 'performa-cs' ? 'Tabel Performa CS' : 'Tabel'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column, index) => (
                  <th key={column} className={`px-6 py-4 text-sm font-semibold text-gray-900 ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
                  {activeTab === 'performa-cs' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">{item.bukanLeads}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(item.ctr)}`}>
                      {item.ctr}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'sumber-leads', label: 'Sumber Leads' },
    { id: 'kode-ads', label: 'Kode Ads' },
    { id: 'layanan-assist', label: 'Layanan' },
    { id: 'performa-cs', label: 'Performa CS' },
    { id: 'kota-kabupaten', label: 'Kota/Kabupaten' },
    { id: 'heatmap', label: 'Heatmap' }
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return 'Distribusi Sumber Leads';
      case 'kode-ads':
        return 'Distribusi Kode Ads';
      case 'layanan-assist':
        return 'Distribusi Layanan Assist';
      case 'performa-cs':
        return 'Performa CS';
      case 'kota-kabupaten':
        return 'Distribusi Kota/Kabupaten';
      case 'heatmap':
        return 'Heatmap Provinsi';
      default:
        return 'Laporan';
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-900">{getTitle()}</CardTitle>
            <Button variant="outline" size="sm" onClick={downloadChartAsPNG}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
          </CardHeader>
          <CardContent>
            <div ref={chartRef}>
              {renderChart()}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {renderTable()}
        </div>
      </div>
    </div>
  );
}
