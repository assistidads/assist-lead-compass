
export interface ChartDataItem {
  name: string;
  value: number;
  prospek: number;
  leads: number;
  ctr: number;
  isOrganik?: boolean;
  organikBreakdown?: Array<{
    name: string;
    prospek: number;
    leads: number;
    ctr: number;
  }>;
  idAdsBreakdown?: Array<{
    idAds: string;
    prospek: number;
    leads: number;
    ctr: number;
  }>;
}

export interface PerformaCSItem {
  name: string;
  prospek: number;
  leads: number;
  bukanLeads: number;
  ctr: number;
}

export interface HeatmapDataItem {
  day: string;
  hour: number;
  value: number;
  leads: number;
}

export interface DayActivityItem {
  name: string;
  prospek: number;
  leads: number;
  ctr: number;
}
