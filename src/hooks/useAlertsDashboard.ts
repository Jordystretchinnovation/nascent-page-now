import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DecisionTrigger,
  TriggeredAlert,
  AdsetMetrics,
  RetargetingPoolStatus,
  Week4Evaluation,
  RETARGETING_POOL,
} from '@/types/alertsDashboard';
import { Q1_TARGETS, isSQL } from '@/types/mediaDashboard';
import { differenceInDays, format, parseISO } from 'date-fns';

export function useAlertsDashboard() {
  const [triggers, setTriggers] = useState<DecisionTrigger[]>([]);
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
  const [adsetMetrics, setAdsetMetrics] = useState<AdsetMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch triggers
      const { data: triggersData, error: triggersError } = await supabase
        .from('decision_triggers')
        .select('*')
        .eq('is_active', true)
        .order('severity', { ascending: false });

      if (triggersError) throw triggersError;

      // Fetch open alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('triggered_alerts')
        .select('*')
        .in('status', ['open', 'acknowledged'])
        .order('triggered_at', { ascending: false });

      if (alertsError) throw alertsError;

      // Fetch meta performance (last 28 days)
      const startDate = format(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const { data: metaData, error: metaError } = await supabase
        .from('meta_performance')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false });

      if (metaError) throw metaError;

      // Fetch leads (last 28 days)
      const { data: leadsData, error: leadsError } = await supabase
        .from('form_submissions_2026')
        .select('id, created_at, utm_campaign, utm_content, kwaliteit')
        .gte('created_at', `${startDate}T00:00:00`)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Calculate adset metrics
      const adsetMap = new Map<string, AdsetMetrics>();

      (metaData || []).forEach(m => {
        const key = m.adset_name;
        const existing = adsetMap.get(key);
        
        const market = m.adset_name.includes('_nl') ? 'NL' : m.adset_name.includes('_fr') ? 'FR' : 'NL';
        let audienceType = 'Unknown';
        if (m.adset_name.includes('lookalike_scraping')) audienceType = 'LAL Scraping';
        else if (m.adset_name.includes('retargeting_engagement')) audienceType = 'Retargeting';
        else if (m.adset_name.includes('lookalike_leads_customers')) audienceType = 'LAL Klanten';
        else if (m.adset_name.includes('lookalike_leads')) audienceType = 'LAL Leads';

        if (existing) {
          existing.spent += Number(m.spent);
          existing.frequency = m.frequency 
            ? (existing.frequency + Number(m.frequency)) / 2 
            : existing.frequency;
        } else {
          adsetMap.set(key, {
            adset_name: m.adset_name,
            campaign_name: m.campaign_name,
            market: market as 'NL' | 'FR',
            audience_type: audienceType,
            spent: Number(m.spent),
            leads: 0,
            sqls: 0,
            cpl: 0,
            conversion_rate: 0,
            frequency: m.frequency ? Number(m.frequency) : 0,
            clicks: 0,
            cpc: 0,
          });
        }
      });

      // Add leads to adsets
      const lastLeadByAdset = new Map<string, Date>();
      (leadsData || []).forEach(l => {
        if (l.utm_content) {
          const adset = adsetMap.get(l.utm_content);
          if (adset) {
            adset.leads++;
            if (isSQL(l.kwaliteit)) adset.sqls++;
          }
          
          const leadDate = parseISO(l.created_at);
          const existing = lastLeadByAdset.get(l.utm_content);
          if (!existing || leadDate > existing) {
            lastLeadByAdset.set(l.utm_content, leadDate);
          }
        }
      });

      // Calculate derived metrics
      adsetMap.forEach((adset, key) => {
        adset.cpl = adset.leads > 0 ? adset.spent / adset.leads : 0;
        adset.conversion_rate = adset.leads > 0 ? (adset.sqls / adset.leads) * 100 : 0;
        
        const lastLead = lastLeadByAdset.get(key);
        adset.days_without_lead = lastLead 
          ? differenceInDays(new Date(), lastLead) 
          : 999;
      });

      setTriggers(triggersData as DecisionTrigger[] || []);
      setAlerts(alertsData as TriggeredAlert[] || []);
      setAdsetMetrics(Array.from(adsetMap.values()));
    } catch (error) {
      console.error('Error fetching alerts data:', error);
      toast({
        title: 'Error loading alerts',
        description: 'Failed to fetch alerts data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate current week
  const currentWeek = useMemo(() => {
    const now = new Date();
    const campaignStart = Q1_TARGETS.campaign_start;
    const daysSinceStart = differenceInDays(now, campaignStart);
    return Math.max(1, Math.min(13, Math.ceil((daysSinceStart + 1) / 7)));
  }, []);

  // Get current phase
  const currentPhase = useMemo(() => {
    if (currentWeek <= 4) return { name: 'FASE 1 - TEST', phase: 1 };
    if (currentWeek <= 8) return { name: 'FASE 2 - LEARN', phase: 2 };
    return { name: 'FASE 3 - SCALE', phase: 3 };
  }, [currentWeek]);

  // Critical alerts count
  const criticalAlerts = useMemo(() => {
    return alerts.filter(a => a.severity === 'critical' && a.status === 'open');
  }, [alerts]);

  // Retargeting pool status
  const retargetingPoolStatus: RetargetingPoolStatus = useMemo(() => {
    const nlRetargeting = adsetMetrics.find(a => a.adset_name === 'retargeting_engagement_nl');
    const frRetargeting = adsetMetrics.find(a => a.adset_name === 'retargeting_engagement_fr');

    const nl_spent = nlRetargeting?.spent || 0;
    const nl_frequency = nlRetargeting?.frequency || 0;
    const fr_spent = frRetargeting?.spent || 0;
    const fr_frequency = frRetargeting?.frequency || 0;
    
    const combined_spent = nl_spent + fr_spent;
    const combined_frequency = (nl_frequency + fr_frequency) / 2;
    
    // Estimate pool exhaustion based on frequency
    const percentage_reached = Math.min(100, (combined_frequency / RETARGETING_POOL.max_frequency) * 100);
    const remaining_budget = RETARGETING_POOL.max_combined - combined_spent;
    const weekly_spend_rate = combined_spent / Math.max(1, currentWeek);
    const weeks_until_exhausted = remaining_budget > 0 
      ? Math.round(remaining_budget / weekly_spend_rate) 
      : 0;

    return {
      nl_spent,
      nl_frequency,
      fr_spent,
      fr_frequency,
      combined_spent,
      combined_frequency,
      max_budget: RETARGETING_POOL.max_combined,
      pool_size: RETARGETING_POOL.size,
      percentage_reached,
      weeks_until_exhausted,
    };
  }, [adsetMetrics, currentWeek]);

  // Week 4 evaluation data
  const week4Evaluation: Week4Evaluation[] = useMemo(() => {
    // Target CPLs for each adset
    const targets: Record<string, { cpl?: number; cpc?: number; freq: number }> = {
      'lookalike_scraping_nl': { cpl: 9, freq: 3 },
      'retargeting_engagement_nl': { cpl: 16, freq: 5 },
      'lookalike_leads_nl': { cpl: 10, freq: 3 },
      'lookalike_scraping_fr': { cpl: 35, freq: 3 },
      'retargeting_engagement_fr': { cpl: 50, freq: 5 },
      'lookalike_leads_fr': { cpl: 22, freq: 3 },
      'lookalike_leads_customers_nl': { cpc: 0.20, freq: 3 },
    };

    return adsetMetrics
      .filter(a => targets[a.adset_name])
      .map(adset => {
        const target = targets[adset.adset_name];
        const isAwareness = adset.adset_name.includes('lookalike_leads_customers');
        
        let status: 'pass' | 'watch' | 'fail' = 'pass';
        let recommendation = '';

        if (isAwareness) {
          const cpc = adset.cpc || 0;
          if (cpc > (target.cpc || 0.20) * 1.5) {
            status = 'fail';
            recommendation = 'CPC te hoog, check creatives';
          } else if (cpc > (target.cpc || 0.20)) {
            status = 'watch';
            recommendation = 'CPC boven target, monitor';
          } else {
            recommendation = 'CPC binnen target';
          }
        } else {
          if (adset.cpl > (target.cpl || 100) * 1.3) {
            status = 'fail';
            recommendation = 'Stop of verlaag budget';
          } else if (adset.cpl > (target.cpl || 100)) {
            status = 'watch';
            recommendation = 'CPL boven target, monitor';
          } else {
            recommendation = 'CPL OK, behoud/verhoog';
          }

          if (adset.frequency > target.freq) {
            if (status !== 'fail') status = 'watch';
            recommendation += '. Frequency hoog!';
          }
        }

        return {
          adset_name: adset.adset_name,
          market: adset.market,
          audience_type: adset.audience_type,
          campaign_type: isAwareness ? 'awareness' : 'leadgen',
          cpl: adset.cpl,
          conversion_rate: adset.conversion_rate,
          frequency: adset.frequency,
          clicks: adset.clicks,
          cpc: adset.cpc,
          status,
          recommendation,
        } as Week4Evaluation;
      });
  }, [adsetMetrics]);

  // Update alert status
  const updateAlertStatus = async (
    alertId: string, 
    status: 'acknowledged' | 'resolved',
    resolvedBy?: string,
    notes?: string
  ) => {
    try {
      const updates: Partial<TriggeredAlert> = { status };
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = resolvedBy || 'Admin';
      }
      if (notes) updates.notes = notes;

      const { error } = await supabase
        .from('triggered_alerts')
        .update(updates)
        .eq('id', alertId);

      if (error) throw error;

      toast({ title: 'Alert updated', description: `Alert marked as ${status}` });
      fetchData();
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: 'Error updating alert',
        variant: 'destructive',
      });
    }
  };

  return {
    isLoading,
    triggers,
    alerts,
    criticalAlerts,
    adsetMetrics,
    currentWeek,
    currentPhase,
    retargetingPoolStatus,
    week4Evaluation,
    updateAlertStatus,
    refetch: fetchData,
  };
}
