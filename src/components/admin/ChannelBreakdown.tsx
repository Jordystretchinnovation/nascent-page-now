import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Submission {
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface CampaignBudget {
  utm_source: string[] | null;
  budget: number;
}

interface ChannelBreakdownProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const ChannelBreakdown = ({ submissions, budgets }: ChannelBreakdownProps) => {
  // Group by source (channel)
  const channelStats = submissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Unknown';
    
    if (!acc[source]) {
      acc[source] = { total: 0, qualified: 0, conversions: 0 };
    }
    
    acc[source].total++;
    
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[source].qualified++;
    }
    
    if (sub.sales_status === 'Gesprek gepland') {
      acc[source].conversions++;
    }
    
    return acc;
  }, {} as Record<string, { total: number; qualified: number; conversions: number }>);

  // Calculate totals for each channel with budgets
  const enhancedChannels = Object.entries(channelStats).map(([source, stats]) => {
    const channelBudget = budgets
      .filter(b => b.utm_source?.includes(source))
      .reduce((sum, b) => sum + b.budget, 0);
    
    const qualRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(1) : '0';
    const convRate = stats.total > 0 ? ((stats.conversions / stats.total) * 100).toFixed(1) : '0';
    const cpl = channelBudget > 0 ? (channelBudget / stats.total).toFixed(2) : '0';
    const cpql = channelBudget > 0 && stats.qualified > 0 ? (channelBudget / stats.qualified).toFixed(2) : '0';
    
    return {
      source,
      ...stats,
      budget: channelBudget,
      qualRate: parseFloat(qualRate),
      convRate: parseFloat(convRate),
      cpl: parseFloat(cpl),
      cpql: parseFloat(cpql)
    };
  }).sort((a, b) => b.total - a.total);

  // Identify best and worst performers
  const bestPerformer = enhancedChannels.reduce((best, channel) => 
    channel.qualRate > (best?.qualRate || 0) ? channel : best
  , enhancedChannels[0]);

  const worstPerformer = enhancedChannels.reduce((worst, channel) => 
    channel.qualRate < (worst?.qualRate || 100) && channel.total > 10 ? channel : worst
  , enhancedChannels[enhancedChannels.length - 1]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Channel Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-green-500">✓</span> Best Performing Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestPerformer && (
              <div>
                <div className="text-2xl font-bold mb-2">{bestPerformer.source}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Leads</div>
                    <div className="font-semibold">{bestPerformer.total}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Qualified</div>
                    <div className="font-semibold">{bestPerformer.qualified} ({bestPerformer.qualRate}%)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-semibold">{bestPerformer.conversions} ({bestPerformer.convRate}%)</div>
                  </div>
                  {bestPerformer.budget > 0 && (
                    <div>
                      <div className="text-muted-foreground">CPL</div>
                      <div className="font-semibold">€{bestPerformer.cpl}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-orange-500">!</span> Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {worstPerformer && (
              <div>
                <div className="text-2xl font-bold mb-2">{worstPerformer.source}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Leads</div>
                    <div className="font-semibold">{worstPerformer.total}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Qualified</div>
                    <div className="font-semibold">{worstPerformer.qualified} ({worstPerformer.qualRate}%)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-semibold">{worstPerformer.conversions} ({worstPerformer.convRate}%)</div>
                  </div>
                  {worstPerformer.budget > 0 && (
                    <div>
                      <div className="text-muted-foreground">CPL</div>
                      <div className="font-semibold">€{worstPerformer.cpl}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Channels Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enhancedChannels.map((channel) => (
              <div key={channel.source} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-lg">{channel.source}</div>
                  <Badge variant={channel.qualRate > 30 ? "default" : "secondary"}>
                    {channel.qualRate}% qualified
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Leads</div>
                    <div className="font-medium">{channel.total}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Qualified</div>
                    <div className="font-medium">{channel.qualified}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-medium">{channel.conversions} ({channel.convRate}%)</div>
                  </div>
                  {channel.budget > 0 && (
                    <div>
                      <div className="text-muted-foreground">Budget / CPL</div>
                      <div className="font-medium">€{channel.budget.toFixed(0)} / €{channel.cpl}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
