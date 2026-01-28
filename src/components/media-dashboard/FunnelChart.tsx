import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStage } from '@/types/mediaDashboard';

interface FunnelChartProps {
  data: FunnelStage[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = data[0]?.value || 1;
  const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e'];

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Lead Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((stage, index) => {
            const widthPercent = (stage.value / maxValue) * 100;
            
            return (
              <div key={stage.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{stage.name}</span>
                  <span className="text-slate-600">
                    {stage.value} ({stage.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-lg transition-all duration-500 flex items-center justify-center"
                    style={{ 
                      width: `${Math.max(widthPercent, 10)}%`,
                      backgroundColor: colors[index],
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {stage.value}
                    </span>
                  </div>
                </div>
                {index < data.length - 1 && stage.dropoff > 0 && (
                  <div className="flex items-center justify-end text-xs text-slate-500">
                    <span>↓ -{stage.dropoff} drop-off</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
