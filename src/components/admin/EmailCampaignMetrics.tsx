import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface Submission {
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  type: string;
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

  // Type tracking helper
  const createTypeCounter = () => ({ stalen: 0, renderboek: 0, keukentrends: 0, korting: 0 });

  // Group email submissions by campaign
  const emailCampaignStats = emailSubmissions.reduce((acc, sub) => {
    const campaign = sub.utm_campaign || 'Unknown';
    
    if (!acc[campaign]) {
      acc[campaign] = {
        total: 0,
        qualified: 0,
        sql: 0,
        conversions: 0,
        byType: createTypeCounter(),
        qualifiedByType: createTypeCounter(),
        sqlByType: createTypeCounter(),
        conversionsByType: createTypeCounter(),
        byTerm: {} as Record<string, { 
          total: number; 
          qualified: number; 
          sql: number; 
          conversions: number;
          byType: ReturnType<typeof createTypeCounter>;
          qualifiedByType: ReturnType<typeof createTypeCounter>;
          sqlByType: ReturnType<typeof createTypeCounter>;
          conversionsByType: ReturnType<typeof createTypeCounter>;
        }>
      };
    }
    
    acc[campaign].total++;
    
    // Track by type for total leads
    const leadType = sub.type as keyof ReturnType<typeof createTypeCounter>;
    if (leadType in acc[campaign].byType) {
      acc[campaign].byType[leadType]++;
    }
    
    // Qualified includes MQL, Goed, Redelijk
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].qualified++;
      if (leadType in acc[campaign].qualifiedByType) {
        acc[campaign].qualifiedByType[leadType]++;
      }
    }
    
    // SQL includes only Goed and Redelijk (excludes MQL)
    // Exclude keukentrends leads from SQL count
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) && sub.type !== 'keukentrends') {
      acc[campaign].sql++;
      if (leadType in acc[campaign].sqlByType) {
        acc[campaign].sqlByType[leadType]++;
      }
    }
    
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].conversions++;
      if (leadType in acc[campaign].conversionsByType) {
        acc[campaign].conversionsByType[leadType]++;
      }
    }

    // Track by utm_term
    const term = sub.utm_term || 'No term';
    if (!acc[campaign].byTerm[term]) {
      acc[campaign].byTerm[term] = { 
        total: 0, 
        qualified: 0, 
        sql: 0, 
        conversions: 0,
        byType: createTypeCounter(),
        qualifiedByType: createTypeCounter(),
        sqlByType: createTypeCounter(),
        conversionsByType: createTypeCounter()
      };
    }
    acc[campaign].byTerm[term].total++;
    if (leadType in acc[campaign].byTerm[term].byType) {
      acc[campaign].byTerm[term].byType[leadType]++;
    }
    
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].byTerm[term].qualified++;
      if (leadType in acc[campaign].byTerm[term].qualifiedByType) {
        acc[campaign].byTerm[term].qualifiedByType[leadType]++;
      }
    }
    // Exclude keukentrends leads from SQL count
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) && sub.type !== 'keukentrends') {
      acc[campaign].byTerm[term].sql++;
      if (leadType in acc[campaign].byTerm[term].sqlByType) {
        acc[campaign].byTerm[term].sqlByType[leadType]++;
      }
    }
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].byTerm[term].conversions++;
      if (leadType in acc[campaign].byTerm[term].conversionsByType) {
        acc[campaign].byTerm[term].conversionsByType[leadType]++;
      }
    }
    
    return acc;
  }, {} as Record<string, { 
    total: number; 
    qualified: number; 
    sql: number; 
    conversions: number; 
    byType: ReturnType<typeof createTypeCounter>;
    qualifiedByType: ReturnType<typeof createTypeCounter>;
    sqlByType: ReturnType<typeof createTypeCounter>;
    conversionsByType: ReturnType<typeof createTypeCounter>;
    byTerm: Record<string, { 
      total: number; 
      qualified: number; 
      sql: number; 
      conversions: number;
      byType: ReturnType<typeof createTypeCounter>;
      qualifiedByType: ReturnType<typeof createTypeCounter>;
      sqlByType: ReturnType<typeof createTypeCounter>;
      conversionsByType: ReturnType<typeof createTypeCounter>;
    }> 
  }>);

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
      byType: stats.byType,
      qualifiedByType: stats.qualifiedByType,
      sqlByType: stats.sqlByType,
      conversionsByType: stats.conversionsByType,
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
                    <div className="text-xs text-muted-foreground">
                      S:{campaign.byType.stalen} L:{campaign.byType.renderboek} T:{campaign.byType.keukentrends} K:{campaign.byType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                    <div className="text-xl font-bold">{campaign.qualified}</div>
                    <div className="text-xs text-muted-foreground">
                      {qualRate}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{campaign.qualifiedByType.stalen} L:{campaign.qualifiedByType.renderboek} T:{campaign.qualifiedByType.keukentrends} K:{campaign.qualifiedByType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SQL</div>
                    <div className="text-xl font-bold">{campaign.sql}</div>
                    <div className="text-xs text-muted-foreground">
                      {sqlRate}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{campaign.sqlByType.stalen} L:{campaign.sqlByType.renderboek} T:{campaign.sqlByType.keukentrends} K:{campaign.sqlByType.korting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                    <div className="text-xl font-bold">{campaign.conversions}</div>
                    <div className="text-xs text-muted-foreground">
                      {convRate}% of total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S:{campaign.conversionsByType.stalen} L:{campaign.conversionsByType.renderboek} T:{campaign.conversionsByType.keukentrends} K:{campaign.conversionsByType.korting}
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
                                  <div className="text-muted-foreground text-[10px]">
                                    S:{stats.byType.stalen} L:{stats.byType.renderboek} T:{stats.byType.keukentrends} K:{stats.byType.korting}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Qualified</div>
                                  <div className="font-semibold">{stats.qualified} ({termQualRate}%)</div>
                                  <div className="text-muted-foreground text-[10px]">
                                    S:{stats.qualifiedByType.stalen} L:{stats.qualifiedByType.renderboek} T:{stats.qualifiedByType.keukentrends} K:{stats.qualifiedByType.korting}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">SQL</div>
                                  <div className="font-semibold">{stats.sql} ({termSqlRate}%)</div>
                                  <div className="text-muted-foreground text-[10px]">
                                    S:{stats.sqlByType.stalen} L:{stats.sqlByType.renderboek} T:{stats.sqlByType.keukentrends} K:{stats.sqlByType.korting}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Conv</div>
                                  <div className="font-semibold">{stats.conversions} ({termConvRate}%)</div>
                                  <div className="text-muted-foreground text-[10px]">
                                    S:{stats.conversionsByType.stalen} L:{stats.conversionsByType.renderboek} T:{stats.conversionsByType.keukentrends} K:{stats.conversionsByType.korting}
                                  </div>
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