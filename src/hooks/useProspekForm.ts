
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

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (formData.provinsi) {
      fetchRegencies(formData.provinsi);
    } else {
      setRegencies([]);
    }
  }, [formData.provinsi]);

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data provinsi",
        variant: "destructive",
      });
    } finally {
      setLoadingProvinces(false);
    }
  };

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
    provinces,
    regencies,
    loadingProvinces,
    loadingRegencies,
    handleInputChange,
    validateForm
  };
}
