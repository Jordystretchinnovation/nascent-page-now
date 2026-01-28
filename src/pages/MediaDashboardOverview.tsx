import { useState } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { DashboardFilters } from '@/components/media-dashboard/DashboardFilters';
import { KPICards } from '@/components/media-dashboard/KPICards';
import { WeeklyPerformanceChart } from '@/components/media-dashboard/WeeklyPerformanceChart';
import { FunnelChart } from '@/components/media-dashboard/FunnelChart';
import { MarketAudienceCharts } from '@/components/media-dashboard/MarketAudienceCharts';
import { useMediaDashboard } from '@/hooks/useMediaDashboard';
import { DashboardFilters as FilterState } from '@/types/mediaDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Skeleton } from '@/components/ui/skeleton';

const MediaDashboardOverview = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(2025, 0, 1), // Jan 1, 2025
      end: new Date(2025, 2, 31), // Mar 31, 2025
    },
    market: 'All',
    campaign: 'All',
  });

  const {
    isLoading,
    lastUpdated,
    campaigns,
    kpiSummary,
    funnelStages,
    weeklyMetrics,
    marketPerformance,
    audiencePerformance,
    refetch,
  } = useMediaDashboard(filters);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MediaDashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Covarte Media Dashboard - Q1 2026</h1>
          <p className="text-slate-600">Meta Ads performance and lead qualification tracking</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        ) : (
          <>
            <KPICards kpi={kpiSummary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WeeklyPerformanceChart data={weeklyMetrics} />
              <FunnelChart data={funnelStages} />
            </div>

            <MarketAudienceCharts 
              marketData={marketPerformance} 
              audienceData={audiencePerformance} 
            />
          </>
        )}
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardOverview;
