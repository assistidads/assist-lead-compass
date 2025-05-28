
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseData, SupabaseProspek } from '@/hooks/useSupabaseData';
import { ProspekFilter } from './ProspekFilter';
import { ProspekFilterSummary } from './ProspekFilterSummary';
import { SupabaseProspekDataTable } from './SupabaseProspekDataTable';

export function SupabaseProspekTable() {
  const navigate = useNavigate();
  const { prospekData, loading, deleteProspek } = useSupabaseData();
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
  const uniqueKodeAds = [...new Set(prospekData.map(item => item.kode_ads?.kode).filter(Boolean))];
  const uniqueSumberLeads = [...new Set(prospekData.map(item => item.sumber_leads?.nama).filter(Boolean))];
  const uniqueLayananAssist = [...new Set(prospekData.map(item => item.layanan_assist?.nama).filter(Boolean))];

  // Helper function to check if date matches period filter
  const matchesPeriode = (dateStr: string) => {
    if (periodeFilter === 'all') return true;
    
    const itemDate = new Date(dateStr);
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
    const matchesSearch = item.nama_prospek.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nama_faskes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKodeAds = kodeAdsFilter === 'all' || item.kode_ads?.kode === kodeAdsFilter;
    const matchesSumberLeads = sumberLeadsFilter === 'all' || item.sumber_leads?.nama === sumberLeadsFilter;
    const matchesLayananAssist = layananAssistFilter === 'all' || item.layanan_assist?.nama === layananAssistFilter;
    const matchesStatus = statusFilter === 'all' || item.status_leads === statusFilter;
    const matchesPeriodeFilter = matchesPeriode(item.created_at);
    
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
      <SupabaseProspekDataTable
        filteredData={filteredData}
        totalData={prospekData.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        loading={loading}
        onDelete={deleteProspek}
      />
    </div>
  );
}
