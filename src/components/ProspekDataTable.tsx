
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProspekData {
  id: number;
  createdDate: string;
  tanggalProspekMasuk: string;
  sumberLeads: string;
  kodeAds: string;
  idAds: string;
  namaProspek: string;
  noWhatsApp: string;
  statusLeads: string;
  alasanBukanLeads: string;
  keterangan: string;
  layananAssist: string;
  namaFaskes: string;
  tipeFaskes: string;
  lokasiFaskes: string;
  picLeads: string;
}

interface ProspekDataTableProps {
  filteredData: ProspekData[];
  totalData: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

export function ProspekDataTable({
  filteredData,
  totalData,
  currentPage,
  setCurrentPage,
  itemsPerPage
}: ProspekDataTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const handleView = (id: number) => {
    toast({
      title: "Detail Prospek",
      description: `Menampilkan detail prospek dengan ID: ${id}`,
    });
    console.log('View prospek:', id);
  };

  const handleEdit = (id: number) => {
    toast({
      title: "Edit Prospek",
      description: `Mengedit prospek dengan ID: ${id}`,
    });
    console.log('Edit prospek:', id);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Hapus Prospek",
      description: `Menghapus prospek dengan ID: ${id}`,
      variant: "destructive",
    });
    console.log('Delete prospek:', id);
  };

  // Calculate pagination based on rowsPerPage
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-0">
        {/* Rows per page selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tampilkan</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(parseInt(value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">baris</span>
          </div>
          <div className="text-sm text-gray-700">
            Total: {filteredData.length} data
          </div>
        </div>

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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(item.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Sebelumnya
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
