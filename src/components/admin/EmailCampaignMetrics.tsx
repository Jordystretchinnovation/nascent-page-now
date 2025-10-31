import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
        conversions: 0
      };
    }
    
    acc[campaign].total++;
    
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[campaign].qualified++;
    }
    
    if (sub.sales_status === 'Gesprek gepland') {
      acc[campaign].conversions++;
    }
    
    return acc;
  }, {} as Record<string, { total: number; qualified: number; conversions: number }>);

  // Enhance with budget data
  const enhancedEmailCampaigns = Object.entries(emailCampaignStats).map(([campaign, stats]) => {
    const campaignBudget = emailBudgets.find(b => 
      b.utm_campaign?.includes(campaign)
    );
    
    const emailsSent = campaignBudget?.emails_sent || 0;
    const openRate = campaignBudget?.open_rate || 0;
    const clickRate = campaignBudget?.click_rate || 0;
    
    const qualRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100) : 0;
    const convRate = stats.total > 0 ? ((stats.conversions / stats.total) * 100) : 0;
    
    // Calculate email-specific metrics
    const emailToLeadRate = emailsSent > 0 ? ((stats.total / emailsSent) * 100) : 0;
    const clickToLeadRate = (emailsSent > 0 && clickRate > 0) 
      ? ((stats.total / (emailsSent * (clickRate / 100))) * 100) 
      : 0;
    
    return {
      campaign: campaign,
      campaignName: campaignBudget?.campaign_name || campaign,
      emailsSent,
      openRate,
      clickRate,
      leads: stats.total,
      qualified: stats.qualified,
      conversions: stats.conversions,
      qualRate,
      convRate,
      emailToLeadRate,
      clickToLeadRate
    };
  }).sort((a, b) => b.leads - a.leads);

  // Calculate totals
  const totals = enhancedEmailCampaigns.reduce((acc, campaign) => ({
    emailsSent: acc.emailsSent + campaign.emailsSent,
    leads: acc.leads + campaign.leads,
    qualified: acc.qualified + campaign.qualified,
    conversions: acc.conversions + campaign.conversions
  }), {
    emailsSent: 0,
    leads: 0,
    qualified: 0,
    conversions: 0
  });

  const avgOpenRate = enhancedEmailCampaigns.length > 0
    ? enhancedEmailCampaigns.reduce((sum, c) => sum + c.openRate, 0) / enhancedEmailCampaigns.length
    : 0;
  
  const avgClickRate = enhancedEmailCampaigns.length > 0
    ? enhancedEmailCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / enhancedEmailCampaigns.length
    : 0;

  const totalQualRate = totals.leads > 0 ? ((totals.qualified / totals.leads) * 100) : 0;
  const totalConvRate = totals.leads > 0 ? ((totals.conversions / totals.leads) * 100) : 0;
  const totalEmailToLeadRate = totals.emailsSent > 0 ? ((totals.leads / totals.emailsSent) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Email Campaign Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Emails Sent</TableHead>
                <TableHead className="text-right">Open Rate</TableHead>
                <TableHead className="text-right">Click Rate</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Email→Lead</TableHead>
                <TableHead className="text-right">Qualified</TableHead>
                <TableHead className="text-right">Qual. Rate</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancedEmailCampaigns.map((campaign, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.campaignName}</div>
                      {campaign.campaign !== campaign.campaignName && (
                        <div className="text-xs text-muted-foreground">{campaign.campaign}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.emailsSent > 0 ? campaign.emailsSent.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.openRate > 0 ? (
                      <Badge variant="secondary">{campaign.openRate.toFixed(1)}%</Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.clickRate > 0 ? (
                      <Badge variant="secondary">{campaign.clickRate.toFixed(1)}%</Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.leads}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.emailToLeadRate > 0 ? (
                      <span className="text-sm">{campaign.emailToLeadRate.toFixed(2)}%</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.qualified}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={campaign.qualRate > 30 ? "default" : "secondary"}>
                      {campaign.qualRate.toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <div className="font-medium">{campaign.conversions}</div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.convRate.toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals Row */}
              <TableRow className="font-bold bg-primary/5 border-t-2">
                <TableCell className="font-bold">TOTAL</TableCell>
                <TableCell className="text-right">
                  {totals.emailsSent > 0 ? totals.emailsSent.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {avgOpenRate > 0 ? (
                    <Badge variant="secondary">{avgOpenRate.toFixed(1)}%</Badge>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {avgClickRate > 0 ? (
                    <Badge variant="secondary">{avgClickRate.toFixed(1)}%</Badge>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {totals.leads}
                </TableCell>
                <TableCell className="text-right">
                  {totalEmailToLeadRate > 0 ? (
                    <span className="text-sm">{totalEmailToLeadRate.toFixed(2)}%</span>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {totals.qualified}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={totalQualRate > 30 ? "default" : "secondary"}>
                    {totalQualRate.toFixed(0)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-bold">{totals.conversions}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {totalConvRate.toFixed(1)}%
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};