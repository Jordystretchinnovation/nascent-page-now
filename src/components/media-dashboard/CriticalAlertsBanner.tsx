import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TriggeredAlert } from '@/types/alertsDashboard';

interface CriticalAlertsBannerProps {
  alerts: TriggeredAlert[];
}

export function CriticalAlertsBanner({ alerts }: CriticalAlertsBannerProps) {
  if (alerts.length === 0) return null;

  const alertMessages = alerts.slice(0, 3).map(a => {
    const shortName = a.adset_name.replace('_engagement', '').replace('lookalike_', '');
    return `${shortName} ${a.metric_name} ${a.current_value?.toFixed(1)}`;
  });

  return (
    <div className="bg-red-600 border-b border-red-800 text-white px-4 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">
            🚨 {alerts.length} CRITICAL:
          </span>
          <span className="text-white/90 truncate max-w-lg">
            {alertMessages.join(' | ')}
          </span>
        </div>
        <Link 
          to="/media-dashboard/alerts"
          className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1"
        >
          View Alerts →
        </Link>
      </div>
    </div>
  );
}
