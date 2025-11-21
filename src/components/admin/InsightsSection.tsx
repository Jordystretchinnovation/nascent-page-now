import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Award, Mail, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

interface CampaignBudget {
  campaign_name: string;
  utm_source: string[] | null;
  utm_campaign: string[] | null;
  budget: number;
  emails_sent: number | null;
  open_rate: number | null;
  click_rate: number | null;
}

interface InsightsSectionProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const InsightsSection = ({ submissions, budgets }: InsightsSectionProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  
  const emailSources = ['email', 'activecampaign', 'lemlist', 'mailchimp', 'sendgrid', 'hubspot'];
  
  const isEmailSource = (source: string | null): boolean => {
    if (!source) return false;
    const lowerSource = source.toLowerCase();
    return emailSources.some(emailSource => lowerSource.includes(emailSource));
  };

  // Best Channel Analysis
  const nonEmailSubmissions = submissions.filter(sub => !isEmailSource(sub.utm_source));
  const channelStats = nonEmailSubmissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Unknown';
    if (!acc[source]) {
      acc[source] = { total: 0, qualified: 0, salesQualified: 0, conversions: 0 };
    }
    acc[source].total++;
    // Qualified includes MQL
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[source].qualified++;
    }
    // Sales Qualified excludes MQL and keukentrends
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) && sub.type !== 'keukentrends') {
      acc[source].salesQualified++;
    }
    if (sub.sales_status === 'Gesprek gepland') {
      acc[source].conversions++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number; salesQualified: number; conversions: number }>);

  const channelsWithMetrics = Object.entries(channelStats)
    .map(([source, stats]) => {
      const relevantBudgets = budgets.filter(b => b.utm_source?.includes(source));
      const uniqueBudgets = relevantBudgets.reduce((acc, budget) => {
        if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
          acc.push(budget);
        }
        return acc;
      }, [] as CampaignBudget[]);
      
      const channelBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
      const qualRate = stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0;
      const sqlRate = stats.total > 0 ? (stats.salesQualified / stats.total) * 100 : 0;
      const cpl = channelBudget > 0 ? channelBudget / stats.total : 0;
      const cpsql = channelBudget > 0 && stats.salesQualified > 0 ? channelBudget / stats.salesQualified : 0;
      const score = sqlRate * Math.log(stats.salesQualified + 1);
      
      return { source, ...stats, budget: channelBudget, qualRate, sqlRate, cpl, cpsql, score };
    })
    .filter(c => c.total >= 5)
    .sort((a, b) => b.score - a.score);

  const topChannels = channelsWithMetrics.slice(0, 3);

  // Best Campaign Analysis (paid campaigns only, exclude email)
  const campaignStats = nonEmailSubmissions.reduce((acc, sub) => {
    const campaign = sub.utm_campaign || 'Unknown';
    if (!acc[campaign]) {
      acc[campaign] = { total: 0, qualified: 0, salesQualified: 0, conversions: 0 };
    }
    acc[campaign].total++;
    // Qualified includes MQL
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].qualified++;
    }
    // Sales Qualified excludes MQL and keukentrends
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) && sub.type !== 'keukentrends') {
      acc[campaign].salesQualified++;
    }
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].conversions++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number; salesQualified: number; conversions: number }>);

  const campaignsWithMetrics = Object.entries(campaignStats)
    .map(([campaign, stats]) => {
      const relevantBudgets = budgets.filter(b => b.utm_campaign?.includes(campaign));
      const uniqueBudgets = relevantBudgets.reduce((acc, budget) => {
        if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
          acc.push(budget);
        }
        return acc;
      }, [] as CampaignBudget[]);
      
      const campaignBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
      const qualRate = stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0;
      const sqlRate = stats.total > 0 ? (stats.salesQualified / stats.total) * 100 : 0;
      const convRate = stats.total > 0 ? (stats.conversions / stats.total) * 100 : 0;
      const score = sqlRate * Math.log(stats.salesQualified + 1);
      
      return { campaign, ...stats, budget: campaignBudget, qualRate, sqlRate, convRate, score };
    })
    .filter(c => c.total >= 5)
    .sort((a, b) => b.score - a.score);

  const topCampaigns = campaignsWithMetrics.slice(0, 3);

  // Best Lead Magnet Type Analysis
  const typeStats = submissions.reduce((acc, sub) => {
    if (!acc[sub.type]) {
      acc[sub.type] = { total: 0, qualified: 0, salesQualified: 0 };
    }
    acc[sub.type].total++;
    // Qualified includes MQL
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[sub.type].qualified++;
    }
    // Sales Qualified excludes MQL and keukentrends
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) && sub.type !== 'keukentrends') {
      acc[sub.type].salesQualified++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number; salesQualified: number }>);

  const typesWithMetrics = Object.entries(typeStats)
    .map(([type, stats]) => {
      const qualRate = stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0;
      const sqlRate = stats.total > 0 ? (stats.salesQualified / stats.total) * 100 : 0;
      const score = sqlRate * Math.log(stats.salesQualified + 1);
      return { type, ...stats, qualRate, sqlRate, score };
    })
    .filter(t => t.total >= 5)
    .sort((a, b) => b.score - a.score);

  const bestLeadMagnet = typesWithMetrics[0];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      stalen: 'Stalen',
      renderboek: 'Collection Lookbook',
      keukentrends: 'Keukentrends',
      korting: 'Korting'
    };
    return labels[type] || type;
  };

  // Email Campaign Insights
  const emailBudgets = budgets.filter(b => 
    b.utm_source?.some(source => isEmailSource(source)) && b.emails_sent && b.emails_sent > 0
  );
  
  const totalEmailsSent = emailBudgets.reduce((sum, b) => sum + (b.emails_sent || 0), 0);
  const avgOpenRate = emailBudgets.length > 0 
    ? emailBudgets.reduce((sum, b) => sum + (b.open_rate || 0), 0) / emailBudgets.length 
    : 0;
  const avgClickRate = emailBudgets.length > 0 
    ? emailBudgets.reduce((sum, b) => sum + (b.click_rate || 0), 0) / emailBudgets.length 
    : 0;

  const emailSubmissions = submissions.filter(sub => isEmailSource(sub.utm_source));
  const emailLeads = emailSubmissions.length;
  const emailQualified = emailSubmissions.filter(s => 
    s.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;

  // CPL Evolution Over Time
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Filter submissions by selected campaign if not "all"
  const filteredSubmissionsForCPL = selectedCampaign === "all" 
    ? sortedSubmissions.filter(sub => !isEmailSource(sub.utm_source))
    : sortedSubmissions.filter(sub => 
        sub.utm_campaign === selectedCampaign && !isEmailSource(sub.utm_source)
      );

  // Get unique campaigns for filter dropdown (paid campaigns only)
  const uniqueCampaigns = [...new Set(
    submissions
      .filter(sub => sub.utm_campaign && !isEmailSource(sub.utm_source))
      .map(sub => sub.utm_campaign as string)
  )].sort();

  const weeklyData = filteredSubmissionsForCPL.reduce((acc, sub) => {
    const date = new Date(sub.created_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!acc[weekKey]) {
      acc[weekKey] = { leads: 0, budget: 0 };
    }
    acc[weekKey].leads++;

    // Find budget for this submission
    const campaign = sub.utm_campaign;
    if (campaign) {
      const relevantBudgets = budgets.filter(b => b.utm_campaign?.includes(campaign));
      const uniqueBudgets = relevantBudgets.reduce((uniqueAcc, budget) => {
        if (!uniqueAcc.some(b => b.campaign_name === budget.campaign_name)) {
          uniqueAcc.push(budget);
        }
        return uniqueAcc;
      }, [] as CampaignBudget[]);
      
      const weekBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
      acc[weekKey].budget += weekBudget / (relevantBudgets.length || 1);
    }

    return acc;
  }, {} as Record<string, { leads: number; budget: number }>);

  const cplTrendData = Object.entries(weeklyData)
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cpl: data.leads > 0 ? data.budget / data.leads : 0
    }))
    .filter(d => d.cpl > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Key Insights</h2>

      <div className="space-y-6">
        {/* Top 3 Channels */}
        {topChannels.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topChannels.map((channel, index) => (
                <Card key={channel.source}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <Badge variant="outline">{channel.score.toFixed(1)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-3">{channel.source}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SQL Rate</span>
                        <Badge variant="default">{channel.sqlRate.toFixed(1)}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SQL Count</span>
                        <span className="font-medium">{channel.salesQualified}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Leads</span>
                        <span className="font-medium">{channel.total}</span>
                      </div>
                      {channel.budget > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">CPSQL</span>
                          <span className="font-medium">€{channel.cpsql.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Campaigns */}
        {topCampaigns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Campaigns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCampaigns.map((campaign, index) => (
                <Card key={campaign.campaign}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <Badge variant="outline">{campaign.score.toFixed(1)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold mb-3 truncate" title={campaign.campaign}>
                      {campaign.campaign}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SQL Rate</span>
                        <Badge variant="default">{campaign.sqlRate.toFixed(1)}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SQL Count</span>
                        <span className="font-medium">{campaign.salesQualified}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Conversions</span>
                        <span className="font-medium">{campaign.conversions} ({campaign.convRate.toFixed(1)}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Leads</span>
                        <span className="font-medium">{campaign.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Best Lead Magnet */}
        {bestLeadMagnet && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Best Lead Magnet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">#1</Badge>
                    <Badge variant="outline">{bestLeadMagnet.score.toFixed(1)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-3">{getTypeLabel(bestLeadMagnet.type)}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SQL Rate</span>
                      <Badge variant="default">{bestLeadMagnet.sqlRate.toFixed(1)}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SQL Count</span>
                      <span className="font-medium">{bestLeadMagnet.salesQualified}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Qual. Rate</span>
                      <span className="font-medium">{bestLeadMagnet.qualRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Leads</span>
                      <span className="font-medium">{bestLeadMagnet.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Email Campaign Performance */}
      {emailBudgets.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Email Campaign Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Emails Sent</div>
                <div className="text-2xl font-bold">{totalEmailsSent.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Avg Open Rate</div>
                <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Avg Click Rate</div>
                <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Leads Generated</div>
                <div className="text-2xl font-bold">{emailLeads}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Qualified Leads</div>
                <div className="text-2xl font-bold">{emailQualified}</div>
                <Badge variant="secondary" className="mt-1">
                  {emailLeads > 0 ? ((emailQualified / emailLeads) * 100).toFixed(1) : 0}% qual rate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CPL Trend Chart */}
      {cplTrendData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>CPL Evolution Over Time</CardTitle>
              </div>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {uniqueCampaigns.map((campaign) => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cplTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis 
                  label={{ value: 'CPL (€)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`€${value.toFixed(2)}`, 'CPL']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpl" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
