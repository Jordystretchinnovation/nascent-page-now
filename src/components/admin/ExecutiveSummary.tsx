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
  // Helper to create type counter
  const createTypeCounter = () => ({ stalen: 0, renderboek: 0, keukentrends: 0, korting: 0 });
  
  const totalLeads = submissions.length;
  
  // Track by type for all metrics
  const totalByType = createTypeCounter();
  const qualifiedByType = createTypeCounter();
  const sqlByType = createTypeCounter();
  const conversionsByType = createTypeCounter();
  
  submissions.forEach(s => {
    const leadType = s.type as keyof ReturnType<typeof createTypeCounter>;
    if (leadType in totalByType) {
      totalByType[leadType]++;
    }
    
    // Qualified = MQL + Goed + Goed - klant/Klant + Redelijk
    if (s.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)) {
      if (leadType in qualifiedByType) {
        qualifiedByType[leadType]++;
      }
    }
    
    // SQL (Sales Qualified Leads) = Goed + Goed - klant/Klant + Redelijk (without MQL)
    if (s.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)) {
      if (leadType in sqlByType) {
        sqlByType[leadType]++;
      }
    }
    
    if (s.sales_status === 'Gesprek gepland') {
      if (leadType in conversionsByType) {
        conversionsByType[leadType]++;
      }
    }
  });
  
  // Qualified = MQL + Goed + Goed - klant/Klant + Redelijk
  const qualifiedLeads = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;
  
  // SQL (Sales Qualified Leads) = Goed + Goed - klant/Klant + Redelijk (without MQL)
  const sqlLeads = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;
  
  const conversions = submissions.filter(s => s.sales_status === 'Gesprek gepland').length;

  // Calculate total media budget (deduplicated by campaign_name)
  const uniqueBudgets = budgets.reduce((acc, budget) => {
    if (!acc.some(b => b.campaign_name === budget.campaign_name)) {
      acc.push(budget);
    }
    return acc;
  }, [] as CampaignBudget[]);
  
  const totalBudget = uniqueBudgets.reduce((sum, b) => sum + b.budget, 0);
  
  // Cost metrics using total budget
  const cpl = totalBudget > 0 && totalLeads > 0 ? (totalBudget / totalLeads).toFixed(2) : '0';
  const cpql = totalBudget > 0 && qualifiedLeads > 0 ? (totalBudget / qualifiedLeads).toFixed(2) : '0';
  const cpsql = totalBudget > 0 && sqlLeads > 0 ? (totalBudget / sqlLeads).toFixed(2) : '0';

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
            <div className="text-xs text-muted-foreground mt-1">
              S:{totalByType.stalen} L:{totalByType.renderboek} T:{totalByType.keukentrends} K:{totalByType.korting}
            </div>
            {totalBudget > 0 && (
              <div className="text-xs font-medium mt-2">CPL: €{cpl}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{qualifiedLeads}</div>
            <Badge variant="secondary" className="mt-2">{qualificationRate}% of total</Badge>
            <div className="text-xs text-muted-foreground mt-1">
              S:{qualifiedByType.stalen} L:{qualifiedByType.renderboek} T:{qualifiedByType.keukentrends} K:{qualifiedByType.korting}
            </div>
            {totalBudget > 0 && (
              <div className="text-xs font-medium mt-2">CPQL: €{cpql}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SQL (Sales Qualified)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sqlLeads}</div>
            <Badge variant="secondary" className="mt-2">{sqlRate}% of total</Badge>
            <div className="text-xs text-muted-foreground mt-1">
              S:{sqlByType.stalen} L:{sqlByType.renderboek} T:{sqlByType.keukentrends} K:{sqlByType.korting}
            </div>
            {totalBudget > 0 && (
              <div className="text-xs font-medium mt-2">CPSQL: €{cpsql}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{conversions}</div>
            <Badge variant="secondary" className="mt-2">{conversionRate}% conversion rate</Badge>
            <div className="text-xs text-muted-foreground mt-1">
              S:{conversionsByType.stalen} L:{conversionsByType.renderboek} T:{conversionsByType.keukentrends} K:{conversionsByType.korting}
            </div>
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
              // Use total budget for all types
              const typeCpl = totalBudget > 0 && stats.total > 0 ? (totalBudget / stats.total).toFixed(2) : '0';
              const typeCpql = totalBudget > 0 && stats.qualified > 0 ? (totalBudget / stats.qualified).toFixed(2) : '0';
              const typeCpsql = totalBudget > 0 && stats.salesQualified > 0 ? (totalBudget / stats.salesQualified).toFixed(2) : '0';
              
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
                  {totalBudget > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">CPL</div>
                        <div className="text-sm font-medium">€{typeCpl}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">CPQL</div>
                        <div className="text-sm font-medium">€{typeCpql}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">CPSQL</div>
                        <div className="text-sm font-medium">€{typeCpsql}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Budget</div>
                        <div className="text-sm font-medium">€{totalBudget.toFixed(0)}</div>
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
