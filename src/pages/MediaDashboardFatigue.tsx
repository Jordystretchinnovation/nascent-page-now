import { useState } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { DashboardFilters } from '@/components/media-dashboard/DashboardFilters';
import { useMediaDashboard } from '@/hooks/useMediaDashboard';
import { DashboardFilters as FilterState, Q1_TARGETS } from '@/types/mediaDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const MediaDashboardFatigue = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  // Use campaign start date (Jan 30, 2026) to ensure all leads are included
  const [filters, setFilters] = useState<FilterState>(() => {
    const campaignEnd = new Date(2026, 4, 3);   // May 3, 2026
    
    return {
      dateRange: {
        start: Q1_TARGETS.campaign_start, // Jan 30, 2026
        end: campaignEnd,
      },
      market: 'All',
      campaign: 'All',
    };
  });

  const {
    isLoading,
    lastUpdated,
    campaigns,
    frequencyAlerts,
    refetch,
  } = useMediaDashboard(filters);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const criticalAlerts = frequencyAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = frequencyAlerts.filter(a => a.severity === 'warning');

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MediaDashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ad Fatigue Monitor</h1>
          <p className="text-slate-600">Track creative frequency and identify ads needing refresh</p>
        </div>

        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          campaigns={campaigns}
          lastUpdated={lastUpdated}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-slate-600">Critical Alerts</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    {criticalAlerts.length}
                  </div>
                  <div className="text-sm text-slate-500">
                    Frequency &gt; 4.0
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-600">Warnings</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {warningAlerts.length}
                  </div>
                  <div className="text-sm text-slate-500">
                    Frequency 3.0 - 4.0
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-600">Healthy</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {frequencyAlerts.length === 0 ? 'All' : (campaigns.length - frequencyAlerts.length)}
                  </div>
                  <div className="text-sm text-slate-500">
                    Frequency &lt; 3.0
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <Card className="bg-white border-red-200">
                <CardHeader className="bg-red-50 border-b border-red-200">
                  <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Critical - Immediate Action Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {criticalAlerts.map(alert => (
                      <div key={alert.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-slate-900">{alert.ad_name}</div>
                            <div className="text-sm text-slate-600">{alert.adset_name}</div>
                            <div className="text-xs text-slate-500">{alert.campaign_name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">
                              {alert.current_frequency.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {alert.days_running} days running
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border border-red-100 text-sm text-red-700">
                          💡 {alert.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning Alerts */}
            {warningAlerts.length > 0 && (
              <Card className="bg-white border-yellow-200">
                <CardHeader className="bg-yellow-50 border-b border-yellow-200">
                  <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Warning - Monitor Closely
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {warningAlerts.map(alert => (
                      <div key={alert.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-slate-900">{alert.ad_name}</div>
                            <div className="text-sm text-slate-600">{alert.adset_name}</div>
                            <div className="text-xs text-slate-500">{alert.campaign_name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-600">
                              {alert.current_frequency.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {alert.days_running} days running
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border border-yellow-100 text-sm text-yellow-700">
                          💡 {alert.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {frequencyAlerts.length === 0 && (
              <Card className="bg-white">
                <CardContent className="p-12 text-center">
                  <div className="text-green-500 mb-4">
                    <Clock className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    All Creatives Healthy
                  </h3>
                  <p className="text-slate-600">
                    No ads are showing signs of fatigue. All frequencies are below the 3.0 threshold.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Frequency Thresholds Guide */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Frequency Threshold Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-800 mb-1">Healthy (&lt; 3.0)</div>
                    <p className="text-sm text-green-700">
                      Creative is performing well. No action needed.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="font-medium text-yellow-800 mb-1">Warning (3.0 - 4.0)</div>
                    <p className="text-sm text-yellow-700">
                      Audience is seeing ads multiple times. Start preparing new creatives.
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="font-medium text-red-800 mb-1">Critical (&gt; 4.0)</div>
                    <p className="text-sm text-red-700">
                      High ad fatigue risk. Consider pausing or replacing immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardFatigue;
