
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SupabaseDataMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'layanan' | 'kode-ads' | 'sumber' | 'bukan-leads';
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
      case 'sumber':
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
      'layanan': 'Layanan',
      'kode-ads': 'Kode Ads',
      'sumber': 'Sumber Leads',
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
