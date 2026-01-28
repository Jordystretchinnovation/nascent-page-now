import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { RetargetingPoolStatus, RETARGETING_POOL } from '@/types/alertsDashboard';
import { cn } from '@/lib/utils';

interface RetargetingPoolMonitorProps {
  status: RetargetingPoolStatus;
}

export function RetargetingPoolMonitor({ status }: RetargetingPoolMonitorProps) {
  const getFrequencyStatus = (freq: number) => {
    if (freq >= RETARGETING_POOL.max_frequency) return { text: '🚨 Critical', color: 'text-red-600' };
    if (freq >= RETARGETING_POOL.warning_frequency) return { text: '⚠️ Approaching limit', color: 'text-amber-600' };
    return { text: '✅ OK', color: 'text-green-600' };
  };

  const nlStatus = getFrequencyStatus(status.nl_frequency);
  const frStatus = getFrequencyStatus(status.fr_frequency);
  const combinedStatus = getFrequencyStatus(status.combined_frequency);

  const isWarning = status.combined_frequency >= RETARGETING_POOL.warning_frequency;
  const isCritical = status.combined_frequency >= RETARGETING_POOL.max_frequency;

  return (
    <Card className={cn(
      'bg-white border-2',
      isCritical ? 'border-red-400' : isWarning ? 'border-amber-400' : 'border-slate-200'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔄 GEDEELDE RETARGETING POOL (~{(status.pool_size / 1000).toFixed(0)}K)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pool Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Pool Status:</span>
            <span className="font-medium">{status.percentage_reached.toFixed(0)}% bereikt</span>
          </div>
          <Progress 
            value={status.percentage_reached} 
            className={cn(
              'h-3',
              isCritical ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'
            )} 
          />
        </div>

        {/* Breakdown Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-2 font-medium text-slate-600"></th>
                <th className="text-right p-2 font-medium text-slate-600">Spend</th>
                <th className="text-right p-2 font-medium text-slate-600">Freq</th>
                <th className="text-right p-2 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2 font-medium">NL Retargeting</td>
                <td className="text-right p-2">€{status.nl_spent.toFixed(0)}</td>
                <td className="text-right p-2">{status.nl_frequency.toFixed(1)}x</td>
                <td className={cn('text-right p-2 text-xs', nlStatus.color)}>{nlStatus.text}</td>
              </tr>
              <tr className="border-t">
                <td className="p-2 font-medium">FR Retargeting</td>
                <td className="text-right p-2">€{status.fr_spent.toFixed(0)}</td>
                <td className="text-right p-2">{status.fr_frequency.toFixed(1)}x</td>
                <td className={cn('text-right p-2 text-xs', frStatus.color)}>{frStatus.text}</td>
              </tr>
              <tr className="border-t bg-slate-50 font-medium">
                <td className="p-2">Combined</td>
                <td className="text-right p-2">€{status.combined_spent.toFixed(0)}</td>
                <td className="text-right p-2">{status.combined_frequency.toFixed(1)}x</td>
                <td className="text-right p-2 text-xs text-slate-500">
                  Max: €{status.max_budget.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Warning Message */}
        <div className={cn(
          'p-3 rounded-lg flex items-start gap-2',
          isCritical ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
        )}>
          <AlertTriangle className={cn(
            'h-4 w-4 mt-0.5 flex-shrink-0',
            isCritical ? 'text-red-500' : 'text-amber-500'
          )} />
          <div className="text-sm">
            <p className={cn(
              'font-medium',
              isCritical ? 'text-red-700' : 'text-amber-700'
            )}>
              Let op: NL en FR delen dezelfde pool!
            </p>
            <p className={cn(
              'mt-1',
              isCritical ? 'text-red-600' : 'text-amber-600'
            )}>
              {status.combined_frequency >= 5 
                ? 'Als combined freq >5x → stop BEIDE retargeting campagnes'
                : `Forecast: Pool uitgeput in ~${status.weeks_until_exhausted} weken bij huidig tempo`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
