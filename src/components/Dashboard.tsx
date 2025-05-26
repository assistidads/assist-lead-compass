
import { MetricCard } from './MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Target, TrendingUp, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const trendData = [
  { name: 'Sen', prospek: 45, leads: 12 },
  { name: 'Sel', prospek: 52, leads: 18 },
  { name: 'Rab', prospek: 38, leads: 15 },
  { name: 'Kam', prospek: 61, leads: 22 },
  { name: 'Jum', prospek: 55, leads: 19 },
  { name: 'Sab', prospek: 42, leads: 14 },
  { name: 'Min', prospek: 48, leads: 16 },
];

const layananData = [
  { layanan: 'SIMRS', prospek: 150, leads: 45, ctr: 30 },
  { layanan: 'Telemedicine', prospek: 120, leads: 28, ctr: 23.3 },
  { layanan: 'EMR', prospek: 90, leads: 32, ctr: 35.6 },
  { layanan: 'Farmasi', prospek: 75, leads: 18, ctr: 24 },
  { layanan: 'Laboratory', prospek: 60, leads: 21, ctr: 35 },
];

export function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('bulan-ini');

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
          value="24"
          change={12}
          changeLabel="vs kemarin"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Leads Hari Ini"
          value="8"
          change={25}
          changeLabel="vs kemarin"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Prospek Minggu Ini"
          value="156"
          change={8}
          changeLabel="vs minggu lalu"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="CTR Leads Bulan Ini"
          value="28.5%"
          change={-2}
          changeLabel="vs bulan lalu"
          icon={<Phone className="h-5 w-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Tren Prospek & Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="prospek" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="leads" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Performance Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Leads per Layanan Assist</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={layananData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="layanan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#2563eb" />
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
                {layananData.map((item, index) => (
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
