
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProspekData } from '@/types/prospek';
import { ProspekTableHeader } from './ProspekTableHeader';
import { ProspekTableRow } from './ProspekTableRow';
import { ProspekTablePagination } from './ProspekTablePagination';
import { ProspekDetailModal } from './ProspekDetailModal';
import { ProspekDeleteDialog } from './ProspekDeleteDialog';

interface ProspekDataTableProps {
  filteredData: ProspekData[];
  totalData: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  onDataChange?: () => void;
}

export function ProspekDataTable({
  filteredData,
  totalData,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onDataChange
}: ProspekDataTableProps) {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProspek, setSelectedProspek] = useState<ProspekData | null>(null);
  
  const handleView = (id: number) => {
    const prospek = filteredData.find(item => item.id === id);
    if (prospek) {
      setSelectedProspek(prospek);
      setDetailModalOpen(true);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-prospek/${id}`);
  };

  const handleDelete = (id: number) => {
    const prospek = filteredData.find(item => item.id === id);
    if (prospek) {
      setSelectedProspek(prospek);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedProspek) {
      // Simulate delete operation
      toast({
        title: "Prospek Berhasil Dihapus",
        description: `Data prospek ${selectedProspek.namaProspek} telah dihapus`,
        variant: "destructive",
      });
      
      setDeleteDialogOpen(false);
      setSelectedProspek(null);
      
      // Call onDataChange to refresh data if provided
      if (onDataChange) {
        onDataChange();
      }
    }
  };

  // Calculate pagination based on rowsPerPage
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
                {currentData.map((item) => (
                  <ProspekTableRow 
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
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
        data={selectedProspek}
      />

      <ProspekDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        data={selectedProspek}
      />
    </>
  );
}
