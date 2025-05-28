
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProspekFilterSummaryProps {
  filteredDataLength: number;
  totalDataLength: number;
  searchTerm: string;
  kodeAdsFilter: string;
  sumberLeadsFilter: string;
  layananAssistFilter: string;
  statusFilter: string;
  periodeFilter: string;
  customStartDate: string;
  customEndDate: string;
  resetFilters: () => void;
}

export function ProspekFilterSummary({
  filteredDataLength,
  totalDataLength,
  searchTerm,
  kodeAdsFilter,
  sumberLeadsFilter,
  layananAssistFilter,
  statusFilter,
  periodeFilter,
  customStartDate,
  customEndDate,
  resetFilters
}: ProspekFilterSummaryProps) {
  const getPeriodeName = () => {
    switch (periodeFilter) {
      case 'hari_ini': return 'Hari ini';
      case 'kemarin': return 'Kemarin';
      case 'minggu_ini': return 'Minggu ini';
      case 'minggu_lalu': return 'Minggu lalu';
      case 'bulan_ini': return 'Bulan ini';
      case 'bulan_kemarin': return 'Bulan kemarin';
      case 'custom': return `${customStartDate} - ${customEndDate}`;
      default: return periodeFilter;
    }
  };

  return (
    <Card className="bg-blue-50 border border-blue-200">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Hasil pencarian:</span> {filteredDataLength} dari {totalDataLength} data ditemukan
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
                • Periode: "<span className="font-medium">{getPeriodeName()}</span>"
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-blue-600 hover:text-blue-700">
            Hapus semua filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
