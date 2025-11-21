import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface Submission {
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
}

interface CampaignBudget {
  campaign_name: string;
  utm_source: string[] | null;
  utm_campaign: string[] | null;
  utm_medium: string[] | null;
  budget: number;
  emails_sent: number | null;
  open_rate: number | null;
  click_rate: number | null;
}

interface EmailCampaignMetricsProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const EmailCampaignMetrics = ({ submissions, budgets }: EmailCampaignMetricsProps) => {
  // Email sources to recognize
  const emailSources = ['email', 'activecampaign', 'lemlist', 'mailchimp', 'sendgrid', 'hubspot'];
  
  const isEmailSource = (source: string | null): boolean => {
    if (!source) return false;
    const lowerSource = source.toLowerCase();
    return emailSources.some(emailSource => lowerSource.includes(emailSource));
  };

  // Filter email submissions
  const emailSubmissions = submissions.filter(sub => 
    isEmailSource(sub.utm_source)
  );

  // Filter email budgets
  const emailBudgets = budgets.filter(b => 
    b.utm_source?.some(s => isEmailSource(s))
  );

  // Show the table if there are any email submissions, even without budgets yet
  if (emailSubmissions.length === 0) {
    return null;
  }

  // Group email submissions by campaign
  const emailCampaignStats = emailSubmissions.reduce((acc, sub) => {
    const campaign = sub.utm_campaign || 'Unknown';
    
    if (!acc[campaign]) {
      acc[campaign] = {
        total: 0,
        qualified: 0,
        sql: 0,
        conversions: 0,
        byTerm: {} as Record<string, { total: number; qualified: number; sql: number; conversions: number }>
      };
    }
    
    acc[campaign].total++;
    
    // Qualified includes MQL, Goed, Redelijk
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].qualified++;
    }
    
    // SQL includes only Goed and Redelijk (excludes MQL)
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].sql++;
    }
    
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].conversions++;
    }

    // Track by utm_term
    const term = sub.utm_term || 'No term';
    if (!acc[campaign].byTerm[term]) {
      acc[campaign].byTerm[term] = { total: 0, qualified: 0, sql: 0, conversions: 0 };
    }
    acc[campaign].byTerm[term].total++;
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].byTerm[term].qualified++;
    }
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].byTerm[term].sql++;
    }
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].byTerm[term].conversions++;
    }
    
    return acc;
  }, {} as Record<string, { total: number; qualified: number; sql: number; conversions: number; byTerm: Record<string, { total: number; qualified: number; sql: number; conversions: number }> }>);

  // Enhance with budget data
  const enhancedEmailCampaigns = Object.entries(emailCampaignStats).map(([campaign, stats]) => {
    const campaignBudget = emailBudgets.find(b => 
      b.utm_campaign?.includes(campaign)
    );
    
    const emailsSent = campaignBudget?.emails_sent || 0;
    const openRate = campaignBudget?.open_rate || 0;
    const clickRate = campaignBudget?.click_rate || 0;
    
    const emailToLeadRate = emailsSent > 0 ? ((stats.total / emailsSent) * 100) : 0;
    
    return {
      campaign: campaign,
      campaignName: campaignBudget?.campaign_name || campaign,
      emailsSent,
      openRate,
      clickRate,
      emailToLeadRate,
      leads: stats.total,
      qualified: stats.qualified,
      sql: stats.sql,
      conversions: stats.conversions,
      byTerm: stats.byTerm
    };
  }).sort((a, b) => {
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
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Email Campaign Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enhancedEmailCampaigns.map((campaign) => {
            const qualRate = campaign.leads > 0 ? ((campaign.qualified / campaign.leads) * 100).toFixed(0) : '0';
            const sqlRate = campaign.leads > 0 ? ((campaign.sql / campaign.leads) * 100).toFixed(0) : '0';
            const convRate = campaign.leads > 0 ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : '0';
            
            return (
              <div key={campaign.campaign} className="border rounded-lg p-4">
                <div className="font-semibold text-lg mb-3">{campaign.campaign}</div>
                
                {/* Lead metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                    <div className="text-2xl font-bold">{campaign.leads}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                    <div className="text-xl font-bold">{campaign.qualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {qualRate}% of total
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SQL</div>
                    <div className="text-xl font-bold">{campaign.sql}</div>
                    <div className="text-xs text-muted-foreground">
                      {sqlRate}% of total
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                    <div className="text-xl font-bold">{campaign.conversions}</div>
                    <div className="text-xs text-muted-foreground">
                      {convRate}% of total
                    </div>
                  </div>
                </div>

                {/* Email metrics */}
                {campaign.emailsSent > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Emails Sent</div>
                      <div className="text-sm font-medium">{campaign.emailsSent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Open Rate</div>
                      <div className="text-sm font-medium">{campaign.openRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Click Rate</div>
                      <div className="text-sm font-medium">{campaign.clickRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email→Lead Rate</div>
                      <div className="text-sm font-medium">{campaign.emailToLeadRate.toFixed(2)}%</div>
                    </div>
                  </div>
                )}

                {/* UTM Term breakdown */}
                {Object.keys(campaign.byTerm).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">Breakdown by UTM Term</div>
                    <div className="space-y-3">
                      {Object.entries(campaign.byTerm)
                        .sort((a, b) => b[1].total - a[1].total)
                        .map(([term, stats]) => {
                          const termQualRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(0) : '0';
                          const termSqlRate = stats.total > 0 ? ((stats.sql / stats.total) * 100).toFixed(0) : '0';
                          const termConvRate = stats.total > 0 ? ((stats.conversions / stats.total) * 100).toFixed(1) : '0';
                          
                          return (
                            <div key={term} className="bg-muted/30 rounded-md p-3">
                              <div className="text-sm font-medium mb-2">{term}</div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div>
                                  <div className="text-muted-foreground">Leads</div>
                                  <div className="font-semibold">{stats.total}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Qualified</div>
                                  <div className="font-semibold">{stats.qualified} ({termQualRate}%)</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">SQL</div>
                                  <div className="font-semibold">{stats.sql} ({termSqlRate}%)</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Conv</div>
                                  <div className="font-semibold">{stats.conversions} ({termConvRate}%)</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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