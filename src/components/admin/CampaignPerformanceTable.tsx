import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Format currency in European style
const formatCurrency = (amount: number): string => {
  return `€ ${amount.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
}

interface CampaignBudget {
  campaign_name: string;
  utm_campaign: string[] | null;
  utm_source: string[] | null;
  utm_medium: string[] | null;
  budget: number;
  emails_sent: number | null;
  open_rate: number | null;
  click_rate: number | null;
}

interface SourceStat {
  campaign: string;
  source: string;
  medium: string;
  total: number;
  qualified: number;
  goed: number;
  mql: number;
  redelijk: number;
  slecht: number;
  engaged: number;
  conversions: number;
  budget: number;
  cpl: number;
  cpsql: number;
}

interface CampaignGroup {
  campaign: string;
  sources: SourceStat[];
  total: number;
  qualified: number;
  salesQualified: number; // Goed + Redelijk (excludes MQL)
  goed: number;
  mql: number;
  redelijk: number;
  slecht: number;
  engaged: number;
  conversions: number;
  budget: number;
}

interface CampaignPerformanceTableProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const CampaignPerformanceTable = ({ submissions, budgets }: CampaignPerformanceTableProps) => {
  // Email sources to recognize
  const emailSources = ['email', 'activecampaign', 'lemlist', 'mailchimp', 'sendgrid', 'hubspot'];
  
  const isEmailSource = (source: string | null): boolean => {
    if (!source) return false;
    const lowerSource = source.toLowerCase();
    return emailSources.some(emailSource => lowerSource.includes(emailSource));
  };

  // Filter out email submissions - they have their own table
  const nonEmailSubmissions = submissions.filter(sub => 
    !isEmailSource(sub.utm_source)
  );

  // Group submissions by campaign and source
  const sourceStats = nonEmailSubmissions.reduce((acc, sub) => {
    const key = `${sub.utm_campaign || 'Unknown'}-${sub.utm_source || 'Unknown'}-${sub.utm_medium || 'Unknown'}`;
    
    if (!acc[key]) {
      acc[key] = {
        campaign: sub.utm_campaign || 'Unknown',
        source: sub.utm_source || 'Unknown',
        medium: sub.utm_medium || 'Unknown',
        total: 0,
        qualified: 0,
        goed: 0,
        mql: 0,
        redelijk: 0,
        slecht: 0,
        engaged: 0,
        conversions: 0
      };
    }
    
    acc[key].total++;
    
    if (sub.kwaliteit) {
      if (['Goed', 'Goed - klant', 'Goed - Klant'].includes(sub.kwaliteit)) {
        acc[key].qualified++;
        acc[key].goed++;
      } else if (sub.kwaliteit === 'MQL') {
        acc[key].qualified++;
        acc[key].mql++;
      } else if (sub.kwaliteit === 'Redelijk') {
        acc[key].qualified++;
        acc[key].redelijk++;
      } else if (sub.kwaliteit === 'Slecht') {
        acc[key].slecht++;
      }
    }
    
    if (sub.sales_status) {
      acc[key].engaged++;
      if (sub.sales_status === 'Gesprek gepland') {
        acc[key].conversions++;
      }
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Match budgets at campaign level first to avoid duplication
  const campaignBudgetMap = new Map<string, number>();
  
  nonEmailSubmissions.forEach(sub => {
    const campaign = sub.utm_campaign || 'Unknown';
    if (!campaignBudgetMap.has(campaign)) {
      // Find all budgets matching this campaign
      const matchingBudgets = budgets.filter(b => 
        b.utm_campaign?.includes(campaign)
      );
      
      // Deduplicate by campaign_name to avoid counting same budget twice for fb+ig
      const uniqueBudgets = matchingBudgets.reduce((acc, budget) => {
        if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
          acc.push(budget);
        }
        return acc;
      }, [] as CampaignBudget[]);
      
      const totalBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
      campaignBudgetMap.set(campaign, totalBudget);
    }
  });

  // Don't assign budget to individual sources, only to campaigns
  const enhancedSourceStats = Object.values(sourceStats).map(stat => {
    return {
      ...stat,
      budget: 0, // Budget shown at campaign level only
      cpl: 0,
      cpsql: 0
    };
  });

  // Group by campaign and assign deduplicated budget
  const campaignGroups = enhancedSourceStats.reduce((acc, stat) => {
    if (!acc[stat.campaign]) {
      acc[stat.campaign] = {
        campaign: stat.campaign,
        sources: [],
        total: 0,
        qualified: 0,
        salesQualified: 0, // Goed + Redelijk only
        goed: 0,
        mql: 0,
        redelijk: 0,
        slecht: 0,
        engaged: 0,
        conversions: 0,
        budget: campaignBudgetMap.get(stat.campaign) || 0 // Use deduplicated budget
      };
    }
    
    acc[stat.campaign].sources.push(stat);
    acc[stat.campaign].total += stat.total;
    acc[stat.campaign].qualified += stat.qualified;
    acc[stat.campaign].salesQualified += stat.goed + stat.redelijk; // For CPSQL
    acc[stat.campaign].goed += stat.goed;
    acc[stat.campaign].mql += stat.mql;
    acc[stat.campaign].redelijk += stat.redelijk;
    acc[stat.campaign].slecht += stat.slecht;
    acc[stat.campaign].engaged += stat.engaged;
    acc[stat.campaign].conversions += stat.conversions;
    // Don't add stat.budget since it's 0 and we already set campaign budget
    
    return acc;
  }, {} as Record<string, CampaignGroup>);

  const sortedCampaigns = (Object.values(campaignGroups) as CampaignGroup[]).sort((a, b) => {
    // Extract gh number from campaign name (e.g., "2506_gh5_leads" -> 5)
    const extractGh = (campaign: string): number => {
      const match = campaign.match(/gh(\d+)/i);
      return match ? parseInt(match[1]) : 999; // Unknown campaigns go to end
    };
    
    const ghA = extractGh(a.campaign);
    const ghB = extractGh(b.campaign);
    
    return ghA - ghB;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Campaign Performance Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCampaigns.map((group) => {
            const qualRate = group.total > 0 ? ((group.qualified / group.total) * 100).toFixed(0) : '0';
            const sqlRate = group.total > 0 ? ((group.salesQualified / group.total) * 100).toFixed(0) : '0';
            const convRate = group.total > 0 ? ((group.conversions / group.total) * 100).toFixed(1) : '0';
            const cpl = group.budget > 0 ? (group.budget / group.total).toFixed(2) : '0';
            const cpql = group.budget > 0 && group.qualified > 0 ? (group.budget / group.qualified).toFixed(2) : '0';
            const cpsql = group.budget > 0 && group.salesQualified > 0 ? (group.budget / group.salesQualified).toFixed(2) : '0';
            
            return (
              <div key={group.campaign} className="border rounded-lg p-4">
                <div className="font-semibold text-lg mb-3">{group.campaign}</div>
                
                {/* Main metrics in a grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                    <div className="text-2xl font-bold">{group.total}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                    <div className="text-xl font-bold">{group.qualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {qualRate}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      G:{group.goed} M:{group.mql} R:{group.redelijk}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SQL</div>
                    <div className="text-xl font-bold">{group.salesQualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {sqlRate}% of total
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                    <div className="text-xl font-bold">{group.conversions}</div>
                    <div className="text-xs text-muted-foreground">
                      {convRate}% of total
                    </div>
                  </div>
                </div>

                {/* Cost metrics */}
                {group.budget > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">CPL</div>
                      <div className="text-sm font-medium">€{cpl}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">CPQL</div>
                      <div className="text-sm font-medium">€{cpql}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">CPSQL</div>
                      <div className="text-sm font-medium">€{cpsql}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Campaign Budget</div>
                      <div className="text-sm font-medium">€{group.budget.toFixed(0)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
