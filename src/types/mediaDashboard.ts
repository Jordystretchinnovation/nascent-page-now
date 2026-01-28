// Types for Meta Ads Performance Dashboard

export interface MetaPerformance {
  id: string;
  date: string;
  campaign_name: string;
  adset_name: string;
  ad_name: string;
  spent: number;
  frequency: number | null;
  created_at: string;
}

export interface Lead {
  id: string;
  created_at: string;
  language: string;
  type_bedrijf: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  kwaliteit: string | null;
}

export interface CampaignMetrics {
  campaign_name: string;
  adset_name?: string;
  ad_name?: string;
  market: 'NL' | 'FR' | 'Unknown';
  audience_type: 'Lookalike' | 'Retargeting' | 'Unknown';
  spent: number;
  frequency: number | null;
  leads: number;
  gekwalificeerd: number;
  mqls: number;
  sqls: number;
  cpl: number;
  cp_gekwalificeerd: number;
  cpmql: number;
  cpsql: number;
}

export interface WeeklyMetrics {
  week: number;
  weekStart: string;
  weekEnd: string;
  planned_spend: number;
  actual_spend: number;
  spend_variance: number;
  planned_sqls: number;
  actual_sqls: number;
  cumulative_sqls: number;
  leads: number;
  on_track: boolean;
}

export interface KPISummary {
  budget_spent: number;
  budget_target: number;
  budget_progress: number;
  sqls: number;
  sql_target: number;
  sql_progress: number;
  cpsql: number;
  cpsql_target: number;
  total_leads: number;
  gekwalificeerd: number;
  gekwalificeerd_rate: number;
  mqls: number;
  mql_rate: number;
  mql_to_sql_rate: number;
  mql_to_sql_target: number;
}

export interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  dropoff: number;
}

export interface FrequencyAlert {
  id: string;
  adset_name: string;
  ad_name: string;
  campaign_name: string;
  current_frequency: number;
  days_running: number;
  severity: 'warning' | 'critical';
  recommendation: string;
}

export interface MarketPerformance {
  market: 'NL' | 'FR';
  leads: number;
  sqls: number;
  spent: number;
  cpl: number;
  cpsql: number;
}

export interface AudiencePerformance {
  audience_type: 'Lookalike' | 'Retargeting';
  leads: number;
  sqls: number;
  spent: number;
  cpl: number;
  cpsql: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardFilters {
  dateRange: DateRange;
  market: 'NL' | 'FR' | 'All';
  campaign: string | 'All';
}

// Q1 2025 Targets
export const Q1_TARGETS = {
  budget: 15840,
  sqls: 132,
  max_cpsql: 120,
  mql_to_sql_rate: 0.16,
  weeks: 13,
  weekly_budget: 1218,
  weekly_sqls: 10.2,
} as const;

// Helper functions
export function extractMarket(campaignName: string): 'NL' | 'FR' | 'Unknown' {
  if (campaignName.includes('_nl_') || campaignName.toLowerCase().includes('_nl')) {
    return 'NL';
  }
  if (campaignName.includes('_fr_') || campaignName.toLowerCase().includes('_fr')) {
    return 'FR';
  }
  return 'Unknown';
}

export function extractAudienceType(adsetName: string): 'Lookalike' | 'Retargeting' | 'Unknown' {
  const lower = adsetName.toLowerCase();
  if (lower.includes('lookalike')) {
    return 'Lookalike';
  }
  if (lower.includes('retargeting')) {
    return 'Retargeting';
  }
  return 'Unknown';
}

export function isGekwalificeerd(kwaliteit: string | null): boolean {
  return kwaliteit !== null && kwaliteit !== 'Slecht';
}

export function isMQL(kwaliteit: string | null): boolean {
  return kwaliteit === 'MQL' || kwaliteit === 'Redelijk';
}

export function isSQL(kwaliteit: string | null): boolean {
  return kwaliteit === 'Goed' || kwaliteit === 'Goed - klant' || kwaliteit === 'Goed - Klant';
}

export function getCPSQLColor(cpsql: number): string {
  if (cpsql < 100) return 'text-green-600';
  if (cpsql <= 120) return 'text-yellow-600';
  return 'text-red-600';
}

export function getCPSQLBgColor(cpsql: number): string {
  if (cpsql < 100) return 'bg-green-100';
  if (cpsql <= 120) return 'bg-yellow-100';
  return 'bg-red-100';
}
