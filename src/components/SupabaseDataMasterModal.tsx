
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserFormFields } from './modal-fields/UserFormFields';
import { LayananFormFields } from './modal-fields/LayananFormFields';
import { KodeAdsFormFields } from './modal-fields/KodeAdsFormFields';
import { SumberLeadsFormFields } from './modal-fields/SumberLeadsFormFields';
import { TipeFaskesFormFields } from './modal-fields/TipeFaskesFormFields';
import { StatusLeadsFormFields } from './modal-fields/StatusLeadsFormFields';
import { BukanLeadsFormFields } from './modal-fields/BukanLeadsFormFields';

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
        return <UserFormFields formData={formData} setFormData={setFormData} mode={mode} />;
      case 'layanan':
        return <LayananFormFields formData={formData} setFormData={setFormData} />;
      case 'kode-ads':
        return <KodeAdsFormFields formData={formData} setFormData={setFormData} />;
      case 'sumber-leads':
        return <SumberLeadsFormFields formData={formData} setFormData={setFormData} />;
      case 'tipe-faskes':
        return <TipeFaskesFormFields formData={formData} setFormData={setFormData} />;
      case 'status-leads':
        return <StatusLeadsFormFields formData={formData} setFormData={setFormData} />;
      case 'bukan-leads':
        return <BukanLeadsFormFields formData={formData} setFormData={setFormData} />;
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
