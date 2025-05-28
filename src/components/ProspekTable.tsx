import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProspekFilter } from './ProspekFilter';
import { ProspekFilterSummary } from './ProspekFilterSummary';
import { ProspekDataTable } from './ProspekDataTable';
import { ProspekData } from '@/types/prospek';

const prospekData: ProspekData[] = [
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [kodeAdsFilter, setKodeAdsFilter] = useState('all');
  const [sumberLeadsFilter, setSumberLeadsFilter] = useState('all');
  const [layananAssistFilter, setLayananAssistFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodeFilter, setPeriodeFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
        <div className="flex items-center gap-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/tambah-prospek')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Prospek
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">Data Prospek</h2>
        </div>
      </div>

      {/* Filter Component */}
      <ProspekFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        kodeAdsFilter={kodeAdsFilter}
        setKodeAdsFilter={setKodeAdsFilter}
        sumberLeadsFilter={sumberLeadsFilter}
        setSumberLeadsFilter={setSumberLeadsFilter}
        layananAssistFilter={layananAssistFilter}
        setLayananAssistFilter={setLayananAssistFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodeFilter={periodeFilter}
        setPeriodeFilter={setPeriodeFilter}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        uniqueKodeAds={uniqueKodeAds}
        uniqueSumberLeads={uniqueSumberLeads}
        uniqueLayananAssist={uniqueLayananAssist}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        getActiveFiltersCount={getActiveFiltersCount}
      />

      {/* Filter Results Summary */}
      {hasActiveFilters && (
        <ProspekFilterSummary
          filteredDataLength={filteredData.length}
          totalDataLength={prospekData.length}
          searchTerm={searchTerm}
          kodeAdsFilter={kodeAdsFilter}
          sumberLeadsFilter={sumberLeadsFilter}
          layananAssistFilter={layananAssistFilter}
          statusFilter={statusFilter}
          periodeFilter={periodeFilter}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          resetFilters={resetFilters}
        />
      )}

      {/* Data Table */}
      <ProspekDataTable
        filteredData={filteredData}
        totalData={prospekData.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
