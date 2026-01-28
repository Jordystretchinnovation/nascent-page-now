import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  MetaPerformance,
  Lead,
  CampaignMetrics,
  WeeklyMetrics,
  KPISummary,
  FunnelStage,
  FrequencyAlert,
  MarketPerformance,
  AudiencePerformance,
  DashboardFilters,
  Q1_TARGETS,
  extractMarket,
  extractAudienceType,
  isGekwalificeerd,
  isMQL,
  isSQL,
} from '@/types/mediaDashboard';
import { startOfWeek, endOfWeek, differenceInDays, format, parseISO, getWeek, getYear } from 'date-fns';

export function useMediaDashboard(filters: DashboardFilters) {
  const [metaData, setMetaData] = useState<MetaPerformance[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = format(filters.dateRange.start, 'yyyy-MM-dd');
      const endDate = format(filters.dateRange.end, 'yyyy-MM-dd');

      // Fetch meta performance data
      const { data: metaResult, error: metaError } = await supabase
        .from('meta_performance')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (metaError) throw metaError;

      // Fetch leads data
      const { data: leadsResult, error: leadsError } = await supabase
        .from('form_submissions_2026')
        .select('id, created_at, language, type_bedrijf, utm_campaign, utm_content, kwaliteit')
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)
        .order('created_at', { ascending: true });

      if (leadsError) throw leadsError;

      setMetaData(metaResult || []);
      setLeads(leadsResult || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error loading data',
        description: 'Failed to fetch dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.dateRange.start, filters.dateRange.end]);

  // Filter data based on market and campaign
  const filteredMeta = useMemo(() => {
    let data = metaData;
    
    if (filters.market !== 'All') {
      data = data.filter(m => {
        const market = extractMarket(m.adset_name);
        return market === filters.market;
      });
    }
    
    if (filters.campaign !== 'All') {
      data = data.filter(m => m.campaign_name === filters.campaign);
    }
    
    return data;
  }, [metaData, filters.market, filters.campaign]);

  const filteredLeads = useMemo(() => {
    let data = leads;
    
    if (filters.market !== 'All') {
      data = data.filter(l => {
        if (!l.utm_content) return false;
        const market = extractMarket(l.utm_content);
        return market === filters.market;
      });
    }
    
    if (filters.campaign !== 'All') {
      data = data.filter(l => l.utm_campaign === filters.campaign);
    }
    
    return data;
  }, [leads, filters.market, filters.campaign]);

  // Get unique campaigns for filter dropdown
  const campaigns = useMemo(() => {
    const uniqueCampaigns = [...new Set(metaData.map(m => m.campaign_name))];
    return uniqueCampaigns.sort();
  }, [metaData]);

  // Calculate KPI Summary
  const kpiSummary: KPISummary = useMemo(() => {
    const totalSpent = filteredMeta.reduce((sum, m) => sum + Number(m.spent), 0);
    const totalLeads = filteredLeads.length;
    const gekwalificeerd = filteredLeads.filter(l => isGekwalificeerd(l.kwaliteit)).length;
    const mqls = filteredLeads.filter(l => isMQL(l.kwaliteit) || isSQL(l.kwaliteit)).length;
    const sqls = filteredLeads.filter(l => isSQL(l.kwaliteit)).length;

    return {
      budget_spent: totalSpent,
      budget_target: Q1_TARGETS.budget,
      budget_progress: (totalSpent / Q1_TARGETS.budget) * 100,
      sqls,
      sql_target: Q1_TARGETS.sqls,
      sql_progress: (sqls / Q1_TARGETS.sqls) * 100,
      cpsql: sqls > 0 ? totalSpent / sqls : 0,
      cpsql_target: Q1_TARGETS.max_cpsql,
      total_leads: totalLeads,
      gekwalificeerd,
      gekwalificeerd_rate: totalLeads > 0 ? (gekwalificeerd / totalLeads) * 100 : 0,
      mqls,
      mql_rate: totalLeads > 0 ? (mqls / totalLeads) * 100 : 0,
      mql_to_sql_rate: mqls > 0 ? (sqls / mqls) * 100 : 0,
      mql_to_sql_target: Q1_TARGETS.mql_to_sql_rate * 100,
    };
  }, [filteredMeta, filteredLeads]);

  // Calculate funnel stages
  const funnelStages: FunnelStage[] = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const gekwalificeerd = filteredLeads.filter(l => isGekwalificeerd(l.kwaliteit)).length;
    const mqls = filteredLeads.filter(l => isMQL(l.kwaliteit) || isSQL(l.kwaliteit)).length;
    const sqls = filteredLeads.filter(l => isSQL(l.kwaliteit)).length;

    return [
      { name: 'Leads', value: totalLeads, percentage: 100, dropoff: 0 },
      { name: 'Gekwalificeerd', value: gekwalificeerd, percentage: totalLeads > 0 ? (gekwalificeerd / totalLeads) * 100 : 0, dropoff: totalLeads - gekwalificeerd },
      { name: 'MQL', value: mqls, percentage: totalLeads > 0 ? (mqls / totalLeads) * 100 : 0, dropoff: gekwalificeerd - mqls },
      { name: 'SQL', value: sqls, percentage: totalLeads > 0 ? (sqls / totalLeads) * 100 : 0, dropoff: mqls - sqls },
    ];
  }, [filteredLeads]);

  // Calculate weekly metrics
  const weeklyMetrics: WeeklyMetrics[] = useMemo(() => {
    const weeks: WeeklyMetrics[] = [];
    let cumulativeSQLs = 0;

    for (let week = 1; week <= Q1_TARGETS.weeks; week++) {
      const weekStart = new Date(2025, 0, 1 + (week - 1) * 7);
      const weekEnd = new Date(2025, 0, 7 + (week - 1) * 7);

      const weekMeta = filteredMeta.filter(m => {
        const date = parseISO(m.date);
        return date >= weekStart && date <= weekEnd;
      });

      const weekLeads = filteredLeads.filter(l => {
        const date = parseISO(l.created_at);
        return date >= weekStart && date <= weekEnd;
      });

      const actualSpend = weekMeta.reduce((sum, m) => sum + Number(m.spent), 0);
      const actualSQLs = weekLeads.filter(l => isSQL(l.kwaliteit)).length;
      cumulativeSQLs += actualSQLs;

      weeks.push({
        week,
        weekStart: format(weekStart, 'MMM d'),
        weekEnd: format(weekEnd, 'MMM d'),
        planned_spend: Q1_TARGETS.weekly_budget,
        actual_spend: actualSpend,
        spend_variance: actualSpend - Q1_TARGETS.weekly_budget,
        planned_sqls: Q1_TARGETS.weekly_sqls,
        actual_sqls: actualSQLs,
        cumulative_sqls: cumulativeSQLs,
        leads: weekLeads.length,
        on_track: cumulativeSQLs >= week * Q1_TARGETS.weekly_sqls * 0.9,
      });
    }

    return weeks;
  }, [filteredMeta, filteredLeads]);

  // Calculate campaign metrics
  const campaignMetrics: CampaignMetrics[] = useMemo(() => {
    const campaignMap = new Map<string, CampaignMetrics>();

    filteredMeta.forEach(m => {
      const key = `${m.campaign_name}|${m.adset_name}`;
      const existing = campaignMap.get(key);
      
      if (existing) {
        existing.spent += Number(m.spent);
        existing.frequency = m.frequency ? (existing.frequency || 0 + Number(m.frequency)) / 2 : existing.frequency;
      } else {
        campaignMap.set(key, {
          campaign_name: m.campaign_name,
          adset_name: m.adset_name,
          market: extractMarket(m.adset_name),
          audience_type: extractAudienceType(m.adset_name),
          spent: Number(m.spent),
          frequency: m.frequency ? Number(m.frequency) : null,
          leads: 0,
          gekwalificeerd: 0,
          mqls: 0,
          sqls: 0,
          cpl: 0,
          cp_gekwalificeerd: 0,
          cpmql: 0,
          cpsql: 0,
        });
      }
    });

    // Match leads to campaigns
    filteredLeads.forEach(l => {
      const key = `${l.utm_campaign}|${l.utm_content}`;
      const campaign = campaignMap.get(key);
      
      if (campaign) {
        campaign.leads++;
        if (isGekwalificeerd(l.kwaliteit)) campaign.gekwalificeerd++;
        if (isMQL(l.kwaliteit) || isSQL(l.kwaliteit)) campaign.mqls++;
        if (isSQL(l.kwaliteit)) campaign.sqls++;
      }
    });

    // Calculate cost metrics
    campaignMap.forEach(c => {
      c.cpl = c.leads > 0 ? c.spent / c.leads : 0;
      c.cp_gekwalificeerd = c.gekwalificeerd > 0 ? c.spent / c.gekwalificeerd : 0;
      c.cpmql = c.mqls > 0 ? c.spent / c.mqls : 0;
      c.cpsql = c.sqls > 0 ? c.spent / c.sqls : 0;
    });

    return Array.from(campaignMap.values()).sort((a, b) => b.spent - a.spent);
  }, [filteredMeta, filteredLeads]);

  // Calculate market performance
  const marketPerformance: MarketPerformance[] = useMemo(() => {
    const markets: Record<string, MarketPerformance> = {
      NL: { market: 'NL', leads: 0, sqls: 0, spent: 0, cpl: 0, cpsql: 0 },
      FR: { market: 'FR', leads: 0, sqls: 0, spent: 0, cpl: 0, cpsql: 0 },
    };

    filteredMeta.forEach(m => {
      const market = extractMarket(m.adset_name);
      if (market !== 'Unknown') {
        markets[market].spent += Number(m.spent);
      }
    });

    filteredLeads.forEach(l => {
      const market = l.utm_content ? extractMarket(l.utm_content) : 'Unknown';
      if (market !== 'Unknown') {
        markets[market].leads++;
        if (isSQL(l.kwaliteit)) markets[market].sqls++;
      }
    });

    Object.values(markets).forEach(m => {
      m.cpl = m.leads > 0 ? m.spent / m.leads : 0;
      m.cpsql = m.sqls > 0 ? m.spent / m.sqls : 0;
    });

    return Object.values(markets);
  }, [filteredMeta, filteredLeads]);

  // Calculate audience performance
  const audiencePerformance: AudiencePerformance[] = useMemo(() => {
    const audiences: Record<string, AudiencePerformance> = {
      Lookalike: { audience_type: 'Lookalike', leads: 0, sqls: 0, spent: 0, cpl: 0, cpsql: 0 },
      Retargeting: { audience_type: 'Retargeting', leads: 0, sqls: 0, spent: 0, cpl: 0, cpsql: 0 },
    };

    filteredMeta.forEach(m => {
      const audienceType = extractAudienceType(m.adset_name);
      if (audienceType !== 'Unknown') {
        audiences[audienceType].spent += Number(m.spent);
      }
    });

    filteredLeads.forEach(l => {
      const audienceType = l.utm_content ? extractAudienceType(l.utm_content) : 'Unknown';
      if (audienceType !== 'Unknown') {
        audiences[audienceType].leads++;
        if (isSQL(l.kwaliteit)) audiences[audienceType].sqls++;
      }
    });

    Object.values(audiences).forEach(a => {
      a.cpl = a.leads > 0 ? a.spent / a.leads : 0;
      a.cpsql = a.sqls > 0 ? a.spent / a.sqls : 0;
    });

    return Object.values(audiences);
  }, [filteredMeta, filteredLeads]);

  // Calculate frequency alerts
  const frequencyAlerts: FrequencyAlert[] = useMemo(() => {
    const adsetFrequencies = new Map<string, { total: number; count: number; firstDate: string; lastData: MetaPerformance }>();

    filteredMeta.forEach(m => {
      if (m.frequency) {
        const key = `${m.campaign_name}|${m.adset_name}|${m.ad_name}`;
        const existing = adsetFrequencies.get(key);
        
        if (existing) {
          existing.total += Number(m.frequency);
          existing.count++;
          existing.lastData = m;
        } else {
          adsetFrequencies.set(key, {
            total: Number(m.frequency),
            count: 1,
            firstDate: m.date,
            lastData: m,
          });
        }
      }
    });

    const alerts: FrequencyAlert[] = [];

    adsetFrequencies.forEach((data, key) => {
      const avgFrequency = data.total / data.count;
      
      if (avgFrequency >= 3.0) {
        const [campaign_name, adset_name, ad_name] = key.split('|');
        const daysRunning = differenceInDays(parseISO(data.lastData.date), parseISO(data.firstDate)) + 1;
        const severity = avgFrequency >= 4.0 ? 'critical' : 'warning';
        
        alerts.push({
          id: key,
          campaign_name,
          adset_name,
          ad_name,
          current_frequency: avgFrequency,
          days_running: daysRunning,
          severity,
          recommendation: severity === 'critical' 
            ? 'Consider pausing or refreshing creative immediately'
            : 'Monitor closely and prepare new creatives',
        });
      }
    });

    return alerts.sort((a, b) => b.current_frequency - a.current_frequency);
  }, [filteredMeta]);

  return {
    isLoading,
    lastUpdated,
    campaigns,
    kpiSummary,
    funnelStages,
    weeklyMetrics,
    campaignMetrics,
    marketPerformance,
    audiencePerformance,
    frequencyAlerts,
    refetch: fetchData,
  };
}
