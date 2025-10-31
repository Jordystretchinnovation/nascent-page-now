import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
}

interface CampaignBudget {
  utm_campaign: string[] | null;
  utm_source: string[] | null;
  utm_medium: string[] | null;
  budget: number;
}

interface CampaignPerformanceTableProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const CampaignPerformanceTable = ({ submissions, budgets }: CampaignPerformanceTableProps) => {
  // Group submissions by campaign
  const campaignStats = submissions.reduce((acc, sub) => {
    const key = `${sub.utm_campaign || 'Unknown'}-${sub.utm_source || 'Unknown'}-${sub.utm_medium || 'Unknown'}`;
    
    if (!acc[key]) {
      acc[key] = {
        campaign: sub.utm_campaign || 'Unknown',
        source: sub.utm_source || 'Unknown',
        medium: sub.utm_medium || 'Unknown',
        total: 0,
        qualified: 0,
        goed: 0,
        mql: 0,
        redelijk: 0,
        slecht: 0,
        engaged: 0,
        conversions: 0
      };
    }
    
    acc[key].total++;
    
    if (sub.kwaliteit) {
      if (['Goed', 'Goed - klant', 'Goed - Klant'].includes(sub.kwaliteit)) {
        acc[key].qualified++;
        acc[key].goed++;
      } else if (sub.kwaliteit === 'MQL') {
        acc[key].qualified++;
        acc[key].mql++;
      } else if (sub.kwaliteit === 'Redelijk') {
        acc[key].qualified++;
        acc[key].redelijk++;
      } else if (sub.kwaliteit === 'Slecht') {
        acc[key].slecht++;
      }
    }
    
    if (sub.sales_status) {
      acc[key].engaged++;
      if (sub.sales_status === 'Gesprek gepland') {
        acc[key].conversions++;
      }
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Match budgets to campaigns
  const enhancedStats = Object.values(campaignStats).map(stat => {
    const matchingBudget = budgets.find(b => 
      b.utm_campaign?.includes(stat.campaign) && 
      b.utm_source?.includes(stat.source)
    );
    
    const budget = matchingBudget?.budget || 0;
    const cpl = budget > 0 ? budget / stat.total : 0;
    const cpql = budget > 0 && stat.qualified > 0 ? budget / stat.qualified : 0;
    
    return {
      ...stat,
      budget,
      cpl,
      cpql
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead className="text-right">Total Leads</TableHead>
                <TableHead className="text-right">Qualified</TableHead>
                <TableHead className="text-right">Qual. Rate</TableHead>
                <TableHead className="text-right">Engaged</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Budget (€)</TableHead>
                <TableHead className="text-right">CPL (€)</TableHead>
                <TableHead className="text-right">CPQL (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancedStats.map((stat, index) => {
                const qualRate = stat.total > 0 ? ((stat.qualified / stat.total) * 100).toFixed(0) : '0';
                const convRate = stat.total > 0 ? ((stat.conversions / stat.total) * 100).toFixed(1) : '0';
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stat.campaign}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{stat.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stat.medium}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{stat.total}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">{stat.qualified}</div>
                        <div className="text-xs text-muted-foreground">
                          G:{stat.goed} M:{stat.mql} R:{stat.redelijk}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={parseInt(qualRate) > 30 ? "default" : "secondary"}>
                        {qualRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{stat.engaged}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">{stat.conversions}</div>
                        <div className="text-xs text-muted-foreground">{convRate}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {stat.budget > 0 ? stat.budget.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {stat.cpl > 0 ? stat.cpl.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {stat.cpql > 0 ? stat.cpql.toFixed(2) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
