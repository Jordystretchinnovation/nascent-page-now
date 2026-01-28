import { useState, useMemo } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { DashboardFilters } from '@/components/media-dashboard/DashboardFilters';
import { useMediaDashboard } from '@/hooks/useMediaDashboard';
import { DashboardFilters as FilterState, getCPSQLColor, getCPSQLBgColor } from '@/types/mediaDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const MediaDashboardCampaigns = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(2025, 0, 1),
      end: new Date(2025, 2, 31),
    },
    market: 'All',
    campaign: 'All',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  const {
    isLoading,
    lastUpdated,
    campaigns,
    campaignMetrics,
    refetch,
  } = useMediaDashboard(filters);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  // Group metrics by campaign
  const groupedMetrics = useMemo(() => {
    const filtered = campaignMetrics.filter(m => 
      m.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.adset_name && m.adset_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const grouped = new Map<string, typeof campaignMetrics>();
    
    filtered.forEach(m => {
      const existing = grouped.get(m.campaign_name) || [];
      existing.push(m);
      grouped.set(m.campaign_name, existing);
    });

    return grouped;
  }, [campaignMetrics, searchQuery]);

  // Campaign totals
  const campaignTotals = useMemo(() => {
    const totals = new Map<string, {
      spent: number;
      leads: number;
      gekwalificeerd: number;
      mqls: number;
      sqls: number;
      frequency: number | null;
    }>();

    groupedMetrics.forEach((adsets, campaign) => {
      const total = adsets.reduce((acc, m) => ({
        spent: acc.spent + m.spent,
        leads: acc.leads + m.leads,
        gekwalificeerd: acc.gekwalificeerd + m.gekwalificeerd,
        mqls: acc.mqls + m.mqls,
        sqls: acc.sqls + m.sqls,
        frequency: m.frequency ? (acc.frequency || 0 + m.frequency) / 2 : acc.frequency,
      }), { spent: 0, leads: 0, gekwalificeerd: 0, mqls: 0, sqls: 0, frequency: null as number | null });

      totals.set(campaign, total);
    });

    return totals;
  }, [groupedMetrics]);

  const toggleCampaign = (campaign: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaign)) {
      newExpanded.delete(campaign);
    } else {
      newExpanded.add(campaign);
    }
    setExpandedCampaigns(newExpanded);
  };

  const exportCSV = () => {
    const headers = ['Campaign', 'Adset', 'Market', 'Audience', 'Spent', 'Leads', 'Gekwalificeerd', 'MQL', 'SQL', 'CPL', 'CPSQL', 'Frequency'];
    const rows = campaignMetrics.map(m => [
      m.campaign_name,
      m.adset_name || '',
      m.market,
      m.audience_type,
      m.spent.toFixed(2),
      m.leads,
      m.gekwalificeerd,
      m.mqls,
      m.sqls,
      m.cpl.toFixed(2),
      m.cpsql.toFixed(2),
      m.frequency?.toFixed(2) || '',
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-breakdown.csv';
    a.click();
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MediaDashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Breakdown</h1>
          <p className="text-slate-600">Detailed performance metrics by campaign and adset</p>
        </div>

        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          campaigns={campaigns}
          lastUpdated={lastUpdated}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Campaign Performance</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Campaign / Adset</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead className="text-right">Spent</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                      <TableHead className="text-right">Gekwal.</TableHead>
                      <TableHead className="text-right">MQL</TableHead>
                      <TableHead className="text-right">SQL</TableHead>
                      <TableHead className="text-right">CPL</TableHead>
                      <TableHead className="text-right">CPSQL</TableHead>
                      <TableHead className="text-right">Freq.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(groupedMetrics.entries()).map(([campaign, adsets]) => {
                      const isExpanded = expandedCampaigns.has(campaign);
                      const totals = campaignTotals.get(campaign)!;
                      const campaignCPL = totals.leads > 0 ? totals.spent / totals.leads : 0;
                      const campaignCPSQL = totals.sqls > 0 ? totals.spent / totals.sqls : 0;

                      return (
                        <>
                          <TableRow 
                            key={campaign} 
                            className="cursor-pointer hover:bg-slate-50 font-medium"
                            onClick={() => toggleCampaign(campaign)}
                          >
                            <TableCell>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{campaign}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell className="text-right">€{totals.spent.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{totals.leads}</TableCell>
                            <TableCell className="text-right">{totals.gekwalificeerd}</TableCell>
                            <TableCell className="text-right">{totals.mqls}</TableCell>
                            <TableCell className="text-right">{totals.sqls}</TableCell>
                            <TableCell className="text-right">€{campaignCPL.toFixed(2)}</TableCell>
                            <TableCell className={cn("text-right font-medium", getCPSQLColor(campaignCPSQL))}>
                              €{campaignCPSQL.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                          </TableRow>
                          {isExpanded && adsets.map((adset, idx) => (
                            <TableRow key={`${campaign}-${idx}`} className="bg-slate-50/50">
                              <TableCell></TableCell>
                              <TableCell className="pl-8 text-sm text-slate-600">
                                {adset.adset_name}
                              </TableCell>
                              <TableCell>
                                <span className={cn(
                                  "px-2 py-1 rounded text-xs font-medium",
                                  adset.market === 'NL' ? "bg-blue-100 text-blue-700" : 
                                  adset.market === 'FR' ? "bg-purple-100 text-purple-700" :
                                  "bg-slate-100 text-slate-600"
                                )}>
                                  {adset.market}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={cn(
                                  "px-2 py-1 rounded text-xs font-medium",
                                  adset.audience_type === 'Lookalike' ? "bg-orange-100 text-orange-700" : 
                                  adset.audience_type === 'Retargeting' ? "bg-green-100 text-green-700" :
                                  "bg-slate-100 text-slate-600"
                                )}>
                                  {adset.audience_type}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">€{adset.spent.toFixed(0)}</TableCell>
                              <TableCell className="text-right">{adset.leads}</TableCell>
                              <TableCell className="text-right">{adset.gekwalificeerd}</TableCell>
                              <TableCell className="text-right">{adset.mqls}</TableCell>
                              <TableCell className="text-right">{adset.sqls}</TableCell>
                              <TableCell className="text-right">€{adset.cpl.toFixed(2)}</TableCell>
                              <TableCell className={cn(
                                "text-right",
                                getCPSQLColor(adset.cpsql)
                              )}>
                                €{adset.cpsql.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                {adset.frequency?.toFixed(2) || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardCampaigns;
