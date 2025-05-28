
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataMasterModal } from './DataMasterModal';
import { DataMasterDeleteDialog } from './DataMasterDeleteDialog';

// Sample data for each master data type
const userData = [
  { id: 1, nama: 'Admin User', email: 'admin@assist.id', role: 'Admin' },
  { id: 2, nama: 'CS Support 1', email: 'cs1@assist.id', role: 'CS Support' },
  { id: 3, nama: 'CS Support 2', email: 'cs2@assist.id', role: 'CS Support' },
];

const layananData = [
  { id: 1, layanan: 'SIMRS' },
  { id: 2, layanan: 'Telemedicine' },
  { id: 3, layanan: 'EMR' },
  { id: 4, layanan: 'Farmasi' },
  { id: 5, layanan: 'Laboratory' },
];

const kodeAdsData = [
  { id: 1, kode: 'META' },
  { id: 2, kode: 'GOOG' },
  { id: 3, kode: 'TKTK' },
  { id: 4, kode: 'FB01' },
];

const sumberLeadsData = [
  { id: 1, sumber: 'Meta Ads' },
  { id: 2, sumber: 'Google Ads' },
  { id: 3, sumber: 'Tiktok Ads' },
  { id: 4, sumber: 'Website Organik' },
  { id: 5, sumber: 'Referral' },
];

const tipeFaskesData = [
  { id: 1, tipe: 'Rumah Sakit' },
  { id: 2, tipe: 'Puskesmas' },
  { id: 3, tipe: 'Klinik' },
  { id: 4, tipe: 'Lab Kesehatan' },
];

const statusLeadsData = [
  { id: 1, status: 'Prospek' },
  { id: 2, status: 'Dihubungi' },
  { id: 3, status: 'Leads' },
  { id: 4, status: 'Bukan Leads' },
];

const bukanLeadsData = [
  { id: 1, alasan: 'Tidak Berminat' },
  { id: 2, alasan: 'Budget Tidak Sesuai' },
  { id: 3, alasan: 'Sudah Ada Sistem' },
  { id: 4, alasan: 'Nomor Salah' },
];

export function DataMaster() {
  const [activeTab, setActiveTab] = useState('user');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteItem, setDeleteItem] = useState<{ id: number; name: string } | null>(null);

  const handleAdd = () => {
    setModalData(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setModalData(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (item: any) => {
    const getName = () => {
      if (item.nama) return item.nama;
      if (item.layanan) return item.layanan;
      if (item.kode) return item.kode;
      if (item.sumber) return item.sumber;
      if (item.tipe) return item.tipe;
      if (item.status) return item.status;
      if (item.alasan) return item.alasan;
      return 'Item';
    };
    
    setDeleteItem({ id: item.id, name: getName() });
    setDeleteDialogOpen(true);
  };

  const handleSave = (data: any) => {
    console.log('Saving data:', data);
    // Here you would typically save to a database
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      console.log('Deleting item:', deleteItem);
      // Here you would typically delete from a database
    }
  };

  const renderTable = (data: any[], columns: string[], title: string, type: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {Object.keys(item).filter(key => key !== 'id').map((key) => (
                  <TableCell key={key}>{item[key]}</TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Master</h2>
        <p className="text-gray-600">Kelola data referensi untuk sistem leads</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="layanan">Layanan</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="sumber">Sumber Leads</TabsTrigger>
          <TabsTrigger value="tipe-faskes">Tipe Faskes</TabsTrigger>
          <TabsTrigger value="status">Status Leads</TabsTrigger>
          <TabsTrigger value="bukan-leads">Bukan Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          {renderTable(userData, ['Nama Admin', 'Email', 'Role'], 'Data User', 'user')}
        </TabsContent>

        <TabsContent value="layanan">
          {renderTable(layananData, ['Layanan'], 'Layanan Assist', 'layanan')}
        </TabsContent>

        <TabsContent value="kode-ads">
          {renderTable(kodeAdsData, ['Kode Ads'], 'Kode Ads', 'kode-ads')}
        </TabsContent>

        <TabsContent value="sumber">
          {renderTable(sumberLeadsData, ['Sumber Leads'], 'Sumber Leads', 'sumber')}
        </TabsContent>

        <TabsContent value="tipe-faskes">
          {renderTable(tipeFaskesData, ['Tipe Faskes'], 'Tipe Faskes', 'tipe-faskes')}
        </TabsContent>

        <TabsContent value="status">
          {renderTable(statusLeadsData, ['Status Leads'], 'Status Leads', 'status')}
        </TabsContent>

        <TabsContent value="bukan-leads">
          {renderTable(bukanLeadsData, ['Alasan Bukan Leads'], 'Bukan Leads', 'bukan-leads')}
        </TabsContent>
      </Tabs>

      <DataMasterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
        type={activeTab as any}
        mode={modalMode}
        onSave={handleSave}
      />

      <DataMasterDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name || ''}
      />
    </div>
  );
}
