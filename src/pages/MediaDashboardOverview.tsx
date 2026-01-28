import { useState, useMemo } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { DashboardFilters } from '@/components/media-dashboard/DashboardFilters';
import { KPICards } from '@/components/media-dashboard/KPICards';
import { WeeklyPerformanceChart } from '@/components/media-dashboard/WeeklyPerformanceChart';
import { FunnelChart } from '@/components/media-dashboard/FunnelChart';
import { MarketAudienceCharts } from '@/components/media-dashboard/MarketAudienceCharts';
import { useMediaDashboard } from '@/hooks/useMediaDashboard';
import { DashboardFilters as FilterState, Q1_TARGETS, getCurrentPhase } from '@/types/mediaDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInWeeks } from 'date-fns';

const MediaDashboardOverview = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(2026, 1, 2),  // Feb 2, 2026 - Campaign start
      end: new Date(2026, 4, 3),    // May 3, 2026 - 13 weeks later
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

  // Calculate current week and phase
  const currentWeekAndPhase = useMemo(() => {
    const today = new Date();
    const campaignStart = Q1_TARGETS.campaign_start;
    
    // If before campaign start, show Week 0
    if (today < campaignStart) {
      return { week: 0, phase: getCurrentPhase(1) };
    }
    
    const weekNum = Math.min(
      Math.max(1, differenceInWeeks(today, campaignStart) + 1),
      Q1_TARGETS.weeks
    );
    return { week: weekNum, phase: getCurrentPhase(weekNum) };
  }, []);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Covarte Media Dashboard - Q1 2026</h1>
            <p className="text-slate-600">Meta Ads performance and lead qualification tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
              Week {currentWeekAndPhase.week}/{Q1_TARGETS.weeks}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              currentWeekAndPhase.phase.phase === 'fase1' ? 'bg-blue-100 text-blue-700' :
              currentWeekAndPhase.phase.phase === 'fase2' ? 'bg-amber-100 text-amber-700' :
              'bg-green-100 text-green-700'
            }`}>
              {currentWeekAndPhase.phase.name}
            </span>
          </div>
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
