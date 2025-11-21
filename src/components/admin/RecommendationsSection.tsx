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
    if (sub.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit)) {
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      stalen: 'Stalen',
      renderboek: 'Collection Lookbook',
      keukentrends: 'Keukentrends',
      korting: 'Korting'
    };
    return labels[type] || type;
  };

  return null;
};
