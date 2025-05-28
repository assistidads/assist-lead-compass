
import { useState } from 'react';
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
  const [formData, setFormData] = useState(data || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              <Label htmlFor="nama">Nama Admin</Label>
              <Input
                id="nama"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role || ''} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="CS Support">CS Support</SelectItem>
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
              value={formData.layanan || ''}
              onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
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
              value={formData.kode || ''}
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
              value={formData.sumber || ''}
              onChange={(e) => setFormData({ ...formData, sumber: e.target.value })}
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
              value={formData.tipe || ''}
              onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
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
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              value={formData.alasan || ''}
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
