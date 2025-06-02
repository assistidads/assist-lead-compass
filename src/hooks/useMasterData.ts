
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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

export function useMasterData() {
  const { user, profile } = useAuth();
  const [layananData, setLayananData] = useState<DataMasterItem[]>([]);
  const [kodeAdsData, setKodeAdsData] = useState<DataMasterItem[]>([]);
  const [sumberLeadsData, setSumberLeadsData] = useState<DataMasterItem[]>([]);
  const [alasanBukanLeadsData, setAlasanBukanLeadsData] = useState<DataMasterItem[]>([]);
  const [usersData, setUsersData] = useState<UserProfile[]>([]);

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

    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  useEffect(() => {
    if (user && profile) {
      fetchMasterDataForDropdowns();
      
      // Force fetch users data for admin
      if (profile.role === 'admin') {
        fetchMasterData();
        fetchUsersData();
      }
    }
  }, [user, profile]);

  return {
    layananData,
    kodeAdsData,
    sumberLeadsData,
    alasanBukanLeadsData,
    usersData,
    refetchData: () => {
      console.log('refetchData called. Profile role:', profile?.role);
      fetchMasterDataForDropdowns();
      if (profile?.role === 'admin') {
        fetchMasterData();
        fetchUsersData();
      }
    }
  };
}
