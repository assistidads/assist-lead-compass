
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useSupabaseData, DataMasterItem, UserProfile } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SupabaseDataMasterModal } from './SupabaseDataMasterModal';
import { SupabaseDataMasterDeleteDialog } from './SupabaseDataMasterDeleteDialog';

type DataType = 'user' | 'layanan' | 'kode-ads' | 'sumber-leads' | 'tipe-faskes' | 'bukan-leads';

export function SupabaseDataMaster() {
  const { layananData, kodeAdsData, sumberLeadsData, alasanBukanLeadsData, usersData, refetchData } = useSupabaseData();
  const [activeTab, setActiveTab] = useState<DataType>('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAdd = () => {
    setSelectedItem(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (activeTab === 'user') {
        // User handling is done in the modal
        refetchData();
        return;
      }

      const tableName = getTableName(activeTab);
      
      if (modalMode === 'add') {
        const { error } = await supabase
          .from(tableName as any)
          .insert([data]);
        
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Data berhasil ditambahkan",
        });
      } else {
        const { error } = await supabase
          .from(tableName as any)
          .update(data)
          .eq('id', selectedItem.id);
        
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
    try {
      if (activeTab === 'user') {
        // Delete user profile
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedItem.id);
        
        if (error) throw error;
      } else {
        const tableName = getTableName(activeTab);
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq('id', selectedItem.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Berhasil",
        description: "Data berhasil dihapus",
        variant: "destructive",
      });
      
      refetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const getTableName = (type: DataType) => {
    switch (type) {
      case 'layanan': return 'layanan_assist';
      case 'kode-ads': return 'kode_ads';
      case 'sumber-leads': return 'sumber_leads';
      case 'tipe-faskes': return 'tipe_faskes';
      case 'bukan-leads': return 'alasan_bukan_leads';
      default: return '';
    }
  };

  const getCurrentData = (): (DataMasterItem | UserProfile)[] => {
    switch (activeTab) {
      case 'user': return usersData;
      case 'layanan': return layananData;
      case 'kode-ads': return kodeAdsData;
      case 'sumber-leads': return sumberLeadsData;
      case 'tipe-faskes': return [];
      case 'bukan-leads': return alasanBukanLeadsData;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => {
    const searchValue = searchTerm.toLowerCase();
    if (activeTab === 'user') {
      const userItem = item as UserProfile;
      return (
        userItem.full_name?.toLowerCase().includes(searchValue) ||
        userItem.email?.toLowerCase().includes(searchValue) ||
        userItem.role?.toLowerCase().includes(searchValue)
      );
    } else if (activeTab === 'kode-ads') {
      const kodeItem = item as DataMasterItem & { kode?: string };
      return kodeItem.kode?.toLowerCase().includes(searchValue);
    } else if (activeTab === 'bukan-leads') {
      const alasanItem = item as DataMasterItem & { alasan?: string };
      return alasanItem.alasan?.toLowerCase().includes(searchValue);
    } else {
      const namaItem = item as DataMasterItem & { nama?: string };
      return namaItem.nama?.toLowerCase().includes(searchValue);
    }
  });

  const tabs = [
    { id: 'user' as DataType, label: 'User' },
    { id: 'layanan' as DataType, label: 'Layanan' },
    { id: 'kode-ads' as DataType, label: 'Kode Ads' },
    { id: 'sumber-leads' as DataType, label: 'Sumber Leads' },
    { id: 'tipe-faskes' as DataType, label: 'Tipe Faskes' },
    { id: 'bukan-leads' as DataType, label: 'Bukan Leads' }
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'cs_support': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTableContent = () => {
    if (activeTab === 'user') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((user) => {
              const userItem = user as UserProfile;
              return (
                <TableRow key={userItem.id}>
                  <TableCell className="font-medium">{userItem.full_name}</TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(userItem.role)}>
                      {userItem.role === 'admin' ? 'Admin' : 'CS Support'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(userItem.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(userItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(userItem)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // For other data types
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {activeTab === 'kode-ads' ? 'Kode' : 
               activeTab === 'bukan-leads' ? 'Alasan' : 'Nama'}
            </TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead>Terakhir Update</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => {
            const dataItem = item as DataMasterItem & { kode?: string; alasan?: string; nama?: string };
            return (
              <TableRow key={dataItem.id}>
                <TableCell className="font-medium">
                  {activeTab === 'kode-ads' ? dataItem.kode : 
                   activeTab === 'bukan-leads' ? dataItem.alasan : dataItem.nama}
                </TableCell>
                <TableCell>{new Date(dataItem.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{new Date(dataItem.updated_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dataItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dataItem)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const getItemName = (item: any) => {
    if (activeTab === 'user') {
      return (item as UserProfile).full_name;
    } else if (activeTab === 'kode-ads') {
      return (item as DataMasterItem & { kode?: string }).kode;
    } else if (activeTab === 'bukan-leads') {
      return (item as DataMasterItem & { alasan?: string }).alasan;
    } else {
      return (item as DataMasterItem & { nama?: string }).nama;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Master</h2>
        <p className="text-gray-600">Kelola data master untuk sistem prospek</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Data {tabs.find(t => t.id === activeTab)?.label}
            </CardTitle>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah {tabs.find(t => t.id === activeTab)?.label}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Cari ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredData.length} data ditemukan
            </div>
          </div>
          
          <div className="border rounded-lg">
            {renderTableContent()}
          </div>
        </CardContent>
      </Card>

      <SupabaseDataMasterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedItem}
        type={activeTab}
        mode={modalMode}
        onSave={handleSave}
      />

      <SupabaseDataMasterDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem ? getItemName(selectedItem) : ''}
      />
    </div>
  );
}
