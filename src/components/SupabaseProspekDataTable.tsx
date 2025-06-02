
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupabaseProspek } from '@/hooks/useSupabaseData';
import { ProspekTableHeader } from './ProspekTableHeader';
import { ProspekTablePagination } from './ProspekTablePagination';
import { ProspekDetailModal } from './ProspekDetailModal';
import { ProspekDeleteDialog } from './ProspekDeleteDialog';
import { Button } from '@/components/ui/button';

interface SupabaseProspekDataTableProps {
  filteredData: SupabaseProspek[];
  totalData: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  loading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

export function SupabaseProspekDataTable({
  filteredData,
  totalData,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  loading,
  onDelete
}: SupabaseProspekDataTableProps) {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProspek, setSelectedProspek] = useState<SupabaseProspek | null>(null);
  
  const handleView = (id: string) => {
    const prospek = filteredData.find(item => item.id === id);
    if (prospek) {
      setSelectedProspek(prospek);
      setDetailModalOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-prospek/${id}`);
  };

  const handleDelete = (id: string) => {
    const prospek = filteredData.find(item => item.id === id);
    if (prospek) {
      setSelectedProspek(prospek);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedProspek) {
      const success = await onDelete(selectedProspek.id);
      
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedProspek(null);
      }
    }
  };

  // Calculate pagination based on rowsPerPage
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Convert SupabaseProspek to ProspekData format for existing components
  const convertedData = currentData.map(item => {
    // Fix PIC Leads logic - prioritize pic_leads, then fallback to creator
    let picLeads = '';
    if (item.pic_leads?.full_name) {
      picLeads = item.pic_leads.full_name;
    } else if (item.created_by_profile?.full_name) {
      picLeads = item.created_by_profile.full_name;
    }
    
    console.log('Converting item:', item.id, 'PIC Leads:', picLeads, 'pic_leads:', item.pic_leads, 'created_by_profile:', item.created_by_profile);
    
    return {
      id: parseInt(item.id) || 0, // Convert string ID to number for compatibility
      createdDate: new Date(item.created_at).toLocaleDateString('id-ID'),
      tanggalProspekMasuk: new Date(item.tanggal_prospek).toLocaleDateString('id-ID'),
      sumberLeads: item.sumber_leads?.nama || '',
      kodeAds: item.kode_ads?.kode || '',
      idAds: item.id_ads || '',
      namaProspek: item.nama_prospek,
      noWhatsApp: item.no_whatsapp,
      statusLeads: item.status_leads,
      alasanBukanLeads: item.alasan_bukan_leads?.alasan || '',
      keterangan: item.keterangan_bukan_leads || '',
      layananAssist: item.layanan_assist?.nama || '',
      namaFaskes: item.nama_faskes,
      tipeFaskes: item.tipe_faskes,
      lokasiFaskes: `${item.provinsi_nama}, ${item.kota}`,
      picLeads: picLeads
    };
  });

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">Memuat data prospek...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <ProspekTableHeader 
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
            filteredDataLength={filteredData.length}
          />

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
                {convertedData.map((item, index) => (
                  <tr key={currentData[index].id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.createdDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.tanggalProspekMasuk}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.sumberLeads}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.kodeAds}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.idAds}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.namaProspek}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.noWhatsApp}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.statusLeads === 'Leads' ? 'bg-green-100 text-green-800' :
                        item.statusLeads === 'Dihubungi' ? 'bg-blue-100 text-blue-800' :
                        item.statusLeads === 'Bukan Leads' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.statusLeads}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.alasanBukanLeads}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">{item.keterangan}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.layananAssist}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.namaFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.tipeFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.lokasiFaskes}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.picLeads}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(currentData[index].id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(currentData[index].id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(currentData[index].id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ProspekTablePagination
            startIndex={startIndex}
            endIndex={endIndex}
            filteredDataLength={filteredData.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      <ProspekDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        data={selectedProspek ? convertedData.find((_, i) => currentData[i].id === selectedProspek.id) : null}
      />

      <ProspekDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        data={selectedProspek ? convertedData.find((_, i) => currentData[i].id === selectedProspek.id) : null}
      />
    </>
  );
}
