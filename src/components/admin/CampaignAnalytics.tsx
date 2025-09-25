import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FormSubmission {
  id: string;
  type: string;
  kwaliteit: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface CampaignAnalyticsProps {
  submissions: FormSubmission[];
}

const CampaignAnalytics = ({ submissions }: CampaignAnalyticsProps) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stalen':
        return 'Stalen';
      case 'renderboek':
        return 'Collection Lookbook';
      case 'korting':
        return 'Korting';
      case 'keukentrends':
        return 'Keukentrends';
      default:
        return type;
    }
  };

  const getQualityLabel = (quality: string | null) => {
    if (!quality) return 'Ongekwalificeerd';
    return quality;
  };

  // Channel Analysis (UTM Source)
  const getChannelAnalysisData = () => {
    const channelStats = submissions.reduce((acc, sub) => {
      const channel = sub.utm_source || 'Onbekend';
      const type = getTypeLabel(sub.type);
      const quality = getQualityLabel(sub.kwaliteit);
      
      if (!acc[channel]) {
        acc[channel] = { channel, total: 0, types: {}, qualities: {} };
      }
      
      acc[channel].total += 1;
      acc[channel].types[type] = (acc[channel].types[type] || 0) + 1;
      acc[channel].qualities[quality] = (acc[channel].qualities[quality] || 0) + 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(channelStats).sort((a: any, b: any) => b.total - a.total);
  };

  // Medium Analysis (UTM Medium)
  const getMediumAnalysisData = () => {
    const mediumStats = submissions.reduce((acc, sub) => {
      const medium = sub.utm_medium || 'Onbekend';
      const type = getTypeLabel(sub.type);
      const quality = getQualityLabel(sub.kwaliteit);
      
      if (!acc[medium]) {
        acc[medium] = { medium, total: 0, types: {}, qualities: {} };
      }
      
      acc[medium].total += 1;
      acc[medium].types[type] = (acc[medium].types[type] || 0) + 1;
      acc[medium].qualities[quality] = (acc[medium].qualities[quality] || 0) + 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(mediumStats).sort((a: any, b: any) => b.total - a.total);
  };

  // Campaign Analysis (UTM Campaign)
  const getCampaignAnalysisData = () => {
    const campaignStats = submissions.reduce((acc, sub) => {
      const campaign = sub.utm_campaign || 'Onbekend';
      const type = getTypeLabel(sub.type);
      const quality = getQualityLabel(sub.kwaliteit);
      
      if (!acc[campaign]) {
        acc[campaign] = { campaign, total: 0, types: {}, qualities: {} };
      }
      
      acc[campaign].total += 1;
      acc[campaign].types[type] = (acc[campaign].types[type] || 0) + 1;
      acc[campaign].qualities[quality] = (acc[campaign].qualities[quality] || 0) + 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(campaignStats).sort((a: any, b: any) => b.total - a.total);
  };

  const chartConfig = {
    total: {
      label: "Totaal Leads",
      color: "hsl(var(--primary))",
    },
  };

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--destructive))",
    "hsl(var(--muted))",
    "hsl(var(--accent))",
  ];

  const channelData = getChannelAnalysisData();
  const mediumData = getMediumAnalysisData();
  const campaignData = getCampaignAnalysisData();

  const renderAnalysisTable = (data: any[], keyField: string, title: string) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campagne</TableHead>
                <TableHead className="text-right">Totaal Leads</TableHead>
                <TableHead>Lead Magnet Types</TableHead>
                <TableHead>Kwaliteit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item[keyField] || 'Onbekend'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{item.total}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.types).map(([type, count]) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}: {count as number}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.qualities).map(([quality, count]) => (
                        <Badge 
                          key={quality} 
                          variant={quality === 'Goed' || quality === 'Goed - Klant' ? 'default' : 
                                  quality === 'Redelijk' ? 'secondary' : 
                                  quality === 'Slecht' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {quality}: {count as number}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Channel Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Analyse (UTM Source)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium mb-2">{label}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Totaal: {data.total} leads
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Per type:</p>
                              {Object.entries(data.types).map(([type, count]) => (
                                <p key={type} className="text-xs">
                                  {type}: {count as number}
                                </p>
                              ))}
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-xs font-medium">Per kwaliteit:</p>
                              {Object.entries(data.qualities).map(([quality, count]) => (
                                <p key={quality} className="text-xs">
                                  {quality}: {count as number}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" radius={[2, 2, 0, 0]}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Medium Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Medium Analyse (UTM Medium)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mediumData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="medium" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium mb-2">{label}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Totaal: {data.total} leads
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Per type:</p>
                              {Object.entries(data.types).map(([type, count]) => (
                                <p key={type} className="text-xs">
                                  {type}: {count as number}
                                </p>
                              ))}
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-xs font-medium">Per kwaliteit:</p>
                              {Object.entries(data.qualities).map(([quality, count]) => (
                                <p key={quality} className="text-xs">
                                  {quality}: {count as number}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" radius={[2, 2, 0, 0]}>
                    {mediumData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Analysis - Table Format */}
      {renderAnalysisTable(campaignData, 'campaign', 'Campagne Analyse (UTM Campaign)')}
    </div>
  );
};

export default CampaignAnalytics;