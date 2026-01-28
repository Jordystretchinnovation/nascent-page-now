import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { AlertTriangle, AlertCircle, Info, Clock, Check, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TriggeredAlert, SEVERITY_COLORS } from '@/types/alertsDashboard';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: TriggeredAlert;
  actionMessage?: string;
  onAcknowledge: () => void;
  onResolve: () => void;
  onSnooze?: () => void;
}

export function AlertCard({ 
  alert, 
  actionMessage,
  onAcknowledge, 
  onResolve, 
  onSnooze 
}: AlertCardProps) {
  const colors = SEVERITY_COLORS[alert.severity];
  const timeAgo = formatDistanceToNow(new Date(alert.triggered_at), { 
    addSuffix: true, 
    locale: nl 
  });

  const SeverityIcon = alert.severity === 'critical' 
    ? AlertTriangle 
    : alert.severity === 'warning' 
      ? AlertCircle 
      : Info;

  return (
    <Card className={cn(
      'border-2 overflow-hidden',
      colors.border,
      alert.severity === 'critical' ? colors.bg : 'bg-white'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            'flex items-center gap-2 px-2 py-1 rounded text-xs font-bold uppercase',
            colors.badge
          )}>
            <SeverityIcon className="h-4 w-4" />
            {alert.severity}
          </div>
          <div className={cn(
            'flex items-center gap-1 text-xs',
            alert.severity === 'critical' ? 'text-white/80' : 'text-slate-500'
          )}>
            <Clock className="h-3 w-3" />
            {timeAgo}
          </div>
        </div>

        <h3 className={cn(
          'font-semibold text-lg mb-2',
          alert.severity === 'critical' ? 'text-white' : 'text-slate-800'
        )}>
          {alert.adset_name.replace(/_/g, ' ')}: {alert.metric_name}
        </h3>

        <div className={cn(
          'space-y-1 text-sm mb-4',
          alert.severity === 'critical' ? 'text-white/90' : 'text-slate-600'
        )}>
          <div className="flex justify-between">
            <span>Huidige waarde:</span>
            <span className="font-semibold">
              {alert.metric_name === 'frequency' 
                ? `${alert.current_value?.toFixed(1)}x`
                : alert.metric_name === 'cpc'
                  ? `€${alert.current_value?.toFixed(2)}`
                  : `€${alert.current_value?.toFixed(2)}`
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Threshold:</span>
            <span>
              {alert.metric_name === 'frequency' 
                ? `max ${alert.threshold_value?.toFixed(1)}x`
                : alert.metric_name === 'cpc'
                  ? `max €${alert.threshold_value?.toFixed(2)}`
                  : `max €${alert.threshold_value?.toFixed(2)}`
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ad set:</span>
            <span className="font-mono text-xs">{alert.adset_name}</span>
          </div>
        </div>

        {actionMessage && (
          <div className={cn(
            'p-3 rounded-lg mb-4 flex items-start gap-2',
            alert.severity === 'critical' 
              ? 'bg-white/20' 
              : 'bg-slate-100'
          )}>
            <span className="text-lg">⚡</span>
            <div>
              <span className={cn(
                'font-medium text-sm',
                alert.severity === 'critical' ? 'text-white' : 'text-slate-700'
              )}>
                Actie vereist:
              </span>
              <p className={cn(
                'text-sm mt-0.5',
                alert.severity === 'critical' ? 'text-white/90' : 'text-slate-600'
              )}>
                {actionMessage}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {alert.status === 'open' && (
            <Button 
              variant={alert.severity === 'critical' ? 'secondary' : 'outline'}
              size="sm"
              onClick={onAcknowledge}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Acknowledge
            </Button>
          )}
          <Button 
            variant={alert.severity === 'critical' ? 'secondary' : 'default'}
            size="sm"
            onClick={onResolve}
            className="flex-1"
          >
            Mark Resolved
          </Button>
          {onSnooze && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={onSnooze}
              className={alert.severity === 'critical' ? 'text-white/70 hover:text-white' : ''}
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
