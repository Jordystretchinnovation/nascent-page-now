import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface CampaignBudget {
  campaign_name: string;
  utm_source: string[] | null;
  budget: number;
  emails_sent: number | null;
  open_rate: number | null;
  click_rate: number | null;
}

interface ChannelBreakdownProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const ChannelBreakdown = ({ submissions, budgets }: ChannelBreakdownProps) => {
  // Helper to create type counter
  const createTypeCounter = () => ({ stalen: 0, renderboek: 0, keukentrends: 0, korting: 0 });

  // Email sources to recognize
  const emailSources = ['email', 'activecampaign', 'lemlist', 'mailchimp', 'sendgrid', 'hubspot'];
  
  const isEmailSource = (source: string | null): boolean => {
    if (!source) return false;
    const lowerSource = source.toLowerCase();
    return emailSources.some(emailSource => lowerSource.includes(emailSource));
  };

  // Calculate total media budget (deduplicated by campaign_name)
  const uniqueBudgets = budgets.reduce((acc, budget) => {
    if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
      acc.push(budget);
    }
    return acc;
  }, [] as CampaignBudget[]);
  
  const totalBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);

  // Filter out email sources - they have their own table
  const nonEmailSubmissions = submissions.filter(sub => 
    !isEmailSource(sub.utm_source)
  );

  // Group by source (channel) with type tracking
  const channelStats = nonEmailSubmissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Unknown';
    
    if (!acc[source]) {
      acc[source] = { 
        total: 0, 
        qualified: 0, 
        salesQualified: 0, 
        conversions: 0,
        byType: createTypeCounter(),
        qualifiedByType: createTypeCounter(),
        sqlByType: createTypeCounter(),
        conversionsByType: createTypeCounter()
      };
    }
    
    acc[source].total++;
    
    // Track by type for total leads
    const leadType = sub.type as keyof ReturnType<typeof createTypeCounter>;
    if (leadType in acc[source].byType) {
      acc[source].byType[leadType]++;
    }
    
    // Qualified includes MQL
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[source].qualified++;
      if (leadType in acc[source].qualifiedByType) {
        acc[source].qualifiedByType[leadType]++;
      }
    }
    
    // Sales Qualified excludes MQL (for CPSQL calculation)
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[source].salesQualified++;
      if (leadType in acc[source].sqlByType) {
        acc[source].sqlByType[leadType]++;
      }
    }
    
    if (sub.sales_status === 'Gesprek gepland') {
      acc[source].conversions++;
      if (leadType in acc[source].conversionsByType) {
        acc[source].conversionsByType[leadType]++;
      }
    }
    
    return acc;
  }, {} as Record<string, { 
    total: number; 
    qualified: number; 
    salesQualified: number; 
    conversions: number;
    byType: ReturnType<typeof createTypeCounter>;
    qualifiedByType: ReturnType<typeof createTypeCounter>;
    sqlByType: ReturnType<typeof createTypeCounter>;
    conversionsByType: ReturnType<typeof createTypeCounter>;
  }>);

  // Calculate totals for each channel with budgets and email metrics
  const enhancedChannels = Object.entries(channelStats).map(([source, stats]) => {
    const relevantBudgets = budgets.filter(b => b.utm_source?.includes(source));
    
    // Deduplicate by campaign_name to avoid counting same budget twice for fb+ig
    const uniqueChannelBudgets = relevantBudgets.reduce((acc, budget) => {
      if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
        acc.push(budget);
      }
      return acc;
    }, [] as CampaignBudget[]);
    
    const channelBudget = uniqueChannelBudgets.reduce((sum, b) => sum + b.budget, 0);
    
    // Email-specific metrics
    const totalEmailsSent = uniqueChannelBudgets.reduce((sum, b) => sum + (b.emails_sent || 0), 0);
    const avgOpenRate = uniqueChannelBudgets.length > 0 
      ? uniqueChannelBudgets.reduce((sum, b) => sum + (b.open_rate || 0), 0) / uniqueChannelBudgets.length 
      : 0;
    const avgClickRate = uniqueChannelBudgets.length > 0 
      ? uniqueChannelBudgets.reduce((sum, b) => sum + (b.click_rate || 0), 0) / uniqueChannelBudgets.length 
      : 0;
    
    const qualRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(1) : '0';
    const sqlRate = stats.total > 0 ? ((stats.salesQualified / stats.total) * 100).toFixed(1) : '0';
    const convRate = stats.total > 0 ? ((stats.conversions / stats.total) * 100).toFixed(1) : '0';
    
    // Use channel budget for cost calculations
    const cpl = channelBudget > 0 ? (channelBudget / stats.total).toFixed(2) : '0';
    const cpql = channelBudget > 0 && stats.qualified > 0 ? (channelBudget / stats.qualified).toFixed(2) : '0';
    const cpsql = channelBudget > 0 && stats.salesQualified > 0 ? (channelBudget / stats.salesQualified).toFixed(2) : '0';
    
    return {
      source,
      total: stats.total,
      qualified: stats.qualified,
      salesQualified: stats.salesQualified,
      conversions: stats.conversions,
      byType: stats.byType,
      qualifiedByType: stats.qualifiedByType,
      sqlByType: stats.sqlByType,
      conversionsByType: stats.conversionsByType,
      channelBudget, // Budget specific to this channel
      qualRate: parseFloat(qualRate),
      sqlRate: parseFloat(sqlRate),
      convRate: parseFloat(convRate),
      cpl: parseFloat(cpl),
      cpql: parseFloat(cpql),
      cpsql: parseFloat(cpsql),
      emailsSent: totalEmailsSent,
      openRate: avgOpenRate,
      clickRate: avgClickRate,
      isEmail: source.toLowerCase() === 'email'
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Paid Channel Analysis</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Channels Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedChannels.map((channel) => (
              <div key={channel.source} className="border rounded-lg p-4">
                <div className="font-semibold text-lg mb-3">{channel.source}</div>
                
                {/* Main metrics in a grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                    <div className="text-2xl font-bold">{channel.total}</div>
                    <div className="text-xs text-muted-foreground">
                      S:{channel.byType.stalen} L:{channel.byType.renderboek} T:{channel.byType.keukentrends} K:{channel.byType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                    <div className="text-xl font-bold">{channel.qualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {channel.qualRate.toFixed(0)}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{channel.qualifiedByType.stalen} L:{channel.qualifiedByType.renderboek} T:{channel.qualifiedByType.keukentrends} K:{channel.qualifiedByType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SQL</div>
                    <div className="text-xl font-bold">{channel.salesQualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {channel.sqlRate.toFixed(0)}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{channel.sqlByType.stalen} L:{channel.sqlByType.renderboek} T:{channel.sqlByType.keukentrends} K:{channel.sqlByType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                    <div className="text-xl font-bold">{channel.conversions}</div>
                    <div className="text-xs text-muted-foreground">
                      {channel.convRate}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{channel.conversionsByType.stalen} L:{channel.conversionsByType.renderboek} T:{channel.conversionsByType.keukentrends} K:{channel.conversionsByType.korting}
                    </div>
                  </div>
                </div>

                {/* Cost metrics or Email metrics */}
                {channel.isEmail && channel.emailsSent > 0 ? (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Emails Sent</div>
                      <div className="text-sm font-medium">{channel.emailsSent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Open Rate</div>
                      <div className="text-sm font-medium">{channel.openRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Click Rate</div>
                      <div className="text-sm font-medium">{channel.clickRate.toFixed(1)}%</div>
                    </div>
                  </div>
                ) : channel.channelBudget > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">CPL</div>
                      <div className="text-sm font-medium">€{channel.cpl}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">CPQL</div>
                      <div className="text-sm font-medium">€{channel.cpql}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">CPSQL</div>
                      <div className="text-sm font-medium">€{channel.cpsql}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Channel Budget</div>
                      <div className="text-sm font-medium">€{channel.channelBudget.toFixed(0)}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
