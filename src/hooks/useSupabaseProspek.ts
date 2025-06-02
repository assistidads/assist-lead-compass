
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

export function useSupabaseProspek() {
  const { user, profile } = useAuth();
  const [prospekData, setProspekData] = useState<SupabaseProspek[]>([]);
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

  useEffect(() => {
    if (user && profile) {
      console.log('useEffect triggered. User:', user.id, 'Profile role:', profile.role);
      fetchProspekData();
    }
  }, [user, profile]);

  return {
    prospekData,
    loading,
    createProspek,
    updateProspek,
    deleteProspek,
    refetchData: fetchProspekData
  };
}
