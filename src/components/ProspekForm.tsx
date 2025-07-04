
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useProspekForm } from '@/hooks/useProspekForm';
import { ProspekFormBasicFields } from './ProspekFormBasicFields';
import { ProspekFormStatusFields } from './ProspekFormStatusFields';
import { ProspekFormFaskesFields } from './ProspekFormFaskesFields';

interface ProspekFormProps {
  isEdit?: boolean;
  prospekId?: string;
}

// Sample data for edit mode
const sampleProspekData: Record<string, any> = {
  '1': {
    tanggalProspek: '2024-01-15',
    sumberLeads: 'Meta Ads',
    kodeAds: 'META',
    idAds: '5',
    namaProspek: 'Dr. Ahmad Fauzi',
    noWhatsApp: '081234567890',
    statusLeads: 'Leads',
    bukanLeads: '',
    keteranganBukanLeads: '',
    layananAssist: 'SIMRS',
    namaFaskes: 'RS Prima Medika',
    tipeFaskes: 'Rumah Sakit',
    provinsi: '31', // DKI Jakarta
    kota: 'Jakarta Pusat',
    picLeads: 'CS Support 1'
  },
  '2': {
    tanggalProspek: '2024-01-15',
    sumberLeads: 'Google Ads',
    kodeAds: 'GOOG',
    idAds: '3',
    namaProspek: 'dr. Siti Nurhaliza',
    noWhatsApp: '082345678901',
    statusLeads: 'Dihubungi',
    bukanLeads: '',
    keteranganBukanLeads: '',
    layananAssist: 'Telemedicine',
    namaFaskes: 'Klinik Sehat Bersama',
    tipeFaskes: 'Klinik',
    provinsi: '32', // Jawa Barat
    kota: 'Bandung',
    picLeads: 'CS Support 2'
  },
  '3': {
    tanggalProspek: '2024-01-16',
    sumberLeads: 'Referral',
    kodeAds: '',
    idAds: '',
    namaProspek: 'Dr. Budi Santoso',
    noWhatsApp: '083456789012',
    statusLeads: 'Bukan Leads',
    bukanLeads: 'Budget Tidak Sesuai',
    keteranganBukanLeads: 'Menginginkan harga lebih murah',
    layananAssist: 'EMR',
    namaFaskes: 'Puskesmas Sukamaju',
    tipeFaskes: 'Puskesmas',
    provinsi: '35', // Jawa Timur
    kota: 'Surabaya',
    picLeads: 'CS Support 1'
  }
};

export function ProspekForm({ isEdit = false, prospekId }: ProspekFormProps) {
  const {
    formData,
    provinces,
    regencies,
    loadingProvinces,
    loadingRegencies,
    handleInputChange,
    validateForm,
    setFormData
  } = useProspekForm();

  useEffect(() => {
    console.log('ProspekForm mounted:', { isEdit, prospekId });
    
    if (isEdit && prospekId && sampleProspekData[prospekId]) {
      const existingData = sampleProspekData[prospekId];
      console.log('Loading existing data for edit:', existingData);
      setFormData(existingData);
    } else if (isEdit && prospekId) {
      console.log('No data found for prospekId:', prospekId);
      toast({
        title: "Data tidak ditemukan",
        description: "Data prospek yang ingin diedit tidak ditemukan",
        variant: "destructive",
      });
    }
  }, [isEdit, prospekId, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Form submitted:', formData);
    toast({
      title: isEdit ? "Prospek berhasil diupdate" : "Prospek berhasil disimpan",
      description: isEdit ? "Data prospek telah diperbarui" : "Data prospek telah ditambahkan ke database",
    });
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
            <ProspekFormBasicFields 
              formData={formData}
              onInputChange={handleInputChange}
            />
            
            <ProspekFormStatusFields 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ProspekFormFaskesFields 
              formData={formData}
              onInputChange={handleInputChange}
              provinces={provinces}
              regencies={regencies}
              loadingProvinces={loadingProvinces}
              loadingRegencies={loadingRegencies}
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
