
import { useSupabaseProspek } from './useSupabaseProspek';
import { useMasterData } from './useMasterData';
import { useLocalStorageData } from './useLocalStorageData';

// Re-export types for backward compatibility
export type { SupabaseProspek } from './useSupabaseProspek';
export type { DataMasterItem, UserProfile } from './useMasterData';

export function useSupabaseData() {
  const prospekHook = useSupabaseProspek();
  const masterDataHook = useMasterData();
  const localStorageHook = useLocalStorageData();

  return {
    // Prospek data and operations
    prospekData: prospekHook.prospekData,
    loading: prospekHook.loading,
    createProspek: prospekHook.createProspek,
    updateProspek: prospekHook.updateProspek,
    deleteProspek: prospekHook.deleteProspek,
    
    // Master data
    layananData: masterDataHook.layananData,
    kodeAdsData: masterDataHook.kodeAdsData,
    sumberLeadsData: masterDataHook.sumberLeadsData,
    alasanBukanLeadsData: masterDataHook.alasanBukanLeadsData,
    usersData: masterDataHook.usersData,
    
    // Local storage data
    tipeFaskesData: localStorageHook.tipeFaskesData,
    statusLeadsData: localStorageHook.statusLeadsData,
    createTipeFaskes: localStorageHook.createTipeFaskes,
    updateTipeFaskes: localStorageHook.updateTipeFaskes,
    deleteTipeFaskes: localStorageHook.deleteTipeFaskes,
    createStatusLeads: localStorageHook.createStatusLeads,
    updateStatusLeads: localStorageHook.updateStatusLeads,
    deleteStatusLeads: localStorageHook.deleteStatusLeads,
    
    // Refetch functions
    refetchData: () => {
      prospekHook.refetchData();
      masterDataHook.refetchData();
      localStorageHook.refetchData();
    }
  };
}
