import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { Download, FileText, Activity } from 'lucide-react';

// Sample data for reports
const sumberLeadsData = [
  { name: 'Meta Ads', value: 35, prospek: 180, leads: 63, ctr: 35 },
  { name: 'Google Ads', value: 28, prospek: 150, leads: 42, ctr: 28 },
  { name: 'Website Organik', value: 20, prospek: 100, leads: 20, ctr: 20 },
  { name: 'Referral', value: 17, prospek: 85, leads: 17, ctr: 20 },
];

const kodeAdsData = [
  { 
    name: 'META', 
    value: 30, 
    prospek: 150, 
    leads: 45, 
    ctr: 30,
    idAds: [
      { id: 'META-001', prospek: 80, leads: 25, ctr: 31.25 },
      { id: 'META-002', prospek: 70, leads: 20, ctr: 28.57 }
    ]
  },
  { 
    name: 'GOOG', 
    value: 25, 
    prospek: 120, 
    leads: 30, 
    ctr: 25,
    idAds: [
      { id: 'GOOG-001', prospek: 60, leads: 15, ctr: 25 },
      { id: 'GOOG-002', prospek: 40, leads: 10, ctr: 25 },
      { id: 'GOOG-003', prospek: 20, leads: 5, ctr: 25 }
    ]
  },
  { 
    name: 'TKTK', 
    value: 20, 
    prospek: 90, 
    leads: 18, 
    ctr: 20,
    idAds: [
      { id: 'TKTK-001', prospek: 50, leads: 10, ctr: 20 },
      { id: 'TKTK-002', prospek: 40, leads: 8, ctr: 20 }
    ]
  },
  { 
    name: 'FB01', 
    value: 15, 
    prospek: 75, 
    leads: 11, 
    ctr: 15,
    idAds: [
      { id: 'FB01-001', prospek: 75, leads: 11, ctr: 15 }
    ]
  },
];

const layananAssistData = [
  { layanan: 'SIMRS', prospek: 200, leads: 65, ctr: 32.5 },
  { layanan: 'Telemedicine', prospek: 150, leads: 42, ctr: 28 },
  { layanan: 'EMR', prospek: 120, leads: 35, ctr: 29.2 },
  { layanan: 'Farmasi', prospek: 100, leads: 28, ctr: 28 },
];

const kotaData = [
  { kota: 'Jakarta', prospek: 200, leads: 65, ctr: 32.5 },
  { kota: 'Surabaya', prospek: 150, leads: 42, ctr: 28 },
  { kota: 'Bandung', prospek: 120, leads: 35, ctr: 29.2 },
  { kota: 'Medan', prospek: 100, leads: 28, ctr: 28 },
  { kota: 'Semarang', prospek: 85, leads: 23, ctr: 27.1 },
];

const funnelData = [
  { name: 'Total Prospek', value: 515, fill: '#3b82f6' },
  { name: 'Dihubungi', value: 412, fill: '#10b981' },
  { name: 'Tertarik', value: 206, fill: '#f59e0b' },
  { name: 'Leads', value: 142, fill: '#ef4444' },
];

const performaCSData = [
  { nama: 'CS Support 1', prospek: 180, leads: 54, ctr: 30 },
  { nama: 'CS Support 2', prospek: 165, leads: 45, ctr: 27.3 },
  { nama: 'CS Support 3', prospek: 170, leads: 43, ctr: 25.3 },
];

// Heatmap data (hours of the day vs days of the week)
const heatmapData = [
  { hour: '00:00', mon: 2, tue: 1, wed: 3, thu: 2, fri: 1, sat: 4, sun: 3 },
  { hour: '01:00', mon: 1, tue: 0, wed: 1, thu: 1, fri: 0, sat: 2, sun: 1 },
  { hour: '02:00', mon: 0, tue: 1, wed: 0, thu: 0, fri: 1, sat: 1, sun: 0 },
  { hour: '08:00', mon: 15, tue: 12, wed: 18, thu: 14, fri: 16, sat: 8, sun: 6 },
  { hour: '09:00', mon: 25, tue: 22, wed: 28, thu: 24, fri: 26, sat: 12, sun: 10 },
  { hour: '10:00', mon: 30, tue: 28, wed: 32, thu: 29, fri: 31, sat: 15, sun: 12 },
  { hour: '11:00', mon: 28, tue: 25, wed: 30, thu: 27, fri: 29, sat: 14, sun: 11 },
  { hour: '14:00', mon: 22, tue: 20, wed: 25, thu: 23, fri: 24, sat: 18, sun: 15 },
  { hour: '15:00', mon: 20, tue: 18, wed: 22, thu: 21, fri: 23, sat: 16, sun: 14 },
  { hour: '19:00', mon: 18, tue: 16, wed: 20, thu: 19, fri: 21, sat: 25, sun: 22 },
  { hour: '20:00', mon: 15, tue: 13, wed: 17, thu: 16, fri: 18, sat: 28, sun: 25 },
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
      </CardContent>
    </Card>
  );

  const renderHeatmap = () => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Heatmap Aktivitas Prospek Masuk</CardTitle>
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
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 gap-1 text-xs mb-2">
              <div></div>
              <div className="text-center font-medium">Sen</div>
              <div className="text-center font-medium">Sel</div>
              <div className="text-center font-medium">Rab</div>
              <div className="text-center font-medium">Kam</div>
              <div className="text-center font-medium">Jum</div>
              <div className="text-center font-medium">Sab</div>
              <div className="text-center font-medium">Min</div>
            </div>
            {heatmapData.map((row, index) => (
              <div key={index} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-xs font-medium text-right pr-2">{row.hour}</div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.mon > 20 ? 'bg-red-500 text-white' : 
                  row.mon > 10 ? 'bg-orange-300' : 
                  row.mon > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.mon}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.tue > 20 ? 'bg-red-500 text-white' : 
                  row.tue > 10 ? 'bg-orange-300' : 
                  row.tue > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.tue}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.wed > 20 ? 'bg-red-500 text-white' : 
                  row.wed > 10 ? 'bg-orange-300' : 
                  row.wed > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.wed}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.thu > 20 ? 'bg-red-500 text-white' : 
                  row.thu > 10 ? 'bg-orange-300' : 
                  row.thu > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.thu}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.fri > 20 ? 'bg-red-500 text-white' : 
                  row.fri > 10 ? 'bg-orange-300' : 
                  row.fri > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.fri}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.sat > 20 ? 'bg-red-500 text-white' : 
                  row.sat > 10 ? 'bg-orange-300' : 
                  row.sat > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.sat}
                </div>
                <div className={`h-6 rounded text-center text-xs flex items-center justify-center ${
                  row.sun > 20 ? 'bg-red-500 text-white' : 
                  row.sun > 10 ? 'bg-orange-300' : 
                  row.sun > 5 ? 'bg-yellow-200' : 'bg-gray-100'
                }`}>
                  {row.sun}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>0-5</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                <span>6-10</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-300 rounded"></div>
                <span>11-20</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>20+</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderKodeAdsAccordion = () => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Tabel Kode Ads</CardTitle>
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
        <Accordion type="multiple" className="w-full">
          {kodeAdsData.filter(item => item.idAds.length > 1).map((item, index) => (
            <AccordionItem key={item.name} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex gap-8 text-sm">
                    <span>Prospek: {item.prospek}</span>
                    <span>Leads: {item.leads}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                      item.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      CTR: {item.ctr}%
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
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
                    {item.idAds.map((ads) => (
                      <TableRow key={ads.id}>
                        <TableCell className="font-medium">{ads.id}</TableCell>
                        <TableCell className="text-right">{ads.prospek}</TableCell>
                        <TableCell className="text-right">{ads.leads}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ads.ctr >= 30 ? 'bg-green-100 text-green-800' : 
                            ads.ctr >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {ads.ctr}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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

      {/* Tabbed Reports */}
      <Tabs defaultValue="sumber-leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="layanan-assist">Layanan Assist</TabsTrigger>
          <TabsTrigger value="kota">Kota/Kabupaten</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Konversi</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="performa-cs">Performa CS</TabsTrigger>
        </TabsList>

        <TabsContent value="sumber-leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(sumberLeadsData, 'Distribusi Sumber Leads')}
            {renderTable(sumberLeadsData, 'Tabel Sumber Leads')}
          </div>
        </TabsContent>

        <TabsContent value="kode-ads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPieChart(kodeAdsData, 'Distribusi Kode Ads')}
            {renderKodeAdsAccordion()}
          </div>
        </TabsContent>

        <TabsContent value="layanan-assist" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(layananAssistData, 'Layanan Assist', 'layanan')}
            {renderTable(layananAssistData, 'Tabel Layanan Assist')}
          </div>
        </TabsContent>

        <TabsContent value="kota" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(kotaData, 'Kota/Kabupaten', 'kota')}
            {renderTable(kotaData, 'Tabel Kota/Kabupaten')}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          {renderHeatmap()}
        </TabsContent>

        <TabsContent value="performa-cs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(performaCSData, 'Performa CS', 'nama')}
            {renderTable(performaCSData, 'Tabel Performa CS')}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
