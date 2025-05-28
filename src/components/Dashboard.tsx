
import { MetricCard } from './MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Target, TrendingUp, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export function Dashboard() {
  const { prospekData, layananData, loading } = useSupabaseData();
  const [timeFilter, setTimeFilter] = useState('bulan-ini');

  // Filter data berdasarkan periode yang dipilih
  const filteredData = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return prospekData.filter(item => {
      const itemDate = new Date(item.tanggal_prospek);
      
      switch (timeFilter) {
        case 'hari-ini':
          return itemDate.toDateString() === today.toDateString();
        case 'kemarin':
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
  }, [prospekData, timeFilter]);

  // Hitung metrik berdasarkan data real
  const todayData = prospekData.filter(item => {
    const itemDate = new Date(item.tanggal_prospek);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString();
  });

  const yesterdayData = prospekData.filter(item => {
    const itemDate = new Date(item.tanggal_prospek);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return itemDate.toDateString() === yesterday.toDateString();
  });

  const thisMonthData = prospekData.filter(item => {
    const itemDate = new Date(item.tanggal_prospek);
    const today = new Date();
    return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
  });

  const lastMonthData = prospekData.filter(item => {
    const itemDate = new Date(item.tanggal_prospek);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
  });

  // Hitung perubahan persentase
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Data untuk chart tren 7 hari terakhir
  const trendData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayData = prospekData.filter(item => {
        const itemDate = new Date(item.tanggal_prospek);
        return itemDate.toDateString() === date.toDateString();
      });

      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
      
      last7Days.push({
        name: dayName,
        prospek: dayData.length,
        leads: dayData.filter(item => item.status_leads === 'Leads').length
      });
    }
    return last7Days;
  }, [prospekData]);

  // Data untuk chart layanan berdasarkan data real
  const layananChartData = useMemo(() => {
    return layananData.map(layanan => {
      const layananProspek = filteredData.filter(item => item.layanan_assist?.nama === layanan.nama);
      const leads = layananProspek.filter(item => item.status_leads === 'Leads');
      
      return {
        layanan: layanan.nama,
        prospek: layananProspek.length,
        leads: leads.length,
        ctr: layananProspek.length > 0 ? Math.round((leads.length / layananProspek.length) * 100) : 0
      };
    }).filter(item => item.prospek > 0); // Hanya tampilkan layanan yang ada datanya
  }, [layananData, filteredData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Memuat data dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Period */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Overview Metrik</h2>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Prospek Hari Ini"
          value={todayData.length.toString()}
          change={calculateChange(todayData.length, yesterdayData.length)}
          changeLabel="vs kemarin"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Leads Hari Ini"
          value={todayData.filter(item => item.status_leads === 'Leads').length.toString()}
          change={calculateChange(
            todayData.filter(item => item.status_leads === 'Leads').length,
            yesterdayData.filter(item => item.status_leads === 'Leads').length
          )}
          changeLabel="vs kemarin"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Prospek Bulan Ini"
          value={thisMonthData.length.toString()}
          change={calculateChange(thisMonthData.length, lastMonthData.length)}
          changeLabel="vs bulan lalu"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Leads Bulan Ini"
          value={thisMonthData.filter(item => item.status_leads === 'Leads').length.toString()}
          change={calculateChange(
            thisMonthData.filter(item => item.status_leads === 'Leads').length,
            lastMonthData.filter(item => item.status_leads === 'Leads').length
          )}
          changeLabel="vs bulan lalu"
          icon={<Phone className="h-5 w-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Tren Prospek & Leads (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="prospek" stroke="#2563eb" strokeWidth={3} name="Prospek" />
                <Line type="monotone" dataKey="leads" stroke="#16a34a" strokeWidth={3} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Performance Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Prospek & Leads per Layanan Assist</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={layananChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="layanan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prospek" fill="#94a3b8" name="Prospek" />
                <Bar dataKey="leads" fill="#2563eb" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Performa Layanan Assist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Layanan Assist</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Jumlah Prospek</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Jumlah Leads</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">CTR Leads</th>
                </tr>
              </thead>
              <tbody>
                {layananChartData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{item.layanan}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{item.prospek}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{item.leads}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                        item.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.ctr}%
                      </span>
                    </td>
                  </tr>
                ))}
                {layananChartData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Belum ada data prospek untuk periode yang dipilih
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
