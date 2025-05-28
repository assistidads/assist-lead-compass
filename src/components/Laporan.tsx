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

// Type definitions for better TypeScript support
interface SumberLeadsDataItem {
  name: string;
  value: number;
  prospek: number;
  leads: number;
  ctr: number;
  isOrganik?: boolean;
}

interface KodeAdsDataItem {
  name: string;
  value: number;
  prospek: number;
  leads: number;
  ctr: number;
  breakdown: Array<{
    idAds: string;
    prospek: number;
    leads: number;
    ctr: number;
  }>;
}

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

  // Data untuk organik (sumber leads yang tidak mengandung "Ads" atau "Refferal")
  const organikData = useMemo(() => {
    const organikSources = sumberLeadsData.filter(sumber => 
      !sumber.nama.toLowerCase().includes('ads') && 
      !sumber.nama.toLowerCase().includes('refferal')
    );
    
    const organikProspek = filteredData.filter(item => 
      organikSources.some(source => source.nama === item.sumber_leads?.nama)
    );
    
    const organikLeads = organikProspek.filter(item => item.status_leads === 'Leads');
    
    return {
      prospek: organikProspek.length,
      leads: organikLeads.length,
      ctr: organikProspek.length > 0 ? Math.round((organikLeads.length / organikProspek.length) * 100) : 0,
      breakdown: organikSources.map(source => {
        const sourceProspek = filteredData.filter(item => item.sumber_leads?.nama === source.nama);
        const sourceLeads = sourceProspek.filter(item => item.status_leads === 'Leads');
        return {
          name: source.nama,
          prospek: sourceProspek.length,
          leads: sourceLeads.length,
          ctr: sourceProspek.length > 0 ? Math.round((sourceLeads.length / sourceProspek.length) * 100) : 0
        };
      }).filter(item => item.prospek > 0)
    };
  }, [sumberLeadsData, filteredData]);

  // Data untuk chart sumber leads dengan organik
  const sumberLeadsChartData = useMemo(() => {
    const regularSources: SumberLeadsDataItem[] = sumberLeadsData
      .filter(sumber => 
        sumber.nama.toLowerCase().includes('ads') || 
        sumber.nama.toLowerCase().includes('refferal')
      )
      .map(sumber => {
        const count = filteredData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
        return {
          name: sumber.nama,
          value: count,
          prospek: count,
          leads: filteredData.filter(item => item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads').length,
          ctr: count > 0 ? Math.round((filteredData.filter(item => item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads').length / count) * 100) : 0
        };
      }).filter(item => item.value > 0);

    // Tambahkan organik di awal jika ada data
    if (organikData.prospek > 0) {
      return [
        {
          name: 'Organik',
          value: organikData.prospek,
          prospek: organikData.prospek,
          leads: organikData.leads,
          ctr: organikData.ctr,
          isOrganik: true
        },
        ...regularSources
      ];
    }
    
    return regularSources;
  }, [sumberLeadsData, filteredData, organikData]);

  // Data untuk chart kode ads dengan breakdown ID Ads
  const kodeAdsChartData = useMemo(() => {
    return kodeAdsData.map(kode => {
      const kodeProspek = filteredData.filter(item => item.kode_ads?.kode === kode.kode);
      const kodeLeads = kodeProspek.filter(item => item.status_leads === 'Leads');
      
      // Breakdown berdasarkan ID Ads
      const idAdsBreakdown = new Map();
      kodeProspek.forEach(item => {
        if (item.id_ads) {
          if (!idAdsBreakdown.has(item.id_ads)) {
            idAdsBreakdown.set(item.id_ads, { prospek: 0, leads: 0 });
          }
          const current = idAdsBreakdown.get(item.id_ads);
          current.prospek += 1;
          if (item.status_leads === 'Leads') {
            current.leads += 1;
          }
        }
      });

      const breakdown = Array.from(idAdsBreakdown.entries()).map(([idAds, data]) => ({
        idAds,
        prospek: data.prospek,
        leads: data.leads,
        ctr: data.prospek > 0 ? Math.round((data.leads / data.prospek) * 100) : 0
      }));

      return {
        name: kode.kode,
        value: kodeProspek.length,
        prospek: kodeProspek.length,
        leads: kodeLeads.length,
        ctr: kodeProspek.length > 0 ? Math.round((kodeLeads.length / kodeProspek.length) * 100) : 0,
        breakdown: breakdown.filter(item => breakdown.length > 1) // Hanya tampilkan jika ID Ads > 1
      };
    }).filter(item => item.value > 0);
  }, [kodeAdsData, filteredData]);

  // Data untuk layanan assist
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
    })).sort((a, b) => b.prospek - a.prospek).slice(0, 10);
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

  // Data untuk heatmap (simulasi berdasarkan waktu dan hari)
  const heatmapData = useMemo(() => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return days.map(day => ({
      day,
      data: hours.map(hour => ({
        hour,
        value: Math.floor(Math.random() * 50) // Simulasi data
      }))
    }));
  }, []);

  // Data performas CS
  const csPerformanceData = useMemo(() => {
    const csMap = new Map();
    
    filteredData.forEach(item => {
      const csName = item.pic_leads?.full_name || item.created_by_profile?.full_name || 'Unknown';
      if (!csMap.has(csName)) {
        csMap.set(csName, { prospek: 0, leads: 0, dihubungi: 0 });
      }
      const current = csMap.get(csName);
      current.prospek += 1;
      if (item.status_leads === 'Leads') {
        current.leads += 1;
      }
      if (item.status_leads === 'Dihubungi') {
        current.dihubungi += 1;
      }
    });

    return Array.from(csMap.entries()).map(([name, data]) => ({
      name,
      prospek: data.prospek,
      leads: data.leads,
      dihubungi: data.dihubungi,
      ctr: data.prospek > 0 ? Math.round((data.leads / data.prospek) * 100) : 0,
      contactRate: data.prospek > 0 ? Math.round((data.dihubungi / data.prospek) * 100) : 0
    })).sort((a, b) => b.prospek - a.prospek);
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

  const renderSumberLeadsTable = () => (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Tabel Sumber Leads</CardTitle>
      </CardHeader>
      <CardContent>
        {sumberLeadsChartData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sumber Leads</TableHead>
                <TableHead className="text-right">Prospek</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">CTR Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sumberLeadsChartData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.isOrganik ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="organik">
                          <AccordionTrigger className="text-left p-0 hover:no-underline">
                            {item.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="mt-2 space-y-1">
                              {organikData.breakdown.map((breakdown, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">• {breakdown.name}</span>
                                  <span>{breakdown.prospek} prospek, {breakdown.leads} leads ({breakdown.ctr}%)</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      item.name
                    )}
                  </TableCell>
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

  const renderKodeAdsTable = () => (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Tabel Kode Ads</CardTitle>
      </CardHeader>
      <CardContent>
        {kodeAdsChartData.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {kodeAdsChartData.map((item, index) => (
              <AccordionItem key={index} value={`kode-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full mr-4">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex gap-4 text-sm">
                      <span>{item.prospek} prospek</span>
                      <span>{item.leads} leads</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                        item.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.ctr}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {item.breakdown.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Ads</TableHead>
                          <TableHead className="text-right">Prospek</TableHead>
                          <TableHead className="text-right">Leads</TableHead>
                          <TableHead className="text-right">CTR Leads</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.breakdown.map((breakdown, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{breakdown.idAds}</TableCell>
                            <TableCell className="text-right">{breakdown.prospek}</TableCell>
                            <TableCell className="text-right">{breakdown.leads}</TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                breakdown.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                                breakdown.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {breakdown.ctr}%
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Tidak ada breakdown ID Ads (hanya 1 ID Ads)
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="layanan-assist">Layanan Assist</TabsTrigger>
          <TabsTrigger value="kota">Kota/Kabupaten</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Konversi</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="performas-cs">Performas CS</TabsTrigger>
        </TabsList>

        <TabsContent value="sumber-leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(sumberLeadsChartData, 'Distribusi Sumber Leads')}
            {renderSumberLeadsTable()}
          </div>
        </TabsContent>

        <TabsContent value="kode-ads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(kodeAdsChartData, 'Distribusi Kode Ads')}
            {renderKodeAdsTable()}
          </div>
        </TabsContent>

        <TabsContent value="layanan-assist" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(layananAssistChartData, 'Layanan Assist', 'layanan')}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Tabel Layanan Assist</CardTitle>
              </CardHeader>
              <CardContent>
                {layananAssistChartData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Layanan</TableHead>
                        <TableHead className="text-right">Prospek</TableHead>
                        <TableHead className="text-right">Leads</TableHead>
                        <TableHead className="text-right">CTR Leads</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {layananAssistChartData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.layanan}</TableCell>
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
          </div>
        </TabsContent>

        <TabsContent value="kota" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(kotaChartData, 'Top 10 Kota/Kabupaten', 'kota')}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Tabel Kota/Kabupaten</CardTitle>
              </CardHeader>
              <CardContent>
                {kotaChartData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kota</TableHead>
                        <TableHead className="text-right">Prospek</TableHead>
                        <TableHead className="text-right">Leads</TableHead>
                        <TableHead className="text-right">CTR Leads</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kotaChartData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.kota}</TableCell>
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

        <TabsContent value="heatmap" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Heatmap Aktivitas Prospek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Fitur heatmap akan segera hadir - menampilkan pola aktivitas prospek berdasarkan waktu dan hari
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performas-cs" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performas CS</CardTitle>
            </CardHeader>
            <CardContent>
              {csPerformanceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama CS</TableHead>
                      <TableHead className="text-right">Total Prospek</TableHead>
                      <TableHead className="text-right">Dihubungi</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                      <TableHead className="text-right">Contact Rate</TableHead>
                      <TableHead className="text-right">CTR Leads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csPerformanceData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.prospek}</TableCell>
                        <TableCell className="text-right">{item.dihubungi}</TableCell>
                        <TableCell className="text-right">{item.leads}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.contactRate >= 80 ? 'bg-green-100 text-green-800' : 
                            item.contactRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.contactRate}%
                          </span>
                        </TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
