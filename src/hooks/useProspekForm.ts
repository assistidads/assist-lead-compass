
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface ProspekFormData {
  tanggalProspek: string;
  sumberLeads: string;
  kodeAds: string;
  idAds: string;
  namaProspek: string;
  noWhatsApp: string;
  statusLeads: string;
  bukanLeads: string;
  keteranganBukanLeads: string;
  layananAssist: string;
  namaFaskes: string;
  tipeFaskes: string;
  provinsi: string;
  kota: string;
  picLeads: string;
}

// Data provinsi lengkap 38 provinsi Indonesia
const indonesianProvinces: Province[] = [
  { id: '11', name: 'Aceh' },
  { id: '12', name: 'Sumatera Utara' },
  { id: '13', name: 'Sumatera Barat' },
  { id: '14', name: 'Riau' },
  { id: '15', name: 'Jambi' },
  { id: '16', name: 'Sumatera Selatan' },
  { id: '17', name: 'Bengkulu' },
  { id: '18', name: 'Lampung' },
  { id: '19', name: 'Kepulauan Bangka Belitung' },
  { id: '21', name: 'Kepulauan Riau' },
  { id: '31', name: 'DKI Jakarta' },
  { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' },
  { id: '34', name: 'DI Yogyakarta' },
  { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' },
  { id: '51', name: 'Bali' },
  { id: '52', name: 'Nusa Tenggara Barat' },
  { id: '53', name: 'Nusa Tenggara Timur' },
  { id: '61', name: 'Kalimantan Barat' },
  { id: '62', name: 'Kalimantan Tengah' },
  { id: '63', name: 'Kalimantan Selatan' },
  { id: '64', name: 'Kalimantan Timur' },
  { id: '65', name: 'Kalimantan Utara' },
  { id: '71', name: 'Sulawesi Utara' },
  { id: '72', name: 'Sulawesi Tengah' },
  { id: '73', name: 'Sulawesi Selatan' },
  { id: '74', name: 'Sulawesi Tenggara' },
  { id: '75', name: 'Gorontalo' },
  { id: '76', name: 'Sulawesi Barat' },
  { id: '81', name: 'Maluku' },
  { id: '82', name: 'Maluku Utara' },
  { id: '91', name: 'Papua Barat' },
  { id: '92', name: 'Papua' },
  { id: '93', name: 'Papua Selatan' },
  { id: '94', name: 'Papua Tengah' },
  { id: '95', name: 'Papua Pegunungan' },
  { id: '96', name: 'Papua Barat Daya' }
];

export function useProspekForm() {
  const [formData, setFormData] = useState<ProspekFormData>({
    tanggalProspek: new Date().toISOString().split('T')[0],
    sumberLeads: '',
    kodeAds: '',
    idAds: '',
    namaProspek: '',
    noWhatsApp: '',
    statusLeads: '',
    bukanLeads: '',
    keteranganBukanLeads: '',
    layananAssist: '',
    namaFaskes: '',
    tipeFaskes: '',
    provinsi: '',
    kota: '',
    picLeads: 'CS Support 1'
  });

  const [provinces] = useState<Province[]>(indonesianProvinces);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  // Fetch regencies when province changes
  useEffect(() => {
    if (formData.provinsi) {
      fetchRegencies(formData.provinsi);
    } else {
      setRegencies([]);
    }
  }, [formData.provinsi]);

  const fetchRegencies = async (provinceId: string) => {
    setLoadingRegencies(true);
    try {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      const data = await response.json();
      setRegencies(data);
    } catch (error) {
      console.error('Error fetching regencies:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kota/kabupaten",
        variant: "destructive",
      });
    } finally {
      setLoadingRegencies(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'sumberLeads' && !value.toLowerCase().includes('ads')) {
        newData.kodeAds = '';
        newData.idAds = '';
      }
      
      if (field === 'statusLeads' && value !== 'Bukan Leads') {
        newData.bukanLeads = '';
        newData.keteranganBukanLeads = '';
      }

      if (field === 'provinsi') {
        newData.kota = '';
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    const requiredFields = [
      { field: 'tanggalProspek', label: 'Tanggal Prospek Masuk' },
      { field: 'sumberLeads', label: 'Sumber Leads' },
      { field: 'namaProspek', label: 'Nama Prospek' },
      { field: 'noWhatsApp', label: 'No WhatsApp' },
      { field: 'statusLeads', label: 'Status Leads' },
      { field: 'layananAssist', label: 'Layanan Assist' },
      { field: 'namaFaskes', label: 'Nama Faskes' },
      { field: 'tipeFaskes', label: 'Tipe Faskes' },
      { field: 'provinsi', label: 'Provinsi' },
      { field: 'kota', label: 'Kota/Kabupaten' }
    ];

    const showKodeAds = formData.sumberLeads.toLowerCase().includes('ads');
    if (showKodeAds) {
      requiredFields.push({ field: 'kodeAds', label: 'Kode Ads' });
      requiredFields.push({ field: 'idAds', label: 'ID Ads' });
    }

    const showBukanLeadsFields = formData.statusLeads === 'Bukan Leads';
    if (showBukanLeadsFields) {
      requiredFields.push({ field: 'bukanLeads', label: 'Bukan Leads' });
      requiredFields.push({ field: 'keteranganBukanLeads', label: 'Keterangan Bukan Leads' });
    }

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Field wajib kosong",
          description: `${label} harus diisi`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return {
    formData,
    setFormData,
    provinces,
    regencies,
    loadingProvinces,
    loadingRegencies,
    handleInputChange,
    validateForm
  };
}
