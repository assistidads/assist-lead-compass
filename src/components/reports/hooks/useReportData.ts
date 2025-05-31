
import { useMemo } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { ChartDataItem, PerformaCSItem, DayActivityItem } from '../types';

interface ProspekDataItem {
  tanggal_prospek: string;
  sumber_leads?: { nama: string };
  kode_ads?: { kode: string };
  layanan_assist?: { nama: string };
  kota: string;
  status_leads: string;
  id_ads?: string;
  pic_leads?: { full_name: string };
  created_by_profile?: { full_name: string };
}

export function useReportData(filteredData?: ProspekDataItem[]) {
  const { prospekData, sumberLeadsData, kodeAdsData, layananData } = useSupabaseData();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'cs_support';
  
  // For CS Support, filter data to only their own data
  // For Admin, show all data
  const dataToUse = useMemo(() => {
    const baseData = filteredData || prospekData;
    
    console.log('Base data for reports:', baseData);
    console.log('User role:', userRole);
    console.log('User full name:', user?.user_metadata?.full_name);
    
    if (userRole === 'admin') {
      return baseData; // Admin sees all data
    } else {
      // CS Support only sees their own data
      return baseData.filter(item => item.pic_leads?.full_name === user?.user_metadata?.full_name);
    }
  }, [filteredData, prospekData, userRole, user]);

  // Data untuk chart sumber leads dengan Organik
  const sumberLeadsChartData = useMemo((): ChartDataItem[] => {
    // Calculate Organik data (sources not containing "Ads")
    const organikSources = sumberLeadsData.filter(sumber => 
      !sumber.nama?.toLowerCase().includes('ads')
    );
    
    const organikProspekCount = organikSources.reduce((total, sumber) => {
      return total + dataToUse.filter(item => item.sumber_leads?.nama === sumber.nama).length;
    }, 0);
    
    const organikLeadsCount = organikSources.reduce((total, sumber) => {
      return total + dataToUse.filter(item => 
        item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
      ).length;
    }, 0);
    
    const organikCtr = organikProspekCount > 0 ? (organikLeadsCount / organikProspekCount) * 100 : 0;

    // Only show sumber leads that contain "Ads"
    const adsData: ChartDataItem[] = sumberLeadsData
      .filter(sumber => sumber.nama?.toLowerCase().includes('ads'))
      .map(sumber => {
        const prospekCount = dataToUse.filter(item => item.sumber_leads?.nama === sumber.nama).length;
        const leadsCount = dataToUse.filter(item => 
          item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
        ).length;
        const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;
        
        return {
          name: sumber.nama || '',
          value: prospekCount,
          prospek: prospekCount,
          leads: leadsCount,
          ctr: parseFloat(ctr.toFixed(1))
        };
      }).filter(item => item.value > 0);

    // Add Organik data at the beginning if it has data
    const result: ChartDataItem[] = [];
    if (organikProspekCount > 0) {
      result.push({
        name: 'Organik',
        value: organikProspekCount,
        prospek: organikProspekCount,
        leads: organikLeadsCount,
        ctr: parseFloat(organikCtr.toFixed(1)),
        isOrganik: true,
        organikBreakdown: organikSources.map(sumber => {
          const prospekCount = dataToUse.filter(item => item.sumber_leads?.nama === sumber.nama).length;
          const leadsCount = dataToUse.filter(item => 
            item.sumber_leads?.nama === sumber.nama && item.status_leads === 'Leads'
          ).length;
          const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;
          
          return {
            name: sumber.nama || '',
            prospek: prospekCount,
            leads: leadsCount,
            ctr: parseFloat(ctr.toFixed(1))
          };
        }).filter(item => item.prospek > 0)
      });
    }
    
    return [...result, ...adsData];
  }, [dataToUse, sumberLeadsData]);

  // Data untuk chart kode ads dengan breakdown ID Ads
  const kodeAdsChartData = useMemo((): ChartDataItem[] => {
    return kodeAdsData.map(kode => {
      const prospekItems = dataToUse.filter(item => item.kode_ads?.kode === kode.kode);
      const prospekCount = prospekItems.length;
      const leadsCount = prospekItems.filter(item => item.status_leads === 'Leads').length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;

      // Group by ID Ads for breakdown
      const idAdsBreakdown = prospekItems.reduce((acc: Record<string, { prospek: number; leads: number }>, item) => {
        const idAds = item.id_ads || 'Tidak Ada ID';
        if (!acc[idAds]) {
          acc[idAds] = { prospek: 0, leads: 0 };
        }
        acc[idAds].prospek++;
        if (item.status_leads === 'Leads') {
          acc[idAds].leads++;
        }
        return acc;
      }, {});

      const idAdsBreakdownArray = Object.entries(idAdsBreakdown).map(([idAds, data]) => ({
        idAds,
        prospek: data.prospek,
        leads: data.leads,
        ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
      }));

      // Only show breakdown if there are multiple ID Ads
      const shouldShowBreakdown = Object.keys(idAdsBreakdown).length > 1;

      return {
        name: kode.kode || '',
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1)),
        idAdsBreakdown: shouldShowBreakdown ? idAdsBreakdownArray : []
      };
    }).filter(item => item.value > 0);
  }, [dataToUse, kodeAdsData]);

  // Data untuk chart layanan
  const layananChartData = useMemo((): ChartDataItem[] => {
    return layananData.map(layanan => {
      const prospekItems = dataToUse.filter(item => item.layanan_assist?.nama === layanan.nama);
      const prospekCount = prospekItems.length;
      const leadsCount = prospekItems.filter(item => item.status_leads === 'Leads').length;
      const ctr = prospekCount > 0 ? (leadsCount / prospekCount) * 100 : 0;

      return {
        name: layanan.nama || '',
        value: prospekCount,
        prospek: prospekCount,
        leads: leadsCount,
        ctr: parseFloat(ctr.toFixed(1))
      };
    }).filter(item => item.value > 0);
  }, [dataToUse, layananData]);

  // Data untuk chart kota/kabupaten
  const kotaKabupatenChartData = useMemo((): ChartDataItem[] => {
    const kotaCounts = dataToUse.reduce((acc: Record<string, { prospek: number; leads: number }>, item) => {
      const kota = item.kota;
      if (!acc[kota]) {
        acc[kota] = { prospek: 0, leads: 0 };
      }
      acc[kota].prospek++;
      if (item.status_leads === 'Leads') {
        acc[kota].leads++;
      }
      return acc;
    }, {});

    return Object.entries(kotaCounts).map(([kota, data]) => ({
      name: kota,
      value: data.prospek,
      prospek: data.prospek,
      leads: data.leads,
      ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
    })).filter(item => item.value > 0);
  }, [dataToUse]);

  // Data untuk performa CS - Admin sees all users, CS sees only themselves
  const performaCSData = useMemo((): PerformaCSItem[] => {
    const baseDataForCS = userRole === 'admin' ? (filteredData || prospekData) : dataToUse;
    
    console.log('Base data for CS performance:', baseDataForCS);
    
    const csPerformance = baseDataForCS.reduce((acc: Record<string, { prospek: number; leads: number; bukanLeads: number }>, item) => {
      // Prioritize pic_leads, fallback to created_by_profile
      const csName = item.pic_leads?.full_name || item.created_by_profile?.full_name || 'Unknown';
      
      console.log('Processing CS item:', {
        pic_leads: item.pic_leads,
        created_by_profile: item.created_by_profile,
        csName
      });
      
      if (!acc[csName]) {
        acc[csName] = { prospek: 0, leads: 0, bukanLeads: 0 };
      }
      acc[csName].prospek++;
      if (item.status_leads === 'Leads') {
        acc[csName].leads++;
      } else if (item.status_leads === 'Bukan Leads') {
        acc[csName].bukanLeads++;
      }
      return acc;
    }, {});

    console.log('CS Performance data:', csPerformance);

    return Object.entries(csPerformance).map(([name, data]) => ({
      name,
      prospek: data.prospek,
      leads: data.leads,
      bukanLeads: data.bukanLeads,
      ctr: data.prospek > 0 ? parseFloat(((data.leads / data.prospek) * 100).toFixed(1)) : 0
    }));
  }, [dataToUse, filteredData, prospekData, userRole]);

  // Data untuk heatmap waktu/hari aktivitas prospek dan leads - Admin only, all data
  const heatmapData = useMemo(() => {
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const baseDataForHeatmap = filteredData || prospekData; // Always use all data for heatmap
    
    // Analisis berdasarkan hari dalam seminggu dan jam
    const heatmapMatrix: { day: string; hour: number; value: number; leads: number }[] = [];
    
    daysOfWeek.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        const prospekCount = baseDataForHeatmap.filter(item => {
          const date = new Date(item.tanggal_prospek);
          return daysOfWeek[date.getDay()] === day && date.getHours() === hour;
        }).length;

        const leadsCount = baseDataForHeatmap.filter(item => {
          const date = new Date(item.tanggal_prospek);
          return daysOfWeek[date.getDay()] === day && date.getHours() === hour && item.status_leads === 'Leads';
        }).length;

        heatmapMatrix.push({
          day,
          hour,
          value: prospekCount,
          leads: leadsCount
        });
      }
    });

    // Analisis berdasarkan hari dalam seminggu
    const dayActivity: DayActivityItem[] = daysOfWeek.map(day => {
      const dayProspekCount = baseDataForHeatmap.filter(item => {
        const date = new Date(item.tanggal_prospek);
        return daysOfWeek[date.getDay()] === day;
      }).length;

      const dayLeadsCount = baseDataForHeatmap.filter(item => {
        const date = new Date(item.tanggal_prospek);
        return daysOfWeek[date.getDay()] === day && item.status_leads === 'Leads';
      }).length;

      return {
        name: day,
        prospek: dayProspekCount,
        leads: dayLeadsCount,
        ctr: dayProspekCount > 0 ? parseFloat(((dayLeadsCount / dayProspekCount) * 100).toFixed(1)) : 0
      };
    });

    return { dayActivity, heatmapMatrix };
  }, [filteredData, prospekData]);

  return {
    sumberLeadsChartData,
    kodeAdsChartData,
    layananChartData,
    kotaKabupatenChartData,
    performaCSData,
    heatmapData
  };
}
