
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Laporan } from './Laporan';

type TimeFilter = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'custom';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function SupabaseLaporan() {
  const { prospekData } = useSupabaseData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this-month');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [filteredData, setFilteredData] = useState(prospekData);

  // Filter data based on time selection
  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
        break;
      case 'this-week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
        break;
      case 'last-week':
        const startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        startDate = new Date(startOfLastWeek.getFullYear(), startOfLastWeek.getMonth(), startOfLastWeek.getDate());
        endDate = new Date(endOfLastWeek.getFullYear(), endOfLastWeek.getMonth(), endOfLastWeek.getDate(), 23, 59, 59);
        break;
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        startDate = lastMonth;
        endDate = new Date(endOfLastMonth.getFullYear(), endOfLastMonth.getMonth(), endOfLastMonth.getDate(), 23, 59, 59);
        break;
      case 'custom':
        if (dateRange.from && dateRange.to) {
          startDate = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate());
          endDate = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59);
        } else {
          setFilteredData(prospekData);
          return;
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const filtered = prospekData.filter(item => {
      const itemDate = new Date(item.tanggal_prospek);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredData(filtered);
  }, [timeFilter, dateRange, prospekData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Laporan Prospek</h2>
        <p className="text-gray-600">Dashboard analisis data prospek dan konversi leads</p>
      </div>

      {/* Time Filter */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Filter Waktu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-[200px]">
              <Label htmlFor="time-filter">Periode</Label>
              <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
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

            {timeFilter === 'custom' && (
              <>
                <div>
                  <Label>Tanggal Mulai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Tanggal Selesai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports with Tabs */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Laporan Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sumber-leads" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
              <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
              <TabsTrigger value="layanan-assist">Layanan</TabsTrigger>
              <TabsTrigger value="performa-cs">Performa CS</TabsTrigger>
              <TabsTrigger value="kota-kabupaten">Kota/Kabupaten</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sumber-leads">
              <Laporan reportType="sumber-leads" filteredData={filteredData} />
            </TabsContent>
            
            <TabsContent value="kode-ads">
              <Laporan reportType="kode-ads" filteredData={filteredData} />
            </TabsContent>
            
            <TabsContent value="layanan-assist">
              <Laporan reportType="layanan-assist" filteredData={filteredData} />
            </TabsContent>
            
            <TabsContent value="performa-cs">
              <Laporan reportType="performa-cs" filteredData={filteredData} />
            </TabsContent>
            
            <TabsContent value="kota-kabupaten">
              <Laporan reportType="kota-kabupaten" filteredData={filteredData} />
            </TabsContent>
            
            <TabsContent value="heatmap">
              <Laporan reportType="heatmap" filteredData={filteredData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
