
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = prospekData.filter(item => {
    const matchesSearch = item.namaProspek.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.namaFaskes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.statusLeads === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama prospek atau faskes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Prospek">Prospek</SelectItem>
                <SelectItem value="Dihubungi">Dihubungi</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Bukan Leads">Bukan Leads</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per halaman</SelectItem>
                <SelectItem value="25">25 per halaman</SelectItem>
                <SelectItem value="50">50 per halaman</SelectItem>
                <SelectItem value="100">100 per halaman</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

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
