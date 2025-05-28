
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ProspekData } from '@/types/prospek';

interface ProspekDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProspekData | null;
}

export function ProspekDetailModal({ isOpen, onClose, data }: ProspekDetailModalProps) {
  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Leads':
        return 'bg-green-100 text-green-800';
      case 'Dihubungi':
        return 'bg-blue-100 text-blue-800';
      case 'Prospek':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Going':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Prospek - {data.namaProspek}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Created Date</label>
              <p className="text-sm text-gray-900">{data.createdDate}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Tanggal Prospek Masuk</label>
              <p className="text-sm text-gray-900">{data.tanggalProspekMasuk}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Sumber Leads</label>
              <p className="text-sm text-gray-900">{data.sumberLeads}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Kode Ads</label>
              <p className="text-sm text-gray-900">{data.kodeAds || '-'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">ID Ads</label>
              <p className="text-sm text-gray-900">{data.idAds || '-'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Nama Prospek</label>
              <p className="text-sm text-gray-900 font-medium">{data.namaProspek}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">No WhatsApp</label>
              <p className="text-sm text-gray-900">{data.noWhatsApp}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Status Leads</label>
              <div className="mt-1">
                <Badge className={getStatusColor(data.statusLeads)}>
                  {data.statusLeads}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Alasan Bukan Leads</label>
              <p className="text-sm text-gray-900">{data.alasanBukanLeads || '-'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Keterangan</label>
              <p className="text-sm text-gray-900">{data.keterangan || '-'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Layanan Assist</label>
              <p className="text-sm text-gray-900">{data.layananAssist}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Nama Faskes</label>
              <p className="text-sm text-gray-900">{data.namaFaskes}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Tipe Faskes</label>
              <p className="text-sm text-gray-900">{data.tipeFaskes}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Lokasi Faskes</label>
              <p className="text-sm text-gray-900">{data.lokasiFaskes}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">PIC Leads</label>
              <p className="text-sm text-gray-900">{data.picLeads}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
