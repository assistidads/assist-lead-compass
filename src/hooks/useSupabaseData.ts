
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
  sumber_leads?: { nama: string };
  kode_ads?: { kode: string };
  layanan_assist?: { nama: string };
  alasan_bukan_leads?: { alasan: string };
  pic_leads?: { full_name: string };
  created_by_profile?: { full_name: string };
}

export interface DataMasterItem {
  id: string;
  nama?: string;
  kode?: string;
  alasan?: string;
  created_at: string;
  updated_at: string;
}

export function useSupabaseData() {
  const { user } = useAuth();
  const [prospekData, setProspekData] = useState<SupabaseProspek[]>([]);
  const [layananData, setLayananData] = useState<DataMasterItem[]>([]);
  const [kodeAdsData, setKodeAdsData] = useState<DataMasterItem[]>([]);
  const [sumberLeadsData, setSumberLeadsData] = useState<DataMasterItem[]>([]);
  const [alasanBukanLeadsData, setAlasanBukanLeadsData] = useState<DataMasterItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all prospek data
  const fetchProspekData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      setProspekData(data || []);
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

  // Fetch master data
  const fetchMasterData = async () => {
    if (!user) return;

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

  // Create new prospek
  const createProspek = async (prospekData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('prospek')
        .insert([{
          ...prospekData,
          created_by: user.id
        }])
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
      const { data, error } = await supabase
        .from('prospek')
        .update(prospekData)
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

  useEffect(() => {
    if (user) {
      fetchProspekData();
      fetchMasterData();
    }
  }, [user]);

  return {
    prospekData,
    layananData,
    kodeAdsData,
    sumberLeadsData,
    alasanBukanLeadsData,
    loading,
    createProspek,
    updateProspek,
    deleteProspek,
    refetchData: () => {
      fetchProspekData();
      fetchMasterData();
    }
  };
}
