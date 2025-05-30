
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSupabaseProspekForm } from '@/hooks/useSupabaseProspekForm';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseProspekFormBasicFields } from './SupabaseProspekFormBasicFields';
import { SupabaseProspekFormStatusFields } from './SupabaseProspekFormStatusFields';
import { SupabaseProspekFormFaskesFields } from './SupabaseProspekFormFaskesFields';

interface SupabaseProspekFormProps {
  isEdit?: boolean;
  prospekId?: string;
  onSuccess?: () => void;
}

export function SupabaseProspekForm({ isEdit = false, prospekId, onSuccess }: SupabaseProspekFormProps) {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'cs_support';
  
  const {
    formData,
    setFormData,
    provinces,
    regencies,
    loadingRegencies,
    sumberLeadsOptions,
    kodeAdsOptions,
    layananAssistOptions,
    alasanBukanLeadsOptions,
    usersOptions,
    handleInputChange,
    validateForm
  } = useSupabaseProspekForm();

  const { createProspek, updateProspek, prospekData } = useSupabaseData();

  useEffect(() => {
    if (isEdit && prospekId && prospekData.length > 0) {
      const existingProspek = prospekData.find(p => p.id === prospekId);
      if (existingProspek) {
        console.log('Loading existing prospek data for edit:', existingProspek);
        
        // Find the correct IDs for dropdown fields
        const sumberLeadsId = sumberLeadsOptions.find(s => s.nama === existingProspek.sumber_leads?.nama)?.id || '';
        const kodeAdsId = kodeAdsOptions.find(k => k.kode === existingProspek.kode_ads?.kode)?.id || '';
        const layananAssistId = layananAssistOptions.find(l => l.nama === existingProspek.layanan_assist?.nama)?.id || '';
        const alasanBukanLeadsId = alasanBukanLeadsOptions.find(a => a.alasan === existingProspek.alasan_bukan_leads?.alasan)?.id || '';
        const picLeadsId = usersOptions.find(u => u.full_name === existingProspek.pic_leads?.full_name)?.id || '';
        
        // Find province ID from name
        const provinsiId = provinces.find(p => p.name === existingProspek.provinsi_nama)?.id || '';

        setFormData({
          tanggal_prospek: existingProspek.tanggal_prospek,
          sumber_leads_id: sumberLeadsId,
          kode_ads_id: kodeAdsId,
          id_ads: existingProspek.id_ads || '',
          nama_prospek: existingProspek.nama_prospek,
          no_whatsapp: existingProspek.no_whatsapp,
          status_leads: existingProspek.status_leads,
          alasan_bukan_leads_id: alasanBukanLeadsId,
          keterangan_bukan_leads: existingProspek.keterangan_bukan_leads || '',
          layanan_assist_id: layananAssistId,
          nama_faskes: existingProspek.nama_faskes,
          tipe_faskes: existingProspek.tipe_faskes,
          provinsi_id: provinsiId,
          provinsi_nama: existingProspek.provinsi_nama,
          kota: existingProspek.kota,
          pic_leads_id: picLeadsId
        });
      }
    }
  }, [isEdit, prospekId, prospekData, setFormData, sumberLeadsOptions, kodeAdsOptions, layananAssistOptions, alasanBukanLeadsOptions, usersOptions, provinces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, proceeding with submission');

    // Convert display IDs back to actual IDs for submission
    const submissionData = {
      tanggal_prospek: formData.tanggal_prospek,
      sumber_leads_id: formData.sumber_leads_id || null,
      kode_ads_id: formData.kode_ads_id || null,
      id_ads: formData.id_ads || null,
      nama_prospek: formData.nama_prospek,
      no_whatsapp: formData.no_whatsapp,
      status_leads: formData.status_leads,
      alasan_bukan_leads_id: formData.alasan_bukan_leads_id || null,
      keterangan_bukan_leads: formData.keterangan_bukan_leads || null,
      layanan_assist_id: formData.layanan_assist_id || null,
      nama_faskes: formData.nama_faskes,
      tipe_faskes: formData.tipe_faskes,
      provinsi_id: formData.provinsi_id,
      provinsi_nama: formData.provinsi_nama,
      kota: formData.kota,
      pic_leads_id: userRole === 'admin' ? formData.pic_leads_id || null : user?.id || null,
    };

    console.log('Submission data:', submissionData);

    let result;
    try {
      if (isEdit && prospekId) {
        console.log('Updating prospek with ID:', prospekId);
        result = await updateProspek(prospekId, submissionData);
      } else {
        console.log('Creating new prospek');
        result = await createProspek(submissionData);
      }

      console.log('Operation result:', result);

      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          {isEdit ? 'Form Edit Prospek' : 'Form Input Prospek'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SupabaseProspekFormBasicFields 
              formData={formData}
              onInputChange={handleInputChange}
              sumberLeadsOptions={sumberLeadsOptions}
              kodeAdsOptions={kodeAdsOptions}
            />
            
            <SupabaseProspekFormStatusFields 
              formData={formData}
              onInputChange={handleInputChange}
              alasanBukanLeadsOptions={alasanBukanLeadsOptions}
            />

            <SupabaseProspekFormFaskesFields 
              formData={formData}
              onInputChange={handleInputChange}
              provinces={provinces}
              regencies={regencies}
              loadingRegencies={loadingRegencies}
              layananAssistOptions={layananAssistOptions}
              usersOptions={usersOptions}
              userRole={userRole}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEdit ? 'Update Prospek' : 'Simpan Prospek'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
