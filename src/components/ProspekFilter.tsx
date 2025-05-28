
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, X, ChevronDown } from 'lucide-react';

interface ProspekFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  kodeAdsFilter: string;
  setKodeAdsFilter: (value: string) => void;
  sumberLeadsFilter: string;
  setSumberLeadsFilter: (value: string) => void;
  layananAssistFilter: string;
  setLayananAssistFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  periodeFilter: string;
  setPeriodeFilter: (value: string) => void;
  customStartDate: string;
  setCustomStartDate: (value: string) => void;
  customEndDate: string;
  setCustomEndDate: (value: string) => void;
  uniqueKodeAds: string[];
  uniqueSumberLeads: string[];
  uniqueLayananAssist: string[];
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getActiveFiltersCount: () => number;
}

export function ProspekFilter({
  searchTerm,
  setSearchTerm,
  kodeAdsFilter,
  setKodeAdsFilter,
  sumberLeadsFilter,
  setSumberLeadsFilter,
  layananAssistFilter,
  setLayananAssistFilter,
  statusFilter,
  setStatusFilter,
  periodeFilter,
  setPeriodeFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  uniqueKodeAds,
  uniqueSumberLeads,
  uniqueLayananAssist,
  resetFilters,
  hasActiveFilters,
  getActiveFiltersCount
}: ProspekFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex gap-3 items-center">
        <div className="relative w-1/4">
          <Input
            placeholder="Cari berdasarkan nama prospek atau nama faskes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="relative"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          {getActiveFiltersCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-gray-600 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter Content */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <div className="grid grid-cols-3 gap-6 mb-6">
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
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
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
            </div>

            {/* Custom Date Range */}
            {periodeFilter === 'custom' && (
              <div className="grid grid-cols-2 gap-6 mb-6">
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
            <div className="flex justify-end gap-3">
              <Button onClick={resetFilters} variant="outline">
                Reset Filter
              </Button>
              <Button onClick={() => setIsFilterOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Terapkan Filter
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
