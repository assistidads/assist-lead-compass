
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

// Fallback data untuk provinsi Papua yang mungkin tidak ada di API
const fallbackRegencies: Record<string, Regency[]> = {
  '91': [
    { id: '9101', province_id: '91', name: 'Manokwari' },
    { id: '9102', province_id: '91', name: 'Sorong' },
    { id: '9103', province_id: '91', name: 'Raja Ampat' },
    { id: '9104', province_id: '91', name: 'Teluk Bintuni' },
    { id: '9105', province_id: '91', name: 'Fakfak' },
    { id: '9106', province_id: '91', name: 'Kaimana' },
    { id: '9107', province_id: '91', name: 'Tambrauw' },
    { id: '9108', province_id: '91', name: 'Maybrat' },
    { id: '9109', province_id: '91', name: 'Manokwari Selatan' },
    { id: '9110', province_id: '91', name: 'Pegunungan Arfak' },
    { id: '9111', province_id: '91', name: 'Sorong' },
    { id: '9112', province_id: '91', name: 'Sorong Selatan' },
    { id: '9113', province_id: '91', name: 'Teluk Wondama' }
  ],
  '92': [
    { id: '9201', province_id: '92', name: 'Jayapura' },
    { id: '9202', province_id: '92', name: 'Biak Numfor' },
    { id: '9203', province_id: '92', name: 'Nabire' },
    { id: '9204', province_id: '92', name: 'Kepulauan Yapen' },
    { id: '9205', province_id: '92', name: 'Merauke' },
    { id: '9206', province_id: '92', name: 'Sarmi' },
    { id: '9207', province_id: '92', name: 'Keerom' },
    { id: '9208', province_id: '92', name: 'Waropen' },
    { id: '9209', province_id: '92', name: 'Supiori' },
    { id: '9210', province_id: '92', name: 'Mamberamo Raya' }
  ],
  '93': [
    { id: '9301', province_id: '93', name: 'Merauke' },
    { id: '9302', province_id: '93', name: 'Boven Digoel' },
    { id: '9303', province_id: '93', name: 'Mappi' },
    { id: '9304', province_id: '93', name: 'Asmat' }
  ],
  '94': [
    { id: '9401', province_id: '94', name: 'Nabire' },
    { id: '9402', province_id: '94', name: 'Paniai' },
    { id: '9403', province_id: '94', name: 'Mimika' },
    { id: '9404', province_id: '94', name: 'Puncak Jaya' },
    { id: '9405', province_id: '94', name: 'Dogiyai' },
    { id: '9406', province_id: '94', name: 'Intan Jaya' },
    { id: '9407', province_id: '94', name: 'Deiyai' }
  ],
  '95': [
    { id: '9501', province_id: '95', name: 'Jayawijaya' },
    { id: '9502', province_id: '95', name: 'Nduga' },
    { id: '9503', province_id: '95', name: 'Lanny Jaya' },
    { id: '9504', province_id: '95', name: 'Mamberamo Tengah' },
    { id: '9505', province_id: '95', name: 'Yalimo' },
    { id: '9506', province_id: '95', name: 'Puncak' },
    { id: '9507', province_id: '95', name: 'Tolikara' }
  ],
  '96': [
    { id: '9601', province_id: '96', name: 'Sorong' },
    { id: '9602', province_id: '96', name: 'Raja Ampat' },
    { id: '9603', province_id: '96', name: 'Tambrauw' },
    { id: '9604', province_id: '96', name: 'Maybrat' },
    { id: '9605', province_id: '96', name: 'Sorong Selatan' }
  ]
};

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
    console.log('Fetching regencies for province:', provinceId);
    
    try {
      // Cek apakah provinsi memiliki fallback data
      if (fallbackRegencies[provinceId]) {
        console.log('Using fallback data for province:', provinceId);
        setRegencies(fallbackRegencies[provinceId]);
        setLoadingRegencies(false);
        return;
      }

      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No regency data available');
      }
      
      setRegencies(data);
    } catch (error) {
      console.error('Error fetching regencies:', error);
      
      // Gunakan fallback data jika ada
      if (fallbackRegencies[provinceId]) {
        console.log('Using fallback data due to API error for province:', provinceId);
        setRegencies(fallbackRegencies[provinceId]);
        toast({
          title: "Peringatan",
          description: "Menggunakan data wilayah lokal karena koneksi API terbatas",
          variant: "default",
        });
      } else {
        setRegencies([]);
        toast({
          title: "Error",
          description: "Gagal memuat data kota/kabupaten. Silakan coba lagi.",
          variant: "destructive",
        });
      }
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
