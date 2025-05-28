
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SupabaseDataMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'user' | 'layanan' | 'kode-ads' | 'sumber-leads' | 'tipe-faskes' | 'bukan-leads';
  mode: 'add' | 'edit';
  onSave: (data: any) => void;
}

export function SupabaseDataMasterModal({ isOpen, onClose, data, type, mode, onSave }: SupabaseDataMasterModalProps) {
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
          password: '',
          role: 'cs_support'
        });
      } else {
        setFormData({});
      }
    }
  }, [mode, data, isOpen, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (type === 'user') {
        // Handle user creation/update differently since it involves auth
        if (mode === 'add') {
          // Validate password
          if (!formData.password || formData.password.length < 6) {
            toast({
              title: "Error",
              description: "Password harus minimal 6 karakter",
              variant: "destructive",
            });
            return;
          }

          // Get current session to restore later
          const { data: currentSession } = await supabase.auth.getSession();

          // Create user using signup with autoConfirm disabled to prevent auto-login
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.full_name,
                role: formData.role
              }
            }
          });

          if (authError) {
            console.error('Auth error:', authError);
            toast({
              title: "Error",
              description: `Gagal membuat user: ${authError.message}`,
              variant: "destructive",
            });
            return;
          }

          // If the signup caused an auto-login, sign out immediately
          if (authData.session) {
            await supabase.auth.signOut();
            
            // Restore the original session if it existed
            if (currentSession.session) {
              await supabase.auth.setSession(currentSession.session);
            }
          }

          // Profile will be created automatically by trigger
          toast({
            title: "Berhasil",
            description: "User berhasil ditambahkan",
          });
        } else {
          // For editing, update the profile directly
          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              email: formData.email,
              role: formData.role
            })
            .eq('id', data.id);

          if (error) throw error;

          toast({
            title: "Berhasil",
            description: "User berhasil diupdate",
          });
        }
      } else {
        // Handle other data types normally
        onSave(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data user",
        variant: "destructive",
      });
    }
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
            {mode === 'add' && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData?.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                />
              </div>
            )}
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
