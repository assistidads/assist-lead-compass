
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { Download, FileText } from 'lucide-react';

// Sample data for reports
const kodeAdsData = [
  { name: 'META', prospek: 150, leads: 45, ctr: 30 },
  { name: 'GOOG', prospek: 120, leads: 28, ctr: 23.3 },
  { name: 'TKTK', prospek: 90, leads: 32, ctr: 35.6 },
  { name: 'FB01', prospek: 75, leads: 18, ctr: 24 },
];

const kotaData = [
  { kota: 'Jakarta', prospek: 200, leads: 65, ctr: 32.5 },
  { kota: 'Surabaya', prospek: 150, leads: 42, ctr: 28 },
  { kota: 'Bandung', prospek: 120, leads: 35, ctr: 29.2 },
  { kota: 'Medan', prospek: 100, leads: 28, ctr: 28 },
  { kota: 'Semarang', prospek: 85, leads: 23, ctr: 27.1 },
];

const sumberLeadsData = [
  { name: 'Meta Ads', value: 35, prospek: 180, leads: 63 },
  { name: 'Google Ads', value: 28, prospek: 150, leads: 42 },
  { name: 'Website Organik', value: 20, prospek: 100, leads: 20 },
  { name: 'Referral', value: 17, prospek: 85, leads: 17 },
];

const funnelData = [
  { name: 'Total Prospek', value: 515 },
  { name: 'Dihubungi', value: 412 },
  { name: 'Tertarik', value: 206 },
  { name: 'Leads', value: 142 },
];

const performaCSData = [
  { nama: 'CS Support 1', prospek: 180, leads: 54, ctr: 30 },
  { nama: 'CS Support 2', prospek: 165, leads: 45, ctr: 27.3 },
  { nama: 'CS Support 3', prospek: 170, leads: 43, ctr: 25.3 },
];

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

export function Laporan() {
  const [dateFilter, setDateFilter] = useState('bulan-ini');

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
      </CardContent>
    </Card>
  );

  const renderTable = (data: any[], title: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {Object.keys(data[0])[0].charAt(0).toUpperCase() + Object.keys(data[0])[0].slice(1)}
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Jumlah Prospek</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Jumlah Leads</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">CTR Leads</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{Object.values(item)[0]}</td>
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
  );

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Laporan</h2>
          <p className="text-gray-600">Analisis performa leads dan prospek</p>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPieChart(sumberLeadsData, 'Distribusi Sumber Leads')}
        {renderBarChart(kotaData, 'Prospek & Leads per Kota', 'kota')}
      </div>

      {/* Funnel Chart */}
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
          <ResponsiveContainer width="100%" height={300}>
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
        </CardContent>
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTable(kodeAdsData, 'Performa Kode Ads')}
        {renderTable(performaCSData, 'Performa CS')}
      </div>
    </div>
  );
}
