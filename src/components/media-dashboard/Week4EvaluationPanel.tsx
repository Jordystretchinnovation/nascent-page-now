import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calculator } from 'lucide-react';
import { Week4Evaluation, STATUS_ICONS } from '@/types/alertsDashboard';
import { cn } from '@/lib/utils';

interface Week4EvaluationPanelProps {
  evaluations: Week4Evaluation[];
  currentWeek: number;
  currentPhase: { name: string; phase: number };
}

export function Week4EvaluationPanel({ 
  evaluations, 
  currentWeek,
  currentPhase 
}: Week4EvaluationPanelProps) {
  const nlLeadgen = evaluations.filter(e => e.market === 'NL' && e.campaign_type === 'leadgen');
  const frLeadgen = evaluations.filter(e => e.market === 'FR' && e.campaign_type === 'leadgen');
  const awareness = evaluations.filter(e => e.campaign_type === 'awareness');

  const getStatusBadge = (status: 'pass' | 'watch' | 'fail') => {
    const { icon, label, color } = STATUS_ICONS[status];
    return (
      <span className={cn('font-medium', color)}>
        {icon} {label}
      </span>
    );
  };

  const formatAdsetName = (name: string) => {
    return name
      .replace('lookalike_scraping_', 'LAL Scraping ')
      .replace('retargeting_engagement_', 'Retargeting ')
      .replace('lookalike_leads_customers_', 'LAL Klanten ')
      .replace('lookalike_leads_', 'LAL Leads ')
      .toUpperCase();
  };

  const renderLeadgenTable = (data: Week4Evaluation[], market: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad Set</TableHead>
          <TableHead className="text-right">CPL</TableHead>
          <TableHead className="text-right">Conv%</TableHead>
          <TableHead className="text-right">Freq</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(e => (
          <TableRow key={e.adset_name}>
            <TableCell className="font-medium">{formatAdsetName(e.adset_name)}</TableCell>
            <TableCell className="text-right">€{e.cpl.toFixed(2)}</TableCell>
            <TableCell className="text-right">{e.conversion_rate.toFixed(1)}%</TableCell>
            <TableCell className="text-right">{e.frequency.toFixed(1)}</TableCell>
            <TableCell className="text-right">{getStatusBadge(e.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderAwarenessTable = (data: Week4Evaluation[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad Set</TableHead>
          <TableHead className="text-right">CPC</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="text-right">Freq</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(e => (
          <TableRow key={e.adset_name}>
            <TableCell className="font-medium">{formatAdsetName(e.adset_name)}</TableCell>
            <TableCell className="text-right">€{(e.cpc || 0).toFixed(2)}</TableCell>
            <TableCell className="text-right">{(e.clicks || 0).toLocaleString()}</TableCell>
            <TableCell className="text-right">{e.frequency.toFixed(1)}</TableCell>
            <TableCell className="text-right">{getStatusBadge(e.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Generate recommendations
  const passCount = evaluations.filter(e => e.status === 'pass').length;
  const watchCount = evaluations.filter(e => e.status === 'watch').length;
  const failCount = evaluations.filter(e => e.status === 'fail').length;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            📍 WEEK 4 EVALUATIE
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            {currentPhase.name} → {currentPhase.phase < 3 ? 'Volgende fase' : 'Afronding'}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Week {currentWeek}/13
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NL Audiences */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            🇳🇱 NL AUDIENCES
          </h3>
          <div className="border rounded-lg overflow-hidden">
            {renderLeadgenTable(nlLeadgen, 'NL')}
          </div>
        </div>

        {/* FR Audiences */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            🇫🇷 FR AUDIENCES
          </h3>
          <div className="border rounded-lg overflow-hidden">
            {renderLeadgenTable(frLeadgen, 'FR')}
          </div>
        </div>

        {/* Awareness */}
        {awareness.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              📢 AWARENESS
            </h3>
            <div className="border rounded-lg overflow-hidden">
              {renderAwarenessTable(awareness)}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-700 mb-3">
            AANBEVELING {currentPhase.phase < 3 ? `FASE ${currentPhase.phase + 1}` : 'AFSLUITING'}:
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {evaluations
              .filter(e => e.status === 'pass' && e.campaign_type === 'leadgen')
              .slice(0, 2)
              .map(e => (
                <li key={e.adset_name} className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    <strong>{formatAdsetName(e.adset_name)}:</strong> {e.recommendation}
                  </span>
                </li>
              ))}
            {evaluations
              .filter(e => e.status === 'watch')
              .slice(0, 2)
              .map(e => (
                <li key={e.adset_name} className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>{formatAdsetName(e.adset_name)}:</strong> {e.recommendation}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90">
            <Calculator className="h-4 w-4 mr-2" />
            Genereer Fase {Math.min(3, currentPhase.phase + 1)} Allocatie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
