import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
}

interface ExecutiveSummaryProps {
  submissions: Submission[];
}

export const ExecutiveSummary = ({ submissions }: ExecutiveSummaryProps) => {
  const totalLeads = submissions.length;
  
  const qualifiedLeads = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit)
  ).length;
  
  const conversions = submissions.filter(s => s.sales_status === 'Gesprek gepland').length;

  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';
  const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(1) : '0';

  // Campaign type performance
  const typeStats = submissions.reduce((acc, sub) => {
    if (!acc[sub.type]) {
      acc[sub.type] = { total: 0, qualified: 0 };
    }
    acc[sub.type].total++;
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[sub.type].qualified++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number }>);

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
              
              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">{getTypeLabel(type)}</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stats.qualified} qualified ({qualRate}%)
                  </div>
                  <Badge variant="outline" className="mt-2">{percentage}% of total</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
