import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
}

interface CampaignBudget {
  utm_campaign: string[] | null;
  utm_source: string[] | null;
  utm_medium: string[] | null;
  budget: number;
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
  cpql: number;
}

interface CampaignGroup {
  campaign: string;
  sources: SourceStat[];
  total: number;
  qualified: number;
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
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  // Group submissions by campaign and source
  const sourceStats = submissions.reduce((acc, sub) => {
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

  // Match budgets to sources
  const enhancedSourceStats = Object.values(sourceStats).map(stat => {
    const matchingBudget = budgets.find(b => 
      b.utm_campaign?.includes(stat.campaign) && 
      b.utm_source?.includes(stat.source)
    );
    
    const budget = matchingBudget?.budget || 0;
    const cpl = budget > 0 ? budget / stat.total : 0;
    const cpql = budget > 0 && stat.qualified > 0 ? budget / stat.qualified : 0;
    
    return {
      ...stat,
      budget,
      cpl,
      cpql
    };
  });

  // Group by campaign
  const campaignGroups = enhancedSourceStats.reduce((acc, stat) => {
    if (!acc[stat.campaign]) {
      acc[stat.campaign] = {
        campaign: stat.campaign,
        sources: [],
        total: 0,
        qualified: 0,
        goed: 0,
        mql: 0,
        redelijk: 0,
        slecht: 0,
        engaged: 0,
        conversions: 0,
        budget: 0
      };
    }
    
    acc[stat.campaign].sources.push(stat);
    acc[stat.campaign].total += stat.total;
    acc[stat.campaign].qualified += stat.qualified;
    acc[stat.campaign].goed += stat.goed;
    acc[stat.campaign].mql += stat.mql;
    acc[stat.campaign].redelijk += stat.redelijk;
    acc[stat.campaign].slecht += stat.slecht;
    acc[stat.campaign].engaged += stat.engaged;
    acc[stat.campaign].conversions += stat.conversions;
    acc[stat.campaign].budget += stat.budget;
    
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

  // Calculate totals
  const totals = sortedCampaigns.reduce((acc, group) => ({
    total: acc.total + group.total,
    qualified: acc.qualified + group.qualified,
    goed: acc.goed + group.goed,
    mql: acc.mql + group.mql,
    redelijk: acc.redelijk + group.redelijk,
    engaged: acc.engaged + group.engaged,
    conversions: acc.conversions + group.conversions,
    budget: acc.budget + group.budget
  }), {
    total: 0,
    qualified: 0,
    goed: 0,
    mql: 0,
    redelijk: 0,
    engaged: 0,
    conversions: 0,
    budget: 0
  });

  const toggleCampaign = (campaign: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaign)) {
      newExpanded.delete(campaign);
    } else {
      newExpanded.add(campaign);
    }
    setExpandedCampaigns(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Total Leads</TableHead>
                <TableHead className="text-right">Qualified</TableHead>
                <TableHead className="text-right">Qual. Rate</TableHead>
                <TableHead className="text-right">Engaged</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Budget (€)</TableHead>
                <TableHead className="text-right">CPL (€)</TableHead>
                <TableHead className="text-right">CPQL (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCampaigns.map((group, index) => {
                const qualRate = group.total > 0 ? ((group.qualified / group.total) * 100).toFixed(0) : '0';
                const convRate = group.total > 0 ? ((group.conversions / group.total) * 100).toFixed(1) : '0';
                const cpl = group.budget > 0 ? group.budget / group.total : 0;
                const cpql = group.budget > 0 && group.qualified > 0 ? group.budget / group.qualified : 0;
                const isExpanded = expandedCampaigns.has(group.campaign);
                
                return (
                  <>
                    <TableRow key={index} className="font-medium bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleCampaign(group.campaign)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-semibold">{group.campaign}</TableCell>
                      <TableCell className="text-right">{group.total}</TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">{group.qualified}</div>
                          <div className="text-xs text-muted-foreground">
                            G:{group.goed} M:{group.mql} R:{group.redelijk}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={parseInt(qualRate) > 30 ? "default" : "secondary"}>
                          {qualRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{group.engaged}</TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">{group.conversions}</div>
                          <div className="text-xs text-muted-foreground">{convRate}%</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {group.budget > 0 ? group.budget.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {cpl > 0 ? cpl.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {cpql > 0 ? cpql.toFixed(2) : '-'}
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && group.sources.map((source: SourceStat, sourceIndex: number) => {
                      const sourceQualRate = source.total > 0 ? ((source.qualified / source.total) * 100).toFixed(0) : '0';
                      const sourceConvRate = source.total > 0 ? ((source.conversions / source.total) * 100).toFixed(1) : '0';
                      
                      return (
                        <TableRow key={`${index}-${sourceIndex}`} className="bg-background">
                          <TableCell></TableCell>
                          <TableCell className="pl-12">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{source.source}</Badge>
                              <Badge variant="secondary">{source.medium}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{source.total}</TableCell>
                          <TableCell className="text-right">
                            <div>
                              <div className="font-medium">{source.qualified}</div>
                              <div className="text-xs text-muted-foreground">
                                G:{source.goed} M:{source.mql} R:{source.redelijk}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={parseInt(sourceQualRate) > 30 ? "default" : "secondary"}>
                              {sourceQualRate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{source.engaged}</TableCell>
                          <TableCell className="text-right">
                            <div>
                              <div className="font-medium">{source.conversions}</div>
                              <div className="text-xs text-muted-foreground">{sourceConvRate}%</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {source.budget > 0 ? source.budget.toFixed(2) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {source.cpl > 0 ? source.cpl.toFixed(2) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {source.cpql > 0 ? source.cpql.toFixed(2) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                );
              })}
              
              {/* Totals Row */}
              <TableRow className="font-bold bg-primary/5 border-t-2">
                <TableCell></TableCell>
                <TableCell className="font-bold">TOTAL</TableCell>
                <TableCell className="text-right">{totals.total}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-bold">{totals.qualified}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      G:{totals.goed} M:{totals.mql} R:{totals.redelijk}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={totals.total > 0 && ((totals.qualified / totals.total) * 100) > 30 ? "default" : "secondary"}>
                    {totals.total > 0 ? ((totals.qualified / totals.total) * 100).toFixed(0) : '0'}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{totals.engaged}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-bold">{totals.conversions}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {totals.total > 0 ? ((totals.conversions / totals.total) * 100).toFixed(1) : '0'}%
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {totals.budget > 0 ? totals.budget.toFixed(2) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {totals.budget > 0 && totals.total > 0 ? (totals.budget / totals.total).toFixed(2) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {totals.budget > 0 && totals.qualified > 0 ? (totals.budget / totals.qualified).toFixed(2) : '-'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
