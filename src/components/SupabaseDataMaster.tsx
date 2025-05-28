
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { SupabaseDataMasterModal } from './SupabaseDataMasterModal';
import { SupabaseDataMasterDeleteDialog } from './SupabaseDataMasterDeleteDialog';

export function SupabaseDataMaster() {
  const { 
    layananData, 
    kodeAdsData, 
    sumberLeadsData, 
    alasanBukanLeadsData,
    refetchData 
  } = useSupabaseData();
  
  const [activeTab, setActiveTab] = useState('layanan');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string; type: string } | null>(null);

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
      if (item.kode) return item.kode;
      if (item.alasan) return item.alasan;
      return 'Item';
    };
    
    setDeleteItem({ id: item.id, name: getName(), type: activeTab });
    setDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      const tableName = getTableName(activeTab);
      
      if (modalMode === 'add') {
        const { error } = await supabase
          .from(tableName)
          .insert([data]);
        
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Data berhasil ditambahkan",
        });
      } else {
        const { error } = await supabase
          .from(tableName)
          .update(data)
          .eq('id', modalData.id);
        
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Data berhasil diupdate",
        });
      }
      
      refetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    try {
      const tableName = getTableName(deleteItem.type);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', deleteItem.id);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data berhasil dihapus",
        variant: "destructive",
      });
      
      refetchData();
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const getTableName = (tab: string) => {
    switch (tab) {
      case 'layanan':
        return 'layanan_assist';
      case 'kode-ads':
        return 'kode_ads';
      case 'sumber':
        return 'sumber_leads';
      case 'bukan-leads':
        return 'alasan_bukan_leads';
      default:
        return '';
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
                {Object.keys(item).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at').map((key) => (
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="layanan">Layanan</TabsTrigger>
          <TabsTrigger value="kode-ads">Kode Ads</TabsTrigger>
          <TabsTrigger value="sumber">Sumber Leads</TabsTrigger>
          <TabsTrigger value="bukan-leads">Bukan Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="layanan">
          {renderTable(layananData, ['Layanan'], 'Layanan Assist', 'layanan')}
        </TabsContent>

        <TabsContent value="kode-ads">
          {renderTable(kodeAdsData, ['Kode Ads'], 'Kode Ads', 'kode-ads')}
        </TabsContent>

        <TabsContent value="sumber">
          {renderTable(sumberLeadsData, ['Sumber Leads'], 'Sumber Leads', 'sumber')}
        </TabsContent>

        <TabsContent value="bukan-leads">
          {renderTable(alasanBukanLeadsData, ['Alasan Bukan Leads'], 'Bukan Leads', 'bukan-leads')}
        </TabsContent>
      </Tabs>

      <SupabaseDataMasterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
        type={activeTab as any}
        mode={modalMode}
        onSave={handleSave}
      />

      <SupabaseDataMasterDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name || ''}
      />
    </div>
  );
}
