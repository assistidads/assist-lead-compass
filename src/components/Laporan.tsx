
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

interface LaporanProps {
  reportType: string;
}

export function Laporan({ reportType }: LaporanProps) {
  const { prospekData, sumberLeadsData, kodeAdsData, layananData, loading } = useSupabaseData();

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
    switch (reportType) {
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
    switch (reportType) {
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
    switch (reportType) {
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

  const renderTable = () => {
    switch (reportType) {
      case 'sumber-leads':
        return (
          <div className="space-y-2">
            {sumberLeadsChartData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Prospek: {item.prospek}</span>
                  <span>Leads: {item.leads}</span>
                  <span>CTR: {item.ctr}%</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'kode-ads':
        return (
          <div className="space-y-2">
            {kodeAdsChartData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Prospek: {item.prospek}</span>
                  <span>Leads: {item.leads}</span>
                  <span>CTR: {item.ctr}%</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'performa-cs':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nama CS</th>
                  <th className="text-right py-2">Total Prospek</th>
                  <th className="text-right py-2">Leads</th>
                  <th className="text-right py-2">Bukan Leads</th>
                  <th className="text-right py-2">CTR Leads</th>
                </tr>
              </thead>
              <tbody>
                {performaCSData.map((cs, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{cs.name}</td>
                    <td className="text-right py-2">{cs.prospek}</td>
                    <td className="text-right py-2 text-green-600">{cs.leads}</td>
                    <td className="text-right py-2 text-red-600">{cs.bukanLeads}</td>
                    <td className="text-right py-2 font-medium">{cs.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{getTitle()}</h2>
          <p className="text-gray-600">Analisis performa leads dan prospek</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{getSubtitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTable()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
