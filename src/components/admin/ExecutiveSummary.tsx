import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_campaign: string | null;
}

interface CampaignBudget {
  utm_source: string[] | null;
  utm_campaign: string[] | null;
  campaign_name: string;
  budget: number;
}

interface ExecutiveSummaryProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const ExecutiveSummary = ({ submissions, budgets }: ExecutiveSummaryProps) => {
  const totalLeads = submissions.length;
  
  // Qualified = MQL + Goed + Goed - klant/Klant + Redelijk
  const qualifiedLeads = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;
  
  const conversions = submissions.filter(s => s.sales_status === 'Gesprek gepland').length;

  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';
  const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(1) : '0';

  // Campaign type performance
  const typeStats = submissions.reduce((acc, sub) => {
    if (!acc[sub.type]) {
      acc[sub.type] = { total: 0, qualified: 0, salesQualified: 0 };
    }
    acc[sub.type].total++;
    // Qualified includes MQL
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[sub.type].qualified++;
    }
    // Sales Qualified excludes MQL (for CPSQL calculation)
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[sub.type].salesQualified++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number; salesQualified: number }>);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      stalen: 'Stalen',
      renderboek: 'Collection Lookbook',
      keukentrends: 'Keukentrends',
      korting: 'Korting'
    };
    return labels[type] || type;
  };

  // Get budget for a campaign type by matching utm_campaign from submissions
  const getTypeBudget = (type: string) => {
    // Get all unique utm_campaign values for this type
    const campaignsForType = submissions
      .filter(s => s.type === type && s.utm_campaign)
      .map(s => s.utm_campaign as string);
    
    const uniqueCampaigns = [...new Set(campaignsForType)];
    
    // Find budgets that include any of these campaigns
    const relevantBudgets = budgets.filter(b => 
      b.utm_campaign?.some(campaign => uniqueCampaigns.includes(campaign))
    );
    
    // Deduplicate by campaign_name to avoid counting same campaign with multiple sources (fb+ig) twice
    const uniqueBudgets = relevantBudgets.reduce((acc, budget) => {
      if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
        acc.push(budget);
      }
      return acc;
    }, [] as CampaignBudget[]);
    
    return uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">All form submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{qualifiedLeads}</div>
            <Badge variant="secondary" className="mt-2">{qualificationRate}% qualification rate</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{conversions}</div>
            <Badge variant="secondary" className="mt-2">{conversionRate}% conversion rate</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Type Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(typeStats).map(([type, stats]) => {
              const qualRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(0) : '0';
              const percentage = totalLeads > 0 ? ((stats.total / totalLeads) * 100).toFixed(0) : '0';
              const budget = getTypeBudget(type);
              const cpl = budget > 0 && stats.total > 0 ? (budget / stats.total).toFixed(2) : '0';
              const cpsql = budget > 0 && stats.salesQualified > 0 ? (budget / stats.salesQualified).toFixed(2) : '0';
              
              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">{getTypeLabel(type)}</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stats.qualified} qualified ({qualRate}%)
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{percentage}% of total</Badge>
                  </div>
                  {budget > 0 && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <div>CPL: €{cpl}</div>
                      <div>CPSQL: €{cpsql}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
