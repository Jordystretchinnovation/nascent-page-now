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
  audience_type: 'LAL Scraping' | 'Retargeting' | 'LAL Leads' | 'Unknown';
  campaign_type: 'Lead Gen' | 'Awareness' | 'Other';
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
  clicks?: number;
  cpc?: number;
  target_cpl?: number;
  badge?: 'BEWEZEN' | 'TEST' | 'INVEST' | null;
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
  audience_type: 'LAL Scraping' | 'Retargeting' | 'LAL Leads' | 'Unknown';
  leads: number;
  sqls: number;
  spent: number;
  cpl: number;
  cpsql: number;
  target_cpl?: number;
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

// Q1 2026 Targets - Campaign starts Jan 30, 2026
export const Q1_TARGETS = {
  budget: 15840,
  sqls: 132,
  max_cpsql: 120,
  mql_to_sql_rate: 0.16,
  weeks: 13,
  // Campaign start date: Thursday Jan 30, 2026
  campaign_start: new Date(2026, 0, 30), // Month is 0-indexed, so 0 = January
} as const;

// Phased Budget Distribution
export const PHASE_CONFIG = {
  fase1: { name: 'FASE 1 - TEST', weeks: [1, 2, 3, 4], budget_pct: 0.20, weekly_budget: 792 },
  fase2: { name: 'FASE 2 - LEARN', weeks: [5, 6, 7, 8], budget_pct: 0.30, weekly_budget: 1188 },
  fase3: { name: 'FASE 3 - SCALE', weeks: [9, 10, 11, 12, 13], budget_pct: 0.50, weekly_budget: 1584 },
} as const;

export function getCurrentPhase(week: number): { phase: string; name: string; weekly_budget: number } {
  if (week <= 4) return { phase: 'fase1', name: PHASE_CONFIG.fase1.name, weekly_budget: PHASE_CONFIG.fase1.weekly_budget };
  if (week <= 8) return { phase: 'fase2', name: PHASE_CONFIG.fase2.name, weekly_budget: PHASE_CONFIG.fase2.weekly_budget };
  return { phase: 'fase3', name: PHASE_CONFIG.fase3.name, weekly_budget: PHASE_CONFIG.fase3.weekly_budget };
}

export function getWeeklyBudgetForWeek(week: number): number {
  return getCurrentPhase(week).weekly_budget;
}

// Budget per Audience (Q1)
export const AUDIENCE_TARGETS = {
  'lookalike_scraping_nl': { budget: 4000, target_cpl: 8.00, expected_leads: 500 },
  'retargeting_engagement_nl': { budget: 2050, target_cpl: 14.50, expected_leads: 141 },
  'lookalike_leads_nl': { budget: 1500, target_cpl: 9.00, expected_leads: 166 },
  'lookalike_leads_customers_nl': { budget: 2038, target_cpc: 0.18, expected_clicks: 11322, isAwareness: true },
  'lookalike_scraping_fr': { budget: 1306, target_cpl: 32.00, expected_leads: 40 },
  'retargeting_engagement_fr': { budget: 1070, target_cpl: 46.00, expected_leads: 23 },
  'lookalike_leads_fr': { budget: 2376, target_cpl: 22.00, expected_leads: 108 },
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

export function extractAudienceType(adsetName: string): 'LAL Scraping' | 'Retargeting' | 'LAL Leads' | 'Unknown' {
  const lower = adsetName.toLowerCase();
  if (lower.includes('lookalike_scraping')) return 'LAL Scraping';
  if (lower.includes('retargeting_engagement')) return 'Retargeting';
  // lookalike_leads_customers is Awareness campaign (tracks clicks, not leads) - excluded from lead gen audiences
  if (lower.includes('lookalike_leads_customers')) return 'Unknown';
  if (lower.includes('lookalike_leads')) return 'LAL Leads';
  return 'Unknown';
}

export function getCampaignType(campaignName: string): 'Lead Gen' | 'Awareness' | 'Other' {
  if (campaignName.includes('mofu_leadgen')) return 'Lead Gen';
  if (campaignName.includes('tofu_traffic_awareness')) return 'Awareness';
  return 'Other';
}

export function isAwarenessCampaign(campaignName: string): boolean {
  return campaignName.includes('tofu_traffic_awareness');
}

export function getAudienceTargetCPL(adsetName: string): number | null {
  const lower = adsetName.toLowerCase();
  for (const [key, value] of Object.entries(AUDIENCE_TARGETS)) {
    if (lower.includes(key)) {
      return 'target_cpl' in value ? value.target_cpl : null;
    }
  }
  return null;
}

export function getAdsetTypeBadge(adsetName: string): 'BEWEZEN' | 'TEST' | 'INVEST' | null {
  const lower = adsetName.toLowerCase();
  // Awareness campaign
  if (lower.includes('lookalike_leads_customers')) return 'INVEST';
  // Test audiences
  if (lower.includes('lookalike_leads_nl') || lower.includes('lookalike_leads_fr')) return 'TEST';
  // Proven audiences
  if (lower.includes('lookalike_scraping') || lower.includes('retargeting_engagement')) return 'BEWEZEN';
  return null;
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
