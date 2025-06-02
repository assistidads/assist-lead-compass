
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SupabaseProspek {
  id: string;
  tanggal_prospek: string;
  nama_prospek: string;
  no_whatsapp: string;
  status_leads: string;
  keterangan_bukan_leads?: string;
  nama_faskes: string;
  tipe_faskes: string;
  provinsi_nama: string;
  kota: string;
  id_ads?: string;
  created_at: string;
  sumber_leads?: { nama: string } | null;
  kode_ads?: { kode: string } | null;
  layanan_assist?: { nama: string } | null;
  alasan_bukan_leads?: { alasan: string } | null;
  pic_leads?: { full_name: string } | null;
  created_by_profile?: { full_name: string } | null;
}

export interface DataMasterItem {
  id: string;
  nama?: string;
  kode?: string;
  alasan?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Hardcoded Tipe Faskes data with localStorage persistence
const getTipeFaskesFromStorage = (): DataMasterItem[] => {
  const stored = localStorage.getItem('tipe_faskes_data');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default data
  const defaultData = [
    { id: '1', nama: 'Rumah Sakit', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', nama: 'Klinik', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', nama: 'Puskesmas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', nama: 'Laboratorium', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '5', nama: 'Apotek', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  localStorage.setItem('tipe_faskes_data', JSON.stringify(defaultData));
  return defaultData;
};

const saveTipeFaskesToStorage = (data: DataMasterItem[]) => {
  localStorage.setItem('tipe_faskes_data', JSON.stringify(data));
};

// Hardcoded Status Leads data with localStorage persistence
const getStatusLeadsFromStorage = (): DataMasterItem[] => {
  const stored = localStorage.getItem('status_leads_data');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default data
  const defaultData = [
    { id: '1', nama: 'Prospek', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', nama: 'Dihubungi', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', nama: 'Leads', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', nama: 'Bukan Leads', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '5', nama: 'On Going', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  localStorage.setItem('status_leads_data', JSON.stringify(defaultData));
  return defaultData;
};

const saveStatusLeadsToStorage = (data: DataMasterItem[]) => {
  localStorage.setItem('status_leads_data', JSON.stringify(data));
};

export function useSupabaseData() {
  const { user, profile } = useAuth();
  const [prospekData, setProspekData] = useState<SupabaseProspek[]>([]);
  const [layananData, setLayananData] = useState<DataMasterItem[]>([]);
  const [kodeAdsData, setKodeAdsData] = useState<DataMasterItem[]>([]);
  const [sumberLeadsData, setSumberLeadsData] = useState<DataMasterItem[]>([]);
  const [tipeFaskesData, setTipeFaskesData] = useState<DataMasterItem[]>([]);
  const [statusLeadsData, setStatusLeadsData] = useState<DataMasterItem[]>([]);
  const [alasanBukanLeadsData, setAlasanBukanLeadsData] = useState<DataMasterItem[]>([]);
  const [usersData, setUsersData] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch prospek data dengan filter berdasarkan role
  const fetchProspekData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('prospek')
        .select(`
          *,
          sumber_leads:sumber_leads_id(nama),
          kode_ads:kode_ads_id(kode),
          layanan_assist:layanan_assist_id(nama),
          alasan_bukan_leads:alasan_bukan_leads_id(alasan),
          pic_leads:pic_leads_id(full_name),
          created_by_profile:created_by(full_name)
        `)
        .order('created_at', { ascending: false });

      // Filter berdasarkan role - CS Support hanya bisa lihat data yang mereka buat
      if (profile?.role === 'cs_support') {
        query = query.eq('created_by', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('Raw prospek data from query:', data);
      
      // Type assertion to handle the Supabase response structure
      const processedData = (data as any[])?.map(item => {
        console.log('Processing item:', item);
        console.log('created_by_profile data:', item.created_by_profile);
        return {
          ...item,
          sumber_leads: item.sumber_leads || null,
          kode_ads: item.kode_ads || null,
          layanan_assist: item.layanan_assist || null,
          alasan_bukan_leads: item.alasan_bukan_leads || null,
          pic_leads: item.pic_leads || null,
          created_by_profile: item.created_by_profile || null
        };
      }) || [];
      
      console.log('Processed prospek data:', processedData);
      setProspekData(processedData);
    } catch (error) {
      console.error('Error fetching prospek data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data prospek",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users data with proper admin access
  const fetchUsersData = async () => {
    if (!user || !profile) return;

    console.log('Fetching users data. Current user profile:', profile);
    
    try {
      // Admin dapat melihat semua user profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      console.log('Users data query result:', { data, error });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Setting users data:', data);
      setUsersData(data || []);
    } catch (error) {
      console.error('Error fetching users data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data users",
        variant: "destructive",
      });
    }
  };

  // Fetch master data (hanya admin yang bisa akses)
  const fetchMasterData = async () => {
    if (!user || profile?.role !== 'admin') return;

    try {
      // Fetch layanan assist
      const { data: layananData, error: layananError } = await supabase
        .from('layanan_assist')
        .select('*')
        .order('nama');

      if (layananError) throw layananError;
      setLayananData(layananData || []);

      // Fetch kode ads
      const { data: kodeAdsData, error: kodeAdsError } = await supabase
        .from('kode_ads')
        .select('*')
        .order('kode');

      if (kodeAdsError) throw kodeAdsError;
      setKodeAdsData(kodeAdsData || []);

      // Fetch sumber leads
      const { data: sumberLeadsData, error: sumberLeadsError } = await supabase
        .from('sumber_leads')
        .select('*')
        .order('nama');

      if (sumberLeadsError) throw sumberLeadsError;
      setSumberLeadsData(sumberLeadsData || []);

      // Load tipe faskes from localStorage
      setTipeFaskesData(getTipeFaskesFromStorage());

      // Fetch alasan bukan leads
      const { data: alasanBukanLeadsData, error: alasanBukanLeadsError } = await supabase
        .from('alasan_bukan_leads')
        .select('*')
        .order('alasan');

      if (alasanBukanLeadsError) throw alasanBukanLeadsError;
      setAlasanBukanLeadsData(alasanBukanLeadsData || []);

    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data master",
        variant: "destructive",
      });
    }
  };

  // Fetch data master untuk dropdown (semua user perlu akses untuk form)
  const fetchMasterDataForDropdowns = async () => {
    if (!user) return;

    try {
      const [layananRes, kodeAdsRes, sumberLeadsRes, alasanRes, usersRes] = await Promise.all([
        supabase.from('layanan_assist').select('*').order('nama'),
        supabase.from('kode_ads').select('*').order('kode'),
        supabase.from('sumber_leads').select('*').order('nama'),
        supabase.from('alasan_bukan_leads').select('*').order('alasan'),
        supabase.from('profiles').select('*').order('full_name')
      ]);

      if (layananRes.data) setLayananData(layananRes.data);
      if (kodeAdsRes.data) setKodeAdsData(kodeAdsRes.data);
      if (sumberLeadsRes.data) setSumberLeadsData(sumberLeadsRes.data);
      if (alasanRes.data) setAlasanBukanLeadsData(alasanRes.data);
      if (usersRes.data) {
        console.log('Setting users data from dropdown fetch:', usersRes.data);
        setUsersData(usersRes.data);
      }

      // Load tipe faskes from localStorage
      setTipeFaskesData(getTipeFaskesFromStorage());

    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Create new prospek
  const createProspek = async (prospekData: any) => {
    if (!user) return null;

    try {
      // Pastikan semua foreign key yang kosong diset ke null
      const cleanedData = {
        ...prospekData,
        created_by: user.id,
        sumber_leads_id: prospekData.sumber_leads_id || null,
        kode_ads_id: prospekData.kode_ads_id || null,
        layanan_assist_id: prospekData.layanan_assist_id || null,
        alasan_bukan_leads_id: prospekData.alasan_bukan_leads_id || null,
        pic_leads_id: prospekData.pic_leads_id || null,
      };

      const { data, error } = await supabase
        .from('prospek')
        .insert([cleanedData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data prospek berhasil disimpan",
      });
      
      fetchProspekData(); // Refresh data
      return data;
    } catch (error) {
      console.error('Error creating prospek:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data prospek",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update prospek
  const updateProspek = async (id: string, prospekData: any) => {
    if (!user) return null;

    try {
      // Pastikan semua foreign key yang kosong diset ke null
      const cleanedData = {
        ...prospekData,
        sumber_leads_id: prospekData.sumber_leads_id || null,
        kode_ads_id: prospekData.kode_ads_id || null,
        layanan_assist_id: prospekData.layanan_assist_id || null,
        alasan_bukan_leads_id: prospekData.alasan_bukan_leads_id || null,
        pic_leads_id: prospekData.pic_leads_id || null,
      };

      const { data, error } = await supabase
        .from('prospek')
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data prospek berhasil diupdate",
      });
      
      fetchProspekData(); // Refresh data
      return data;
    } catch (error) {
      console.error('Error updating prospek:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate data prospek",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete prospek
  const deleteProspek = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('prospek')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data prospek berhasil dihapus",
        variant: "destructive",
      });
      
      fetchProspekData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error deleting prospek:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data prospek",
        variant: "destructive",
      });
      return false;
    }
  };

  // CRUD operations for Tipe Faskes (localStorage based)
  const createTipeFaskes = (data: { nama: string }) => {
    const currentData = getTipeFaskesFromStorage();
    const newItem: DataMasterItem = {
      id: Date.now().toString(),
      nama: data.nama,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedData = [...currentData, newItem];
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return newItem;
  };

  const updateTipeFaskes = (id: string, data: { nama: string }) => {
    const currentData = getTipeFaskesFromStorage();
    const updatedData = currentData.map(item => 
      item.id === id 
        ? { ...item, nama: data.nama, updated_at: new Date().toISOString() }
        : item
    );
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return updatedData.find(item => item.id === id);
  };

  const deleteTipeFaskes = (id: string) => {
    const currentData = getTipeFaskesFromStorage();
    const updatedData = currentData.filter(item => item.id !== id);
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return true;
  };

  // CRUD operations for Status Leads (localStorage based)
  const createStatusLeads = (data: { nama: string }) => {
    const currentData = getStatusLeadsFromStorage();
    const newItem: DataMasterItem = {
      id: Date.now().toString(),
      nama: data.nama,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedData = [...currentData, newItem];
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return newItem;
  };

  const updateStatusLeads = (id: string, data: { nama: string }) => {
    const currentData = getStatusLeadsFromStorage();
    const updatedData = currentData.map(item => 
      item.id === id 
        ? { ...item, nama: data.nama, updated_at: new Date().toISOString() }
        : item
    );
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return updatedData.find(item => item.id === id);
  };

  const deleteStatusLeads = (id: string) => {
    const currentData = getStatusLeadsFromStorage();
    const updatedData = currentData.filter(item => item.id !== id);
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return true;
  };

  useEffect(() => {
    if (user && profile) {
      console.log('useEffect triggered. User:', user.id, 'Profile role:', profile.role);
      fetchProspekData();
      fetchMasterDataForDropdowns();
      
      // Load status leads from localStorage
      setStatusLeadsData(getStatusLeadsFromStorage());
      
      // Force fetch users data for admin
      if (profile.role === 'admin') {
        fetchMasterData();
        fetchUsersData();
      }
    }
  }, [user, profile]);

  return {
    prospekData,
    layananData,
    kodeAdsData,
    sumberLeadsData,
    tipeFaskesData,
    statusLeadsData,
    alasanBukanLeadsData,
    usersData,
    loading,
    createProspek,
    updateProspek,
    deleteProspek,
    createTipeFaskes,
    updateTipeFaskes,
    deleteTipeFaskes,
    createStatusLeads,
    updateStatusLeads,
    deleteStatusLeads,
    refetchData: () => {
      console.log('refetchData called. Profile role:', profile?.role);
      fetchProspekData();
      fetchMasterDataForDropdowns();
      setStatusLeadsData(getStatusLeadsFromStorage());
      if (profile?.role === 'admin') {
        fetchMasterData();
        fetchUsersData();
      }
    }
  };
}
