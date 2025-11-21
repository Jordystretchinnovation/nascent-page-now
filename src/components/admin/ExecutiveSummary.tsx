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
  
  // SQL (Sales Qualified Leads) = Goed + Goed - klant/Klant + Redelijk (without MQL)
  const sqlLeads = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;
  
  const conversions = submissions.filter(s => s.sales_status === 'Gesprek gepland').length;

  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';
  const sqlRate = totalLeads > 0 ? ((sqlLeads / totalLeads) * 100).toFixed(1) : '0';
  const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(1) : '0';

  // Campaign type performance
  const typeStats = submissions.reduce((acc, sub) => {
    if (!acc[sub.type]) {
      acc[sub.type] = { total: 0, qualified: 0, salesQualified: 0, conversions: 0 };
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
    // Conversions
    if (sub.sales_status === 'Gesprek gepland') {
      acc[sub.type].conversions++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number; salesQualified: number; conversions: number }>);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Badge variant="secondary" className="mt-2">{qualificationRate}% of total</Badge>
            <p className="text-xs text-muted-foreground mt-1">Includes MQL</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SQL (Sales Qualified)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sqlLeads}</div>
            <Badge variant="secondary" className="mt-2">{sqlRate}% of total</Badge>
            <p className="text-xs text-muted-foreground mt-1">Goed + Redelijk</p>
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
          <div className="space-y-4">
            {Object.entries(typeStats).map(([type, stats]) => {
              const budget = getTypeBudget(type);
              const cpl = budget > 0 && stats.total > 0 ? (budget / stats.total).toFixed(2) : '0';
              const cpql = budget > 0 && stats.qualified > 0 ? (budget / stats.qualified).toFixed(2) : '0';
              const cpsql = budget > 0 && stats.salesQualified > 0 ? (budget / stats.salesQualified).toFixed(2) : '0';
              
              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="font-semibold text-lg mb-3">{getTypeLabel(type)}</div>
                  
                  {/* Main metrics in a grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Total Leads</div>
                      <div className="text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Qualified</div>
                      <div className="text-xl font-bold">{stats.qualified}</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(0) : '0'}% of total
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">SQL</div>
                      <div className="text-xl font-bold">{stats.salesQualified}</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? ((stats.salesQualified / stats.total) * 100).toFixed(0) : '0'}% of total
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                      <div className="text-xl font-bold">{stats.conversions}</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? ((stats.conversions / stats.total) * 100).toFixed(0) : '0'}% of total
                      </div>
                    </div>
                  </div>

                  {/* Cost metrics */}
                  {budget > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">CPL</div>
                        <div className="text-sm font-medium">€{cpl}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">CPQL</div>
                        <div className="text-sm font-medium">€{cpql}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">CPSQL</div>
                        <div className="text-sm font-medium">€{cpsql}</div>
                      </div>
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
