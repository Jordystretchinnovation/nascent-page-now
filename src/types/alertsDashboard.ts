// Types for Decision Triggers & Alerts Dashboard

export interface DecisionTrigger {
  id: string;
  trigger_name: string;
  adset_pattern: string;
  market: string | null;
  metric: string;
  operator: string;
  threshold_value: number | null;
  severity: 'info' | 'warning' | 'critical';
  action_success: string | null;
  action_fail: string | null;
  shift_to_adset: string | null;
  evaluation_week: number | null;
  applies_to_campaign_type: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TriggeredAlert {
  id: string;
  trigger_id: string | null;
  triggered_at: string;
  campaign_name: string;
  adset_name: string;
  metric_name: string;
  current_value: number | null;
  threshold_value: number | null;
  severity: 'info' | 'warning' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string | null;
  trigger?: DecisionTrigger;
}

export interface AdsetMetrics {
  adset_name: string;
  campaign_name: string;
  market: 'NL' | 'FR';
  audience_type: string;
  spent: number;
  leads: number;
  sqls: number;
  cpl: number;
  conversion_rate: number;
  frequency: number;
  clicks?: number;
  cpc?: number;
  days_without_lead?: number;
}

export interface RetargetingPoolStatus {
  nl_spent: number;
  nl_frequency: number;
  fr_spent: number;
  fr_frequency: number;
  combined_spent: number;
  combined_frequency: number;
  max_budget: number;
  pool_size: number;
  percentage_reached: number;
  weeks_until_exhausted: number;
}

export interface Week4Evaluation {
  adset_name: string;
  market: 'NL' | 'FR';
  audience_type: string;
  campaign_type: 'leadgen' | 'awareness';
  cpl: number;
  conversion_rate: number;
  frequency: number;
  clicks?: number;
  cpc?: number;
  status: 'pass' | 'watch' | 'fail';
  recommendation: string;
}

export const SEVERITY_COLORS = {
  critical: {
    bg: 'bg-red-600',
    border: 'border-red-800',
    text: 'text-white',
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
  warning: {
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
} as const;

export const STATUS_ICONS = {
  pass: { icon: '✅', label: 'PASS', color: 'text-green-600' },
  watch: { icon: '⚠️', label: 'WATCH', color: 'text-amber-600' },
  fail: { icon: '❌', label: 'FAIL', color: 'text-red-600' },
} as const;

export const RETARGETING_POOL = {
  size: 45000,
  max_budget_nl: 2050,
  max_budget_fr: 1070,
  max_combined: 3120,
  max_frequency: 7,
  warning_frequency: 5,
} as const;
