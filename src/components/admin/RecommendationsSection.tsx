import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface Submission {
  type: string;
  kwaliteit: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
}

interface CampaignBudget {
  utm_source: string[] | null;
  utm_campaign: string[] | null;
  budget: number;
}

interface RecommendationsSectionProps {
  submissions: Submission[];
  budgets: CampaignBudget[];
}

export const RecommendationsSection = ({ submissions, budgets }: RecommendationsSectionProps) => {
  // Analyze what worked well
  const typePerformance = submissions.reduce((acc, sub) => {
    if (!acc[sub.type]) {
      acc[sub.type] = { total: 0, qualified: 0 };
    }
    acc[sub.type].total++;
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[sub.type].qualified++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number }>);

  const bestLeadMagnet = Object.entries(typePerformance)
    .map(([type, stats]) => ({
      type,
      ...stats,
      rate: stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0
    }))
    .sort((a, b) => b.rate - a.rate)[0];

  const worstLeadMagnet = Object.entries(typePerformance)
    .map(([type, stats]) => ({
      type,
      ...stats,
      rate: stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0
    }))
    .filter(item => item.total > 10)
    .sort((a, b) => a.rate - b.rate)[0];

  // Channel analysis
  const channelPerformance = submissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Unknown';
    if (!acc[source]) {
      acc[source] = { total: 0, qualified: 0 };
    }
    acc[source].total++;
    if (sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
      acc[source].qualified++;
    }
    return acc;
  }, {} as Record<string, { total: number; qualified: number }>);

  const topChannels = Object.entries(channelPerformance)
    .map(([source, stats]) => ({
      source,
      ...stats,
      rate: stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const lowPerformingChannels = Object.entries(channelPerformance)
    .map(([source, stats]) => ({
      source,
      ...stats,
      rate: stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0
    }))
    .filter(item => item.total > 10)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 2);

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
      <h2 className="text-2xl font-semibold">Strategic Recommendations</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What Worked */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              What Worked Well
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Best Lead Magnet
              </h4>
              {bestLeadMagnet && (
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                  <div className="font-medium">{getTypeLabel(bestLeadMagnet.type)}</div>
                  <div className="text-sm text-muted-foreground">
                    {bestLeadMagnet.qualified} qualified from {bestLeadMagnet.total} leads
                  </div>
                  <Badge variant="default" className="mt-2">
                    {bestLeadMagnet.rate.toFixed(1)}% qualification rate
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Top Performing Channels</h4>
              <div className="space-y-2">
                {topChannels.map((channel, idx) => (
                  <div key={idx} className="border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{channel.source}</span>
                      <Badge variant="secondary">{channel.rate.toFixed(0)}%</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {channel.total} leads, {channel.qualified} qualified
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Didn't Work */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Underperforming Lead Magnet
              </h4>
              {worstLeadMagnet && (
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
                  <div className="font-medium">{getTypeLabel(worstLeadMagnet.type)}</div>
                  <div className="text-sm text-muted-foreground">
                    Only {worstLeadMagnet.qualified} qualified from {worstLeadMagnet.total} leads
                  </div>
                  <Badge variant="destructive" className="mt-2">
                    {worstLeadMagnet.rate.toFixed(1)}% qualification rate
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Low Performing Channels</h4>
              <div className="space-y-2">
                {lowPerformingChannels.map((channel, idx) => (
                  <div key={idx} className="border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{channel.source}</span>
                      <Badge variant="outline">{channel.rate.toFixed(0)}%</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {channel.total} leads, only {channel.qualified} qualified
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <div className="font-medium">Budget Reallocation</div>
                <div className="text-sm text-muted-foreground">
                  Increase investment in {bestLeadMagnet?.type && getTypeLabel(bestLeadMagnet.type)} and top-performing channels.
                  Consider reducing spend on {worstLeadMagnet?.type && getTypeLabel(worstLeadMagnet.type)}.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <div className="font-medium">Lead Magnet Optimization</div>
                <div className="text-sm text-muted-foreground">
                  {worstLeadMagnet && `Revise messaging and targeting for ${getTypeLabel(worstLeadMagnet.type)} to improve qualification rates or consider replacement with higher-performing offers.`}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <div className="font-medium">Channel Strategy</div>
                <div className="text-sm text-muted-foreground">
                  Optimize or pause low-performing channels. Test new creative and messaging approaches before completely abandoning channels.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <div className="font-medium">Lead Qualification Process</div>
                <div className="text-sm text-muted-foreground">
                  Implement stricter pre-qualification criteria on low-performing sources to improve overall lead quality.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">5</div>
              <div>
                <div className="font-medium">Tracking & Attribution</div>
                <div className="text-sm text-muted-foreground">
                  Ensure all campaigns have proper UTM parameters. Review and standardize tracking methodology for better insights.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
