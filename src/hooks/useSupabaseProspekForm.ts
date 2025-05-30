import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface SupabaseProspekFormData {
  tanggal_prospek: string;
  sumber_leads_id: string;
  kode_ads_id: string;
  id_ads: string;
  nama_prospek: string;
  no_whatsapp: string;
  status_leads: string;
  alasan_bukan_leads_id: string;
  keterangan_bukan_leads: string;
  layanan_assist_id: string;
  nama_faskes: string;
  tipe_faskes: string;
  provinsi_id: string;
  provinsi_nama: string;
  kota: string;
  pic_leads_id: string;
}

export function useSupabaseProspekForm() {
  const { user } = useAuth();
  const { statusLeadsData, tipeFaskesData } = useSupabaseData();
  
  const [formData, setFormData] = useState<SupabaseProspekFormData>({
    tanggal_prospek: new Date().toISOString().split('T')[0],
    sumber_leads_id: '',
    kode_ads_id: '',
    id_ads: '',
    nama_prospek: '',
    no_whatsapp: '',
    status_leads: 'Prospek',
    alasan_bukan_leads_id: '',
    keterangan_bukan_leads: '',
    layanan_assist_id: '',
    nama_faskes: '',
    tipe_faskes: 'Rumah Sakit',
    provinsi_id: '',
    provinsi_nama: '',
    kota: '',
    pic_leads_id: user?.id || ''
  });

  const [provinces] = useState<Province[]>([
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
  ]);

  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  
  // Master data
  const [sumberLeadsOptions, setSumberLeadsOptions] = useState<any[]>([]);
  const [kodeAdsOptions, setKodeAdsOptions] = useState<any[]>([]);
  const [layananAssistOptions, setLayananAssistOptions] = useState<any[]>([]);
  const [alasanBukanLeadsOptions, setAlasanBukanLeadsOptions] = useState<any[]>([]);
  const [usersOptions, setUsersOptions] = useState<any[]>([]);

  // Fetch master data options
  useEffect(() => {
    const fetchMasterData = async () => {
      if (!user) return;

      try {
        // Fetch sumber leads
        const { data: sumberData } = await supabase
          .from('sumber_leads')
          .select('*')
          .order('nama');
        setSumberLeadsOptions(sumberData || []);

        // Fetch kode ads
        const { data: kodeData } = await supabase
          .from('kode_ads')
          .select('*')
          .order('kode');
        setKodeAdsOptions(kodeData || []);

        // Fetch layanan assist
        const { data: layananData } = await supabase
          .from('layanan_assist')
          .select('*')
          .order('nama');
        setLayananAssistOptions(layananData || []);

        // Fetch alasan bukan leads
        const { data: alasanData } = await supabase
          .from('alasan_bukan_leads')
          .select('*')
          .order('alasan');
        setAlasanBukanLeadsOptions(alasanData || []);

        // Fetch users
        const { data: usersData } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name');
        setUsersOptions(usersData || []);

      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchMasterData();
  }, [user]);

  // Fetch regencies when province changes
  useEffect(() => {
    if (formData.provinsi_id) {
      fetchRegencies(formData.provinsi_id);
      // Set province name
      const province = [
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
      ].find(p => p.id === formData.provinsi_id);
      if (province) {
        setFormData(prev => ({ ...prev, provinsi_nama: province.name }));
      }
    } else {
      setRegencies([]);
    }
  }, [formData.provinsi_id, provinces]);

  const fetchRegencies = async (provinceId: string) => {
    setLoadingRegencies(true);
    
    try {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRegencies(data || []);
    } catch (error) {
      console.error('Error fetching regencies:', error);
      setRegencies([]);
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
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'sumber_leads_id') {
        const sumberLeads = sumberLeadsOptions.find(s => s.id === value);
        if (!sumberLeads?.nama?.toLowerCase().includes('ads')) {
          newData.kode_ads_id = '';
          newData.id_ads = '';
        }
      }
      
      if (field === 'status_leads' && value !== 'Bukan Leads') {
        newData.alasan_bukan_leads_id = '';
        newData.keterangan_bukan_leads = '';
      }

      if (field === 'provinsi_id') {
        newData.kota = '';
        // Set province name
        const province = [
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
        ].find(p => p.id === value);
        if (province) {
          newData.provinsi_nama = province.name;
        }
      }
      
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);

    const requiredFields = [
      { field: 'tanggal_prospek', label: 'Tanggal Prospek' },
      { field: 'sumber_leads_id', label: 'Sumber Leads' },
      { field: 'nama_prospek', label: 'Nama Prospek' },
      { field: 'no_whatsapp', label: 'No WhatsApp' },
      { field: 'status_leads', label: 'Status Leads' },
      { field: 'layanan_assist_id', label: 'Layanan Assist' },
      { field: 'nama_faskes', label: 'Nama Faskes' },
      { field: 'tipe_faskes', label: 'Tipe Faskes' },
      { field: 'provinsi_id', label: 'Provinsi' },
      { field: 'kota', label: 'Kota/Kabupaten' }
    ];

    // Check if ads fields are required based on sumber leads name
    const selectedSumber = sumberLeadsOptions.find(s => s.id === formData.sumber_leads_id);
    console.log('Selected sumber leads:', selectedSumber);
    
    if (selectedSumber?.nama?.toLowerCase().includes('ads')) {
      requiredFields.push({ field: 'kode_ads_id', label: 'Kode Ads' });
      requiredFields.push({ field: 'id_ads', label: 'ID Ads' });
    }

    // Check if bukan leads fields are required
    if (formData.status_leads === 'Bukan Leads') {
      requiredFields.push({ field: 'alasan_bukan_leads_id', label: 'Alasan Bukan Leads' });
      requiredFields.push({ field: 'keterangan_bukan_leads', label: 'Keterangan Bukan Leads' });
    }

    for (const { field, label } of requiredFields) {
      const value = formData[field as keyof typeof formData];
      console.log(`Checking field ${field}:`, value);
      
      if (!value || value.toString().trim() === '') {
        console.log(`Validation failed for field: ${field}`);
        toast({
          title: "Field wajib kosong",
          description: `${label} harus diisi`,
          variant: "destructive",
        });
        return false;
      }
    }

    console.log('Form validation passed');
    return true;
  };

  return {
    formData,
    setFormData,
    provinces: [
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
    ],
    regencies,
    loadingRegencies,
    sumberLeadsOptions,
    kodeAdsOptions,
    layananAssistOptions,
    alasanBukanLeadsOptions,
    usersOptions,
    handleInputChange: (field: string, value: string) => {
      console.log(`Updating field ${field} with value:`, value);
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        
        // Reset dependent fields
        if (field === 'sumber_leads_id') {
          const sumberLeads = sumberLeadsOptions.find(s => s.id === value);
          if (!sumberLeads?.nama?.toLowerCase().includes('ads')) {
            newData.kode_ads_id = '';
            newData.id_ads = '';
          }
        }
        
        if (field === 'status_leads' && value !== 'Bukan Leads') {
          newData.alasan_bukan_leads_id = '';
          newData.keterangan_bukan_leads = '';
        }

        if (field === 'provinsi_id') {
          newData.kota = '';
          // Set province name
          const province = [
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
          ].find(p => p.id === value);
          if (province) {
            newData.provinsi_nama = province.name;
          }
        }
        
        console.log('Updated form data:', newData);
        return newData;
      });

      // Fetch regencies when province changes
      if (field === 'provinsi_id' && value) {
        fetchRegencies(value);
      } else if (field === 'provinsi_id' && !value) {
        setRegencies([]);
      }
    },
    validateForm
  };
}
