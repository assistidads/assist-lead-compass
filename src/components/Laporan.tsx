import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, Users, Target, Award } from 'lucide-react';
import { MetricCard } from './MetricCard';
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
  const [selectedReport, setSelectedReport] = useState('overview');
  const [organikOpen, setOrganikOpen] = useState(false);

  // Data untuk chart sumber leads dengan organik
  const sumberLeadsChartData = useMemo(() => {
    const regularSources: SumberLeadsDataItem[] = sumberLeadsData
      .filter(sumber => 
        sumber.nama.toLowerCase().includes('ads') || 
        sumber.nama.toLowerCase().includes('refferal')
      )
      .map(sumber => {
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
      })
      .filter(item => item.value > 0);

    // Hitung organik
    const organikSources = sumberLeadsData.filter(sumber => 
      !sumber.nama.toLowerCase().includes('ads') && 
      !sumber.nama.toLowerCase().includes('refferal')
    );

    if (organikSources.length > 1) {
      const organikProspek = organikSources.reduce((total, sumber) => {
        return total + prospekData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
      }, 0);
      
      const organikLeads = organikSources.reduce((total, sumber) => {
        return total + prospekData.filter(item => 
          item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
        ).length;
      }, 0);

      const organikCtr = organikProspek > 0 ? (organikLeads / organikProspek) * 100 : 0;

      if (organikProspek > 0) {
        const organikData: SumberLeadsDataItem = {
          name: 'Organik',
          value: organikProspek,
          prospek: organikProspek,
          leads: organikLeads,
          ctr: parseFloat(organikCtr.toFixed(1)),
          isOrganik: true
        };

        return [organikData, ...regularSources];
      }
    }

    return regularSources;
  }, [prospekData, sumberLeadsData]);

  // Data untuk breakdown organik
  const organikBreakdown = useMemo(() => {
    const organikSources = sumberLeadsData.filter(sumber => 
      !sumber.nama.toLowerCase().includes('ads') && 
      !sumber.nama.toLowerCase().includes('refferal')
    );

    return organikSources.map(sumber => {
      const prospekCount = prospekData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
      const leadsCount = prospekData.filter(item => 
        item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
      ).length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;
      
      return {
        nama: sumber.nama,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1))
      };
    }).filter(item => item.prospek > 0);
  }, [prospekData, sumberLeadsData]);

  // Data untuk chart kode ads dengan breakdown
  const kodeAdsChartData = useMemo(() => {
    return kodeAdsData.map(kode => {
      const prospekItems = prospekData.filter(item => item.kode_ads?.kode === kode.kode);
      const prospekCount = prospekItems.length;
      const leadsCount = prospekItems.filter(item => item.status_leads === 'Leads').length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;

      // Group by ID Ads untuk breakdown
      const idAdsBreakdown = prospekItems.reduce((acc, item) => {
        if (item.id_ads) {
          if (!acc[item.id_ads]) {
            acc[item.id_ads] = { prospek: 0, leads: 0 };
          }
          acc[item.id_ads].prospek++;
          if (item.status_leads === 'Leads') {
            acc[item.id_ads].leads++;
          }
        }
        return acc;
      }, {} as Record<string, { prospek: number; leads: number }>);

      const breakdown = Object.entries(idAdsBreakdown)
        .map(([idAds, data]) => ({
          idAds,
          prospek: data.prospek,
          leads: data.leads,
          ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
        }))
        .sort((a, b) => b.prospek - a.prospek);

      return {
        name: kode.kode,
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1)),
        breakdown
      };
    }).filter(item => item.value > 0 && item.breakdown.length > 1);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Laporan Analisis & Chart</h2>
        <p className="text-gray-600">Analisis mendalam data leads dan performa</p>
      </div>

      {/* Report Type Selector */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Pilih Jenis Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Pilih jenis laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="sumber-leads">Sumber Leads</SelectItem>
              <SelectItem value="kode-ads">Kode Ads</SelectItem>
              <SelectItem value="layanan">Layanan</SelectItem>
              <SelectItem value="funnel">Funnel Konversi</SelectItem>
              <SelectItem value="heatmap">Heatmap</SelectItem>
              <SelectItem value="performa-cs">Performa CS</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Conditional Rendering Based on Selected Report */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Prospek"
            value={prospekData.length}
            change={0}
            icon={Users}
          />
          <MetricCard
            title="Total Leads"
            value={prospekData.filter(item => item.status_leads === 'Leads').length}
            change={0}
            icon={Target}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${prospekData.length > 0 ? ((prospekData.filter(item => item.status_leads === 'Leads').length / prospekData.length) * 100).toFixed(1) : 0}%`}
            change={0}
            icon={TrendingUp}
          />
          <MetricCard
            title="Sumber Terbaik"
            value={sumberLeadsChartData.length > 0 ? sumberLeadsChartData.sort((a, b) => b.ctr - a.ctr)[0].name : 'N/A'}
            change={0}
            icon={Award}
          />
        </div>
      )}

      {selectedReport === 'sumber-leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Chart Sumber Leads</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Table Sumber Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sumberLeadsChartData.map((item, index) => (
                  <div key={index}>
                    {item.isOrganik ? (
                      <Collapsible open={organikOpen} onOpenChange={setOrganikOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-medium">{item.name}</span>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Prospek: {item.prospek}</span>
                                <span>Leads: {item.leads}</span>
                                <span>CTR: {item.ctr}%</span>
                                {organikOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </div>
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4">
                          <div className="space-y-1 mt-2 border-l-2 border-gray-200 pl-4">
                            {organikBreakdown.map((breakdown, idx) => (
                              <div key={idx} className="flex justify-between items-center py-1 text-sm">
                                <span>{breakdown.nama}</span>
                                <div className="flex items-center gap-4 text-gray-600">
                                  <span>Prospek: {breakdown.prospek}</span>
                                  <span>Leads: {breakdown.leads}</span>
                                  <span>CTR: {breakdown.ctr}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Prospek: {item.prospek}</span>
                          <span>Leads: {item.leads}</span>
                          <span>CTR: {item.ctr}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedReport === 'kode-ads' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Chart Kode Ads</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Table Kode Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {kodeAdsChartData.map((item, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Prospek: {item.prospek}</span>
                            <span>Leads: {item.leads}</span>
                            <span>CTR: {item.ctr}%</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <div className="space-y-1 mt-2 border-l-2 border-gray-200 pl-4">
                        {item.breakdown.map((breakdown, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 text-sm">
                            <span>ID: {breakdown.idAds}</span>
                            <div className="flex items-center gap-4 text-gray-600">
                              <span>Prospek: {breakdown.prospek}</span>
                              <span>Leads: {breakdown.leads}</span>
                              <span>CTR: {breakdown.ctr}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedReport === 'performa-cs' && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Chart Performa CS</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
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
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Table Performa CS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nama CS</th>
                      <th className="text-right py-2">Total Prospek</th>
                      <th className="text-right py-2">Leads</th>
                      <th className="text-right py-2">Bukan Leads</th>
                      <th className="text-right py-2">Conversion Rate</th>
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Placeholder sections for other reports */}
      {selectedReport === 'funnel' && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Funnel Konversi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Laporan Funnel Konversi akan segera tersedia
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === 'heatmap' && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Laporan Heatmap akan segera tersedia
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
