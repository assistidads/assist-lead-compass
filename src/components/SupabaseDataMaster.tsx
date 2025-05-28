
import { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

export function SupabaseDataMaster() {
  const { user, profile } = useAuth();
  const { 
    layananData, 
    kodeAdsData, 
    sumberLeadsData, 
    alasanBukanLeadsData,
    refetchData 
  } = useSupabaseData();
  
  const [activeTab, setActiveTab] = useState('user');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string; type: string } | null>(null);
  
  // Data states for additional tables
  const [usersData, setUsersData] = useState<any[]>([]);
  const [tipeFaskesData, setTipeFaskesData] = useState<any[]>([]);
  const [statusLeadsData, setStatusLeadsData] = useState<any[]>([]);

  // Fetch additional data
  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsersData();
      fetchTipeFaskesData();
      fetchStatusLeadsData();
    }
  }, [profile]);

  const fetchUsersData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setUsersData(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTipeFaskesData = async () => {
    // Since tipe_faskes is an enum, we'll create a mock data for display
    setTipeFaskesData([
      { id: '1', nama: 'Rumah Sakit' },
      { id: '2', nama: 'Puskesmas' },
      { id: '3', nama: 'Klinik' },
      { id: '4', nama: 'Lab Kesehatan' }
    ]);
  };

  const fetchStatusLeadsData = async () => {
    // Since status_leads is an enum, we'll create a mock data for display
    setStatusLeadsData([
      { id: '1', nama: 'Prospek' },
      { id: '2', nama: 'Dihubungi' },
      { id: '3', nama: 'Leads' },
      { id: '4', nama: 'Bukan Leads' },
      { id: '5', nama: 'On Going' }
    ]);
  };

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
      if (item.full_name) return item.full_name;
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
      
      if (!tableName) {
        toast({
          title: "Error",
          description: "Table tidak ditemukan",
          variant: "destructive",
        });
        return;
      }
      
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
      if (activeTab === 'user') fetchUsersData();
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
      
      if (!tableName) {
        toast({
          title: "Error",
          description: "Table tidak ditemukan",
          variant: "destructive",
        });
        return;
      }
      
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
      if (deleteItem.type === 'user') fetchUsersData();
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

  const getTableName = (tab: string): "profiles" | "layanan_assist" | "kode_ads" | "sumber_leads" | "alasan_bukan_leads" | null => {
    switch (tab) {
      case 'user':
        return 'profiles';
      case 'layanan':
        return 'layanan_assist';
      case 'kode-ads':
        return 'kode_ads';
      case 'sumber-leads':
        return 'sumber_leads';
      case 'bukan-leads':
        return 'alasan_bukan_leads';
      default:
        return null;
    }
  };

  const getData = (tab: string) => {
    switch (tab) {
      case 'user':
        return usersData;
      case 'layanan':
        return layananData;
      case 'kode-ads':
        return kodeAdsData;
      case 'sumber-leads':
        return sumberLeadsData;
      case 'tipe-faskes':
        return tipeFaskesData;
      case 'status-leads':
        return statusLeadsData;
      case 'bukan-leads':
        return alasanBukanLeadsData;
      default:
        return [];
    }
  };

  const getColumns = (tab: string) => {
    switch (tab) {
      case 'user':
        return ['Nama Admin', 'Email', 'Role'];
      case 'layanan':
        return ['Layanan'];
      case 'kode-ads':
        return ['Kode Ads'];
      case 'sumber-leads':
        return ['Sumber Leads'];
      case 'tipe-faskes':
        return ['Tipe Faskes'];
      case 'status-leads':
        return ['Status Leads'];
      case 'bukan-leads':
        return ['Alasan Bukan Leads'];
      default:
        return [];
    }
  };

  const getTitle = (tab: string) => {
    switch (tab) {
      case 'user':
        return 'Data User';
      case 'layanan':
        return 'Layanan Assist';
      case 'kode-ads':
        return 'Kode Ads';
      case 'sumber-leads':
        return 'Sumber Leads';
      case 'tipe-faskes':
        return 'Tipe Faskes';
      case 'status-leads':
        return 'Status Leads';
      case 'bukan-leads':
        return 'Bukan Leads';
      default:
        return '';
    }
  };

  const renderTableData = (item: any, tab: string) => {
    switch (tab) {
      case 'user':
        return [item.full_name, item.email, item.role === 'admin' ? 'Admin' : 'CS Support'];
      case 'layanan':
        return [item.nama];
      case 'kode-ads':
        return [item.kode];
      case 'sumber-leads':
        return [item.nama];
      case 'tipe-faskes':
        return [item.nama];
      case 'status-leads':
        return [item.nama];
      case 'bukan-leads':
        return [item.alasan];
      default:
        return [];
    }
  };

  const canEditDelete = (tab: string) => {
    // Only allow edit/delete for layanan, kode-ads, sumber-leads, bukan-leads and for admins
    if (profile?.role !== 'admin') return false;
    return ['layanan', 'kode-ads', 'sumber-leads', 'bukan-leads'].includes(tab);
  };

  const renderTable = (data: any[], columns: string[], title: string, type: string) => (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        {canEditDelete(type) && (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              {canEditDelete(type) && <TableHead className="w-32">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {renderTableData(item, type).map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
                {canEditDelete(type) && (
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
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Akses ditolak. Hanya admin yang dapat mengakses data master.</p>
      </div>
    );
  }

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
          <TabsTrigger value="sumber-leads">Sumber Leads</TabsTrigger>
          <TabsTrigger value="tipe-faskes">Tipe Faskes</TabsTrigger>
          <TabsTrigger value="status-leads">Status Leads</TabsTrigger>
          <TabsTrigger value="bukan-leads">Bukan Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          {renderTable(getData('user'), getColumns('user'), getTitle('user'), 'user')}
        </TabsContent>

        <TabsContent value="layanan">
          {renderTable(getData('layanan'), getColumns('layanan'), getTitle('layanan'), 'layanan')}
        </TabsContent>

        <TabsContent value="kode-ads">
          {renderTable(getData('kode-ads'), getColumns('kode-ads'), getTitle('kode-ads'), 'kode-ads')}
        </TabsContent>

        <TabsContent value="sumber-leads">
          {renderTable(getData('sumber-leads'), getColumns('sumber-leads'), getTitle('sumber-leads'), 'sumber-leads')}
        </TabsContent>

        <TabsContent value="tipe-faskes">
          {renderTable(getData('tipe-faskes'), getColumns('tipe-faskes'), getTitle('tipe-faskes'), 'tipe-faskes')}
        </TabsContent>

        <TabsContent value="status-leads">
          {renderTable(getData('status-leads'), getColumns('status-leads'), getTitle('status-leads'), 'status-leads')}
        </TabsContent>

        <TabsContent value="bukan-leads">
          {renderTable(getData('bukan-leads'), getColumns('bukan-leads'), getTitle('bukan-leads'), 'bukan-leads')}
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
