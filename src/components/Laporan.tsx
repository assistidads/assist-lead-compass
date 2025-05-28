
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { Download, FileText, ChevronDown } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

export function Laporan() {
  const { prospekData, sumberLeadsData, kodeAdsData, layananData, loading } = useSupabaseData();
  const [dateFilter, setDateFilter] = useState('bulan-ini');

  // Filter data berdasarkan periode
  const filteredData = useMemo(() => {
    const today = new Date();
    
    return prospekData.filter(item => {
      const itemDate = new Date(item.tanggal_prospek);
      
      switch (dateFilter) {
        case 'hari-ini':
          return itemDate.toDateString() === today.toDateString();
        case 'kemarin':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return itemDate.toDateString() === yesterday.toDateString();
        case 'minggu-ini':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return itemDate >= startOfWeek && itemDate <= today;
        case 'minggu-lalu':
          const startOfLastWeek = new Date(today);
          startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
          const endOfLastWeek = new Date(startOfLastWeek);
          endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
          return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
        case 'bulan-ini':
          return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        case 'bulan-lalu':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
        default:
          return true;
      }
    });
  }, [prospekData, dateFilter]);

  // Data untuk chart sumber leads
  const sumberLeadsChartData = useMemo(() => {
    return sumberLeadsData.map(sumber => {
      const count = filteredData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
      return {
        name: sumber.nama,
        value: count,
        prospek: count,
        leads: filteredData.filter(item => item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads').length,
        ctr: count > 0 ? Math.round((filteredData.filter(item => item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads').length / count) * 100) : 0
      };
    }).filter(item => item.value > 0);
  }, [sumberLeadsData, filteredData]);

  // Data untuk chart kode ads
  const kodeAdsChartData = useMemo(() => {
    return kodeAdsData.map(kode => {
      const count = filteredData.filter(item => item.kode_ads?.kode === kode.kode).length;
      return {
        name: kode.kode,
        value: count,
        prospek: count,
        leads: filteredData.filter(item => item.kode_ads?.kode === kode.kode && item.status_leads === 'Leads').length,
        ctr: count > 0 ? Math.round((filteredData.filter(item => item.kode_ads?.kode === kode.kode && item.status_leads === 'Leads').length / count) * 100) : 0
      };
    }).filter(item => item.value > 0);
  }, [kodeAdsData, filteredData]);

  // Data untuk chart layanan assist
  const layananAssistChartData = useMemo(() => {
    return layananData.map(layanan => {
      const count = filteredData.filter(item => item.layanan_assist?.nama === layanan.nama).length;
      return {
        layanan: layanan.nama,
        prospek: count,
        leads: filteredData.filter(item => item.layanan_assist?.nama === layanan.nama && item.status_leads === 'Leads').length,
        ctr: count > 0 ? Math.round((filteredData.filter(item => item.layanan_assist?.nama === layanan.nama && item.status_leads === 'Leads').length / count) * 100) : 0
      };
    }).filter(item => item.prospek > 0);
  }, [layananData, filteredData]);

  // Data untuk chart kota
  const kotaChartData = useMemo(() => {
    const kotaMap = new Map();
    
    filteredData.forEach(item => {
      const kota = item.kota;
      if (!kotaMap.has(kota)) {
        kotaMap.set(kota, { prospek: 0, leads: 0 });
      }
      const current = kotaMap.get(kota);
      current.prospek += 1;
      if (item.status_leads === 'Leads') {
        current.leads += 1;
      }
    });

    return Array.from(kotaMap.entries()).map(([kota, data]) => ({
      kota,
      prospek: data.prospek,
      leads: data.leads,
      ctr: data.prospek > 0 ? Math.round((data.leads / data.prospek) * 100) : 0
    })).sort((a, b) => b.prospek - a.prospek).slice(0, 10); // Top 10 kota
  }, [filteredData]);

  // Data untuk funnel konversi
  const funnelData = useMemo(() => {
    const totalProspek = filteredData.length;
    const dihubungi = filteredData.filter(item => item.status_leads === 'Dihubungi').length;
    const onGoing = filteredData.filter(item => item.status_leads === 'On Going').length;
    const leads = filteredData.filter(item => item.status_leads === 'Leads').length;

    return [
      { name: 'Total Prospek', value: totalProspek, fill: '#3b82f6' },
      { name: 'Dihubungi', value: dihubungi, fill: '#10b981' },
      { name: 'On Going', value: onGoing, fill: '#f59e0b' },
      { name: 'Leads', value: leads, fill: '#ef4444' },
    ];
  }, [filteredData]);

  const renderPieChart = (data: any[], title: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Tidak ada data untuk periode yang dipilih
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBarChart = (data: any[], title: string, xKey: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prospek" fill="#94a3b8" name="Prospek" />
              <Bar dataKey="leads" fill="#2563eb" name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Tidak ada data untuk periode yang dipilih
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTable = (data: any[], title: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {Object.keys(data[0])[0].charAt(0).toUpperCase() + Object.keys(data[0])[0].slice(1)}
                </TableHead>
                <TableHead className="text-right">Prospek</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">CTR Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{Object.values(item)[0] as string}</TableCell>
                  <TableCell className="text-right">{item.prospek}</TableCell>
                  <TableCell className="text-right">{item.leads}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                      item.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.ctr}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Tidak ada data untuk periode yang dipilih
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Memuat data laporan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Laporan</h2>
          <p className="text-gray-600">Analisis performa leads dan prospek berdasarkan data real</p>
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hari-ini">Hari Ini</SelectItem>
            <SelectItem value="kemarin">Kemarin</SelectItem>
            <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
            <SelectItem value="minggu-lalu">Minggu Lalu</SelectItem>
            <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
            <SelectItem value="bulan-lalu">Bulan Kemarin</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabbed Reports */}
      <Tabs defaultValue="sumber-leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="layanan-assist">Layanan Assist</TabsTrigger>
          <TabsTrigger value="kota">Kota/Kabupaten</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Konversi</TabsTrigger>
        </TabsList>

        <TabsContent value="sumber-leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(sumberLeadsChartData, 'Distribusi Sumber Leads')}
            {renderTable(sumberLeadsChartData, 'Tabel Sumber Leads')}
          </div>
        </TabsContent>

        <TabsContent value="kode-ads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(kodeAdsChartData, 'Distribusi Kode Ads')}
            {renderTable(kodeAdsChartData, 'Tabel Kode Ads')}
          </div>
        </TabsContent>

        <TabsContent value="layanan-assist" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(layananAssistChartData, 'Layanan Assist', 'layanan')}
            {renderTable(layananAssistChartData, 'Tabel Layanan Assist')}
          </div>
        </TabsContent>

        <TabsContent value="kota" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(kotaChartData, 'Top 10 Kota/Kabupaten', 'kota')}
            {renderTable(kotaChartData, 'Tabel Kota/Kabupaten')}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Funnel Konversi</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {funnelData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" stroke="none" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-500">
                  Tidak ada data untuk periode yang dipilih
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
