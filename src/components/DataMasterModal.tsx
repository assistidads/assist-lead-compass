
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface DataMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'user' | 'layanan' | 'kode-ads' | 'sumber' | 'tipe-faskes' | 'status' | 'bukan-leads';
  mode: 'add' | 'edit';
  onSave: (data: any) => void;
}

export function DataMasterModal({ isOpen, onClose, data, type, mode, onSave }: DataMasterModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData(data);
    } else {
      // Initialize with proper default values for each type
      if (type === 'user') {
        setFormData({
          full_name: '',
          email: '',
          role: 'cs_support'
        });
      } else {
        setFormData({});
      }
    }
  }, [mode, data, isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data based on type
    let submitData = { ...formData };
    
    if (type === 'user') {
      // Ensure we have the correct field names for user
      submitData = {
        full_name: formData.full_name || formData.nama,
        email: formData.email,
        role: formData.role
      };
    }
    
    onSave(submitData);
    onClose();
    toast({
      title: mode === 'add' ? 'Data berhasil ditambahkan' : 'Data berhasil diupdate',
      description: 'Perubahan telah disimpan',
    });
  };

  const renderFields = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <div>
              <Label htmlFor="full_name">Nama Admin</Label>
              <Input
                id="full_name"
                value={formData?.full_name || formData?.nama || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData?.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData?.role || 'cs_support'} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cs_support">CS Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'layanan':
        return (
          <div>
            <Label htmlFor="layanan">Layanan</Label>
            <Input
              id="layanan"
              value={formData?.nama || formData?.layanan || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
        );
      case 'kode-ads':
        return (
          <div>
            <Label htmlFor="kode">Kode Ads</Label>
            <Input
              id="kode"
              value={formData?.kode || ''}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              required
            />
          </div>
        );
      case 'sumber':
        return (
          <div>
            <Label htmlFor="sumber">Sumber Leads</Label>
            <Input
              id="sumber"
              value={formData?.nama || formData?.sumber || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
        );
      case 'tipe-faskes':
        return (
          <div>
            <Label htmlFor="tipe">Tipe Faskes</Label>
            <Input
              id="tipe"
              value={formData?.nama || formData?.tipe || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
        );
      case 'status':
        return (
          <div>
            <Label htmlFor="status">Status Leads</Label>
            <Input
              id="status"
              value={formData?.nama || formData?.status || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
        );
      case 'bukan-leads':
        return (
          <div>
            <Label htmlFor="alasan">Alasan Bukan Leads</Label>
            <Input
              id="alasan"
              value={formData?.alasan || ''}
              onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    const typeNames = {
      'user': 'User',
      'layanan': 'Layanan',
      'kode-ads': 'Kode Ads',
      'sumber': 'Sumber Leads',
      'tipe-faskes': 'Tipe Faskes',
      'status': 'Status Leads',
      'bukan-leads': 'Bukan Leads'
    };
    return `${mode === 'add' ? 'Tambah' : 'Edit'} ${typeNames[type]}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
