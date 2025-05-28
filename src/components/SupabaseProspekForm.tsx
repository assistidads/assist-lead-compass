
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
        setFormData({
          tanggal_prospek: existingProspek.tanggal_prospek,
          sumber_leads_id: existingProspek.sumber_leads?.nama || '',
          kode_ads_id: existingProspek.kode_ads?.kode || '',
          id_ads: existingProspek.id_ads || '',
          nama_prospek: existingProspek.nama_prospek,
          no_whatsapp: existingProspek.no_whatsapp,
          status_leads: existingProspek.status_leads,
          alasan_bukan_leads_id: existingProspek.alasan_bukan_leads?.alasan || '',
          keterangan_bukan_leads: existingProspek.keterangan_bukan_leads || '',
          layanan_assist_id: existingProspek.layanan_assist?.nama || '',
          nama_faskes: existingProspek.nama_faskes,
          tipe_faskes: existingProspek.tipe_faskes,
          provinsi_id: '', // Will be set based on provinsi_nama
          provinsi_nama: existingProspek.provinsi_nama,
          kota: existingProspek.kota,
          pic_leads_id: existingProspek.pic_leads?.full_name || ''
        });
      }
    }
  }, [isEdit, prospekId, prospekData, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let result;
    if (isEdit && prospekId) {
      result = await updateProspek(prospekId, formData);
    } else {
      result = await createProspek(formData);
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
