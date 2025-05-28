import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Search, Edit, Trash2, Eye, Filter, X } from 'lucide-react';

const prospekData = [
  {
    id: 1,
    createdDate: '15/01/2024 09:30',
    tanggalProspekMasuk: '15/01/2024',
    sumberLeads: 'Meta Ads',
    kodeAds: 'META',
    idAds: '5',
    namaProspek: 'Dr. Ahmad Fauzi',
    noWhatsApp: '081234567890',
    statusLeads: 'Leads',
    alasanBukanLeads: '',
    keterangan: '',
    layananAssist: 'SIMRS',
    namaFaskes: 'RS Prima Medika',
    tipeFaskes: 'Rumah Sakit',
    lokasiFaskes: 'DKI Jakarta, Jakarta Pusat',
    picLeads: 'CS Support 1'
  },
  {
    id: 2,
    createdDate: '15/01/2024 10:15',
    tanggalProspekMasuk: '15/01/2024',
    sumberLeads: 'Google Ads',
    kodeAds: 'GOOG',
    idAds: '3',
    namaProspek: 'dr. Siti Nurhaliza',
    noWhatsApp: '082345678901',
    statusLeads: 'Dihubungi',
    alasanBukanLeads: '',
    keterangan: 'Tertarik dengan demo',
    layananAssist: 'Telemedicine',
    namaFaskes: 'Klinik Sehat Bersama',
    tipeFaskes: 'Klinik',
    lokasiFaskes: 'Jawa Barat, Bandung',
    picLeads: 'CS Support 2'
  },
  {
    id: 3,
    createdDate: '16/01/2024 14:20',
    tanggalProspekMasuk: '16/01/2024',
    sumberLeads: 'Referral',
    kodeAds: '',
    idAds: '',
    namaProspek: 'Dr. Budi Santoso',
    noWhatsApp: '083456789012',
    statusLeads: 'Bukan Leads',
    alasanBukanLeads: 'Budget Tidak Sesuai',
    keterangan: 'Menginginkan harga lebih murah',
    layananAssist: 'EMR',
    namaFaskes: 'Puskesmas Sukamaju',
    tipeFaskes: 'Puskesmas',
    lokasiFaskes: 'Jawa Timur, Surabaya',
    picLeads: 'CS Support 1'
  }
];

export function ProspekTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [kodeAdsFilter, setKodeAdsFilter] = useState('all');
  const [sumberLeadsFilter, setSumberLeadsFilter] = useState('all');
  const [layananAssistFilter, setLayananAssistFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodeFilter, setPeriodeFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique values for filter options
  const uniqueKodeAds = [...new Set(prospekData.map(item => item.kodeAds).filter(Boolean))];
  const uniqueSumberLeads = [...new Set(prospekData.map(item => item.sumberLeads))];
  const uniqueLayananAssist = [...new Set(prospekData.map(item => item.layananAssist))];

  // Helper function to check if date matches period filter
  const matchesPeriode = (dateStr: string) => {
    if (periodeFilter === 'all') return true;
    
    const itemDate = new Date(dateStr.split(' ')[0].split('/').reverse().join('-'));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    switch (periodeFilter) {
      case 'hari_ini':
        return itemDate.toDateString() === today.toDateString();
      case 'kemarin':
        return itemDate.toDateString() === yesterday.toDateString();
      case 'minggu_ini':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return itemDate >= startOfWeek && itemDate <= today;
      case 'minggu_lalu':
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
      case 'bulan_ini':
        return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
      case 'bulan_kemarin':
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
      case 'custom':
        if (!customStartDate || !customEndDate) return true;
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        return itemDate >= startDate && itemDate <= endDate;
      default:
        return true;
    }
  };

  const filteredData = prospekData.filter(item => {
    const matchesSearch = item.namaProspek.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.namaFaskes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKodeAds = kodeAdsFilter === 'all' || item.kodeAds === kodeAdsFilter;
    const matchesSumberLeads = sumberLeadsFilter === 'all' || item.sumberLeads === sumberLeadsFilter;
    const matchesLayananAssist = layananAssistFilter === 'all' || item.layananAssist === layananAssistFilter;
    const matchesStatus = statusFilter === 'all' || item.statusLeads === statusFilter;
    const matchesPeriodeFilter = matchesPeriode(item.createdDate);
    
    return matchesSearch && matchesKodeAds && matchesSumberLeads && matchesLayananAssist && matchesStatus && matchesPeriodeFilter;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setKodeAdsFilter('all');
    setSumberLeadsFilter('all');
    setLayananAssistFilter('all');
    setStatusFilter('all');
    setPeriodeFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm !== '' || kodeAdsFilter !== 'all' || sumberLeadsFilter !== 'all' || 
                          layananAssistFilter !== 'all' || statusFilter !== 'all' || periodeFilter !== 'all';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (kodeAdsFilter !== 'all') count++;
    if (sumberLeadsFilter !== 'all') count++;
    if (layananAssistFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (periodeFilter !== 'all') count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Prospek</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Prospek
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama prospek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Filter Data Prospek</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Kode Ads Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kode Ads</label>
                    <Select value={kodeAdsFilter} onValueChange={setKodeAdsFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kode Ads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kode Ads</SelectItem>
                        {uniqueKodeAds.map((kode) => (
                          <SelectItem key={kode} value={kode}>{kode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sumber Leads Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sumber Leads</label>
                    <Select value={sumberLeadsFilter} onValueChange={setSumberLeadsFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Sumber Leads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Sumber Leads</SelectItem>
                        {uniqueSumberLeads.map((sumber) => (
                          <SelectItem key={sumber} value={sumber}>{sumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Layanan Assist Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Layanan Assist</label>
                    <Select value={layananAssistFilter} onValueChange={setLayananAssistFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Layanan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Layanan</SelectItem>
                        {uniqueLayananAssist.map((layanan) => (
                          <SelectItem key={layanan} value={layanan}>{layanan}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Leads Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status Leads</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Prospek">Prospek</SelectItem>
                        <SelectItem value="Dihubungi">Dihubungi</SelectItem>
                        <SelectItem value="Leads">Leads</SelectItem>
                        <SelectItem value="Bukan Leads">Bukan Leads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Periode Waktu Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Periode Waktu</label>
                    <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Waktu</SelectItem>
                        <SelectItem value="hari_ini">Hari ini</SelectItem>
                        <SelectItem value="kemarin">Kemarin</SelectItem>
                        <SelectItem value="minggu_ini">Minggu ini</SelectItem>
                        <SelectItem value="minggu_lalu">Minggu lalu</SelectItem>
                        <SelectItem value="bulan_ini">Bulan ini</SelectItem>
                        <SelectItem value="bulan_kemarin">Bulan kemarin</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Date Range */}
                  {periodeFilter === 'custom' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tanggal Akhir</label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={resetFilters} variant="outline" className="flex-1">
                      Reset Filter
                    </Button>
                    <Button onClick={applyFilters} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Terapkan Filter
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Tutup Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter Results Summary */}
      {hasActiveFilters && (
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Hasil pencarian:</span> {filteredData.length} data ditemukan
                {searchTerm && (
                  <span className="ml-2">
                    • Pencarian: "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
                {kodeAdsFilter !== 'all' && (
                  <span className="ml-2">
                    • Kode Ads: "<span className="font-medium">{kodeAdsFilter}</span>"
                  </span>
                )}
                {sumberLeadsFilter !== 'all' && (
                  <span className="ml-2">
                    • Sumber: "<span className="font-medium">{sumberLeadsFilter}</span>"
                  </span>
                )}
                {layananAssistFilter !== 'all' && (
                  <span className="ml-2">
                    • Layanan: "<span className="font-medium">{layananAssistFilter}</span>"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="ml-2">
                    • Status: "<span className="font-medium">{statusFilter}</span>"
                  </span>
                )}
                {periodeFilter !== 'all' && (
                  <span className="ml-2">
                    • Periode: "<span className="font-medium">
                      {periodeFilter === 'hari_ini' ? 'Hari ini' :
                       periodeFilter === 'kemarin' ? 'Kemarin' :
                       periodeFilter === 'minggu_ini' ? 'Minggu ini' :
                       periodeFilter === 'minggu_lalu' ? 'Minggu lalu' :
                       periodeFilter === 'bulan_ini' ? 'Bulan ini' :
                       periodeFilter === 'bulan_kemarin' ? 'Bulan kemarin' :
                       periodeFilter === 'custom' ? `${customStartDate} - ${customEndDate}` : periodeFilter}
                    </span>"
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-blue-600 hover:text-blue-700">
                Hapus semua filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tanggal Prospek Masuk</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Sumber Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Kode Ads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID Ads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nama Prospek</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">No WhatsApp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Alasan Bukan Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Keterangan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Layanan Assist</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nama Faskes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipe Faskes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Lokasi Faskes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">PIC Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.createdDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.tanggalProspekMasuk}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.sumberLeads}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.kodeAds || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.idAds || '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.namaProspek}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.noWhatsApp}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.statusLeads === 'Leads' ? 'bg-green-100 text-green-800' :
                        item.statusLeads === 'Dihubungi' ? 'bg-blue-100 text-blue-800' :
                        item.statusLeads === 'Prospek' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.statusLeads}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.alasanBukanLeads || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {item.keterangan ? (
                        <span className="max-w-32 truncate block" title={item.keterangan}>
                          {item.keterangan}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.layananAssist}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.namaFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.tipeFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.lokasiFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.picLeads}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Menampilkan {filteredData.length} dari {prospekData.length} data
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Sebelumnya
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage * itemsPerPage >= prospekData.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
