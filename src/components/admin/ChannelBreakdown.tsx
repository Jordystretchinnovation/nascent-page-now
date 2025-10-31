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
  emails_sent: number | null;
  open_rate: number | null;
  click_rate: number | null;
}

interface ChannelBreakdownProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const ChannelBreakdown = ({ submissions, budgets }: ChannelBreakdownProps) => {
  // Email sources to recognize
  const emailSources = ['email', 'activecampaign', 'lemlist', 'mailchimp', 'sendgrid', 'hubspot'];
  
  const isEmailSource = (source: string | null): boolean => {
    if (!source) return false;
    const lowerSource = source.toLowerCase();
    return emailSources.some(emailSource => lowerSource.includes(emailSource));
  };

  // Filter out email sources - they have their own table
  const nonEmailSubmissions = submissions.filter(sub => 
    !isEmailSource(sub.utm_source)
  );

  // Group by source (channel)
  const channelStats = nonEmailSubmissions.reduce((acc, sub) => {
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

  // Calculate totals for each channel with budgets and email metrics
  const enhancedChannels = Object.entries(channelStats).map(([source, stats]) => {
    const relevantBudgets = budgets.filter(b => b.utm_source?.includes(source));
    const channelBudget = relevantBudgets.reduce((sum, b) => sum + b.budget, 0);
    
    // Email-specific metrics
    const totalEmailsSent = relevantBudgets.reduce((sum, b) => sum + (b.emails_sent || 0), 0);
    const avgOpenRate = relevantBudgets.length > 0 
      ? relevantBudgets.reduce((sum, b) => sum + (b.open_rate || 0), 0) / relevantBudgets.length 
      : 0;
    const avgClickRate = relevantBudgets.length > 0 
      ? relevantBudgets.reduce((sum, b) => sum + (b.click_rate || 0), 0) / relevantBudgets.length 
      : 0;
    
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
      cpql: parseFloat(cpql),
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
                  {channel.isEmail && channel.emailsSent > 0 ? (
                    <>
                      <div>
                        <div className="text-muted-foreground">Emails Sent</div>
                        <div className="font-medium">{channel.emailsSent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Open Rate</div>
                        <div className="font-medium">{channel.openRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Click Rate</div>
                        <div className="font-medium">{channel.clickRate.toFixed(1)}%</div>
                      </div>
                    </>
                  ) : channel.budget > 0 ? (
                    <div>
                      <div className="text-muted-foreground">Budget / CPL</div>
                      <div className="font-medium">€{channel.budget.toFixed(0)} / €{channel.cpl}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
