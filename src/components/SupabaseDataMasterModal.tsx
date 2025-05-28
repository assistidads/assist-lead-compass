
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SupabaseDataMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'user' | 'layanan' | 'kode-ads' | 'sumber-leads' | 'tipe-faskes' | 'status-leads' | 'bukan-leads';
  mode: 'add' | 'edit';
  onSave: (data: any) => void;
}

export function SupabaseDataMasterModal({ isOpen, onClose, data, type, mode, onSave }: SupabaseDataMasterModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [mode, data, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderFields = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                value={formData?.full_name || ''}
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
              <Select value={formData?.role || ''} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
            <Label htmlFor="nama">Layanan</Label>
            <Input
              id="nama"
              value={formData?.nama || ''}
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
      case 'sumber-leads':
        return (
          <div>
            <Label htmlFor="nama">Sumber Leads</Label>
            <Input
              id="nama"
              value={formData?.nama || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
        );
      case 'tipe-faskes':
        return (
          <div>
            <Label htmlFor="nama">Tipe Faskes</Label>
            <Select value={formData?.nama || ''} onValueChange={(value) => setFormData({ ...formData, nama: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe Faskes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rumah Sakit">Rumah Sakit</SelectItem>
                <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                <SelectItem value="Klinik">Klinik</SelectItem>
                <SelectItem value="Lab Kesehatan">Lab Kesehatan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'status-leads':
        return (
          <div>
            <Label htmlFor="nama">Status Leads</Label>
            <Select value={formData?.nama || ''} onValueChange={(value) => setFormData({ ...formData, nama: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prospek">Prospek</SelectItem>
                <SelectItem value="Dihubungi">Dihubungi</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Bukan Leads">Bukan Leads</SelectItem>
                <SelectItem value="On Going">On Going</SelectItem>
              </SelectContent>
            </Select>
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
      'sumber-leads': 'Sumber Leads',
      'tipe-faskes': 'Tipe Faskes',
      'status-leads': 'Status Leads',
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
