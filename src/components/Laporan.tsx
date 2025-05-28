
import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

export function Laporan() {
  const { prospekData, sumberLeadsData, kodeAdsData, layananData, loading } = useSupabaseData();
  const [activeTab, setActiveTab] = useState('sumber-leads');
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

  const getTitle = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return 'Distribusi Sumber Leads';
      case 'kode-ads':
        return 'Distribusi Kode Ads';
      case 'layanan':
        return 'Distribusi Layanan Assist';
      case 'performa-cs':
        return 'Performa CS';
      case 'kota-kabupaten':
        return 'Distribusi Kota/Kabupaten';
      case 'funnel':
        return 'Funnel Konversi';
      case 'heatmap':
        return 'Heatmap';
      default:
        return 'Laporan';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return 'Tabel Sumber Leads';
      case 'kode-ads':
        return 'Tabel Kode Ads';
      case 'layanan':
        return 'Tabel Layanan Assist';
      case 'performa-cs':
        return 'Tabel Performa CS';
      default:
        return 'Data akan segera tersedia';
    }
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sumberLeadsChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sumberLeadsChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'kode-ads':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kodeAdsChartData}>
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
      case 'performa-cs':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performaCSData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="prospek" fill="#2563eb" name="Total Prospek" />
              <Bar dataKey="leads" fill="#16a34a" name="Leads" />
              <Bar dataKey="bukanLeads" fill="#dc2626" name="Bukan Leads" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Chart akan segera tersedia
          </div>
        );
    }
  };

  const getCTRColor = (ctr: number) => {
    if (ctr >= 30) return 'bg-green-100 text-green-800';
    if (ctr >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'sumber-leads':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">Tabel Sumber Leads</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Prospek</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Leads</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">CTR Leads</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sumberLeadsChartData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
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
      case 'kode-ads':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">Tabel Kode Ads</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Prospek</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Leads</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">CTR Leads</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kodeAdsChartData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
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
      case 'performa-cs':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">Tabel Performa CS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama CS</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Prospek</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Leads</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Bukan Leads</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">CTR Leads</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performaCSData.map((cs, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cs.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{cs.prospek}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-center font-medium">{cs.leads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">{cs.bukanLeads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(cs.ctr)}`}>
                          {cs.ctr}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Tabel akan segera tersedia
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{getTitle()}</h2>
        <p className="text-gray-600">Analisis performa leads dan prospek</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="layanan">Layanan</TabsTrigger>
          <TabsTrigger value="performa-cs">Performa CS</TabsTrigger>
          <TabsTrigger value="kota-kabupaten">Kota/Kabupaten</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="sumber-leads">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Distribusi Sumber Leads</CardTitle>
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
        </TabsContent>

        <TabsContent value="kode-ads">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Distribusi Kode Ads</CardTitle>
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
        </TabsContent>

        <TabsContent value="layanan">
          <div className="text-center py-8 text-gray-500">
            Laporan layanan akan segera tersedia
          </div>
        </TabsContent>

        <TabsContent value="performa-cs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Performa CS</CardTitle>
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
        </TabsContent>

        <TabsContent value="kota-kabupaten">
          <div className="text-center py-8 text-gray-500">
            Laporan kota/kabupaten akan segera tersedia
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <div className="text-center py-8 text-gray-500">
            Laporan funnel akan segera tersedia
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <div className="text-center py-8 text-gray-500">
            Laporan heatmap akan segera tersedia
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
