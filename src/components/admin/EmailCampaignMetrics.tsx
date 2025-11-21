import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface Submission {
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
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
        conversions: 0
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
    
    return acc;
  }, {} as Record<string, { total: number; qualified: number; sql: number; conversions: number }>);

  // Enhance with budget data
  const enhancedEmailCampaigns = Object.entries(emailCampaignStats).map(([campaign, stats]) => {
    const campaignBudget = emailBudgets.find(b => 
      b.utm_campaign?.includes(campaign)
    );
    
    return {
      campaign: campaign,
      campaignName: campaignBudget?.campaign_name || campaign,
      leads: stats.total,
      qualified: stats.qualified,
      sql: stats.sql,
      conversions: stats.conversions
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
                
                {/* Main metrics in a grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};