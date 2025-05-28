
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSupabaseProspekForm } from '@/hooks/useSupabaseProspekForm';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { SupabaseProspekFormBasicFields } from './SupabaseProspekFormBasicFields';
import { SupabaseProspekFormStatusFields } from './SupabaseProspekFormStatusFields';
import { SupabaseProspekFormFaskesFields } from './SupabaseProspekFormFaskesFields';

interface SupabaseProspekFormProps {
  isEdit?: boolean;
  prospekId?: string;
  onSuccess?: () => void;
}

export function SupabaseProspekForm({ isEdit = false, prospekId, onSuccess }: SupabaseProspekFormProps) {
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
    
    if (!validateForm()) {
      return;
    }

    // Convert display IDs back to actual IDs for submission
    const submissionData = {
      ...formData,
      sumber_leads_id: sumberLeadsOptions.find(s => s.id === formData.sumber_leads_id)?.id || null,
      kode_ads_id: kodeAdsOptions.find(k => k.id === formData.kode_ads_id)?.id || null,
      layanan_assist_id: layananAssistOptions.find(l => l.id === formData.layanan_assist_id)?.id || null,
      alasan_bukan_leads_id: alasanBukanLeadsOptions.find(a => a.id === formData.alasan_bukan_leads_id)?.id || null,
      pic_leads_id: usersOptions.find(u => u.id === formData.pic_leads_id)?.id || null,
    };

    let result;
    if (isEdit && prospekId) {
      result = await updateProspek(prospekId, submissionData);
    } else {
      result = await createProspek(submissionData);
    }

    if (result && onSuccess) {
      onSuccess();
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
