
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from './MetricCard';
import { Laporan } from './Laporan';
import { cn } from '@/lib/utils';

export function SupabaseLaporan() {
  const { prospekData, sumberLeadsData, loading } = useSupabaseData();
  const { profile } = useAuth();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [sumberFilter, setSumberFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Handle time filter changes
  useEffect(() => {
    const today = new Date();
    
    switch (timeFilter) {
      case 'today':
        setDateFrom(startOfDay(today));
        setDateTo(endOfDay(today));
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setDateFrom(startOfDay(yesterday));
        setDateTo(endOfDay(yesterday));
        break;
      case 'this-week':
        setDateFrom(startOfWeek(today, { weekStartsOn: 1 }));
        setDateTo(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'last-week':
        const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        setDateFrom(lastWeekStart);
        setDateTo(lastWeekEnd);
        break;
      case 'this-month':
        setDateFrom(startOfMonth(today));
        setDateTo(endOfMonth(today));
        break;
      case 'last-month':
        const lastMonth = subMonths(today, 1);
        setDateFrom(startOfMonth(lastMonth));
        setDateTo(endOfMonth(lastMonth));
        break;
      case 'custom':
        setDateFrom(customDateFrom);
        setDateTo(customDateTo);
        break;
      case 'all':
        setDateFrom(undefined);
        setDateTo(undefined);
        break;
      default:
        break;
    }
  }, [timeFilter, customDateFrom, customDateTo]);

  // Filter data berdasarkan tanggal, sumber, dan status
  const filteredData = prospekData.filter(item => {
    const itemDate = new Date(item.tanggal_prospek);
    const dateFilter = (!dateFrom || itemDate >= dateFrom) && (!dateTo || itemDate <= dateTo);
    const sumberFilterMatch = sumberFilter === 'all' || item.sumber_leads?.nama === sumberFilter;
    const statusFilterMatch = statusFilter === 'all' || item.status_leads === statusFilter;
    
    return dateFilter && sumberFilterMatch && statusFilterMatch;
  });

  // Hitung metrics
  const totalProspek = filteredData.length;
  const totalLeads = filteredData.filter(item => item.status_leads === 'Leads').length;
  const totalBukanLeads = filteredData.filter(item => item.status_leads === 'Bukan Leads').length;
  const conversionRate = totalProspek > 0 ? ((totalLeads / totalProspek) * 100).toFixed(1) : '0';

  // Data untuk chart (breakdown by sumber leads)
  const sumberLeadsBreakdown = sumberLeadsData.map(sumber => {
    const count = filteredData.filter(item => item.sumber_leads?.nama === sumber.nama).length;
    return {
      name: sumber.nama,
      value: count
    };
  }).filter(item => item.value > 0);

  // Data untuk chart (breakdown by status)
  const statusBreakdown = [
    { name: 'Prospek', value: filteredData.filter(item => item.status_leads === 'Prospek').length },
    { name: 'Dihubungi', value: filteredData.filter(item => item.status_leads === 'Dihubungi').length },
    { name: 'Leads', value: filteredData.filter(item => item.status_leads === 'Leads').length },
    { name: 'Bukan Leads', value: filteredData.filter(item => item.status_leads === 'Bukan Leads').length },
    { name: 'On Going', value: filteredData.filter(item => item.status_leads === 'On Going').length }
  ].filter(item => item.value > 0);

  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Tanggal Prospek',
      'Nama Prospek', 
      'No WhatsApp',
      'Sumber Leads',
      'Status Leads',
      'Nama Faskes',
      'Tipe Faskes',
      'Provinsi',
      'Kota',
      'PIC Leads'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.tanggal_prospek,
        `"${item.nama_prospek}"`,
        item.no_whatsapp,
        `"${item.sumber_leads?.nama || ''}"`,
        item.status_leads,
        `"${item.nama_faskes}"`,
        item.tipe_faskes,
        `"${item.provinsi_nama}"`,
        `"${item.kota}"`,
        `"${item.pic_leads?.full_name || ''}"`
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-prospek-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Laporan Prospek</h2>
        <p className="text-gray-600">
          {profile?.role === 'cs_support' 
            ? 'Laporan data prospek yang Anda input'
            : 'Laporan keseluruhan data prospek'
          }
        </p>
      </div>

      {/* Filter Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode Waktu</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="yesterday">Kemarin</SelectItem>
                  <SelectItem value="this-week">Minggu Ini</SelectItem>
                  <SelectItem value="last-week">Minggu Lalu</SelectItem>
                  <SelectItem value="this-month">Bulan Ini</SelectItem>
                  <SelectItem value="last-month">Bulan Lalu</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date From - only show when custom is selected */}
            {timeFilter === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dari</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateFrom ? format(customDateFrom, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDateFrom}
                      onSelect={setCustomDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Custom Date To - only show when custom is selected */}
            {timeFilter === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Sampai</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateTo ? format(customDateTo, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDateTo}
                      onSelect={setCustomDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Sumber Leads Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Leads</label>
              <Select value={sumberFilter} onValueChange={setSumberFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Sumber</SelectItem>
                  {sumberLeadsData.map(sumber => (
                    <SelectItem key={sumber.id} value={sumber.nama}>{sumber.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Prospek">Prospek</SelectItem>
                  <SelectItem value="Dihubungi">Dihubungi</SelectItem>
                  <SelectItem value="Leads">Leads</SelectItem>
                  <SelectItem value="Bukan Leads">Bukan Leads</SelectItem>
                  <SelectItem value="On Going">On Going</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <Button onClick={handleExport} className="w-full bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Prospek"
          value={totalProspek}
          change={0}
          icon={undefined}
        />
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          change={0}
          icon={undefined}
        />
        <MetricCard
          title="Bukan Leads"
          value={totalBukanLeads}
          change={0}
          icon={undefined}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={0}
          icon={undefined}
        />
      </div>

      {/* Summary Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Ringkasan Data ({filteredData.length} prospek)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Breakdown by Sumber */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Berdasarkan Sumber Leads</h4>
              <div className="space-y-2">
                {sumberLeadsBreakdown.map(item => (
                  <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Berdasarkan Status</h4>
              <div className="space-y-2">
                {statusBreakdown.map(item => (
                  <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Components */}
      <div className="space-y-8">
        <Laporan reportType="sumber-leads" />
        <Laporan reportType="kode-ads" />
        <Laporan reportType="layanan-assist" />
        <Laporan reportType="kota-kabupaten" />
        <Laporan reportType="heatmap" />
        <Laporan reportType="performa-cs" />
      </div>
    </div>
  );
}
