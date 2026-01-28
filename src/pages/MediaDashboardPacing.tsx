import { useState, useMemo } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { DashboardFilters } from '@/components/media-dashboard/DashboardFilters';
import { useMediaDashboard } from '@/hooks/useMediaDashboard';
import { DashboardFilters as FilterState, Q1_TARGETS, PHASE_CONFIG, getCurrentPhase, getWeeklyBudgetForWeek } from '@/types/mediaDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays, differenceInWeeks, format } from 'date-fns';

const MediaDashboardPacing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(2026, 1, 2), // Feb 2, 2026 - campaign start
      end: new Date(2026, 4, 3),   // May 3, 2026 - 13 weeks later
    },
    market: 'All',
    campaign: 'All',
  });

  const {
    isLoading,
    lastUpdated,
    campaigns,
    kpiSummary,
    weeklyMetrics,
    refetch,
  } = useMediaDashboard(filters);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  // Calculate current week
  const currentWeek = useMemo(() => {
    const today = new Date();
    const campaignStart = Q1_TARGETS.campaign_start;
    if (today < campaignStart) return 0;
    return Math.min(Math.max(1, differenceInWeeks(today, campaignStart) + 1), Q1_TARGETS.weeks);
  }, []);

  const currentPhase = getCurrentPhase(Math.max(1, currentWeek));

  // Calculate forecast
  const forecast = useMemo(() => {
    const weeksWithData = weeklyMetrics.filter(w => w.actual_spend > 0);
    if (weeksWithData.length === 0) {
      return {
        projectedSQLs: 0,
        budgetExhaustDate: null,
        weeklyRunRate: 0,
        sqlRunRate: 0,
        onTrack: false,
      };
    }

    const totalSpent = weeksWithData.reduce((sum, w) => sum + w.actual_spend, 0);
    const totalSQLs = weeksWithData.reduce((sum, w) => sum + w.actual_sqls, 0);
    const weeklySpendRate = totalSpent / weeksWithData.length;
    const weeklySQLRate = totalSQLs / weeksWithData.length;

    const remainingBudget = Q1_TARGETS.budget - totalSpent;
    const weeksRemaining = remainingBudget / weeklySpendRate;
    const budgetExhaustDate = new Date();
    budgetExhaustDate.setDate(budgetExhaustDate.getDate() + weeksRemaining * 7);

    const projectedSQLs = Math.round(weeklySQLRate * Q1_TARGETS.weeks);

    return {
      projectedSQLs,
      budgetExhaustDate,
      weeklyRunRate: weeklySpendRate,
      sqlRunRate: weeklySQLRate,
      onTrack: projectedSQLs >= Q1_TARGETS.sqls * 0.9,
    };
  }, [weeklyMetrics]);

  // Recommendations
  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'danger'; message: string }[] = [];

    if (kpiSummary.cpsql > Q1_TARGETS.max_cpsql) {
      recs.push({
        type: 'danger',
        message: `CPSQL (€${kpiSummary.cpsql.toFixed(2)}) exceeds target (€${Q1_TARGETS.max_cpsql}). Consider optimizing underperforming campaigns or reallocating budget.`,
      });
    }

    if (kpiSummary.mql_to_sql_rate < Q1_TARGETS.mql_to_sql_rate * 100) {
      recs.push({
        type: 'warning',
        message: `MQL→SQL conversion rate (${kpiSummary.mql_to_sql_rate.toFixed(1)}%) is below target (${Q1_TARGETS.mql_to_sql_rate * 100}%). Review lead quality and sales follow-up.`,
      });
    }

    if (forecast.onTrack) {
      recs.push({
        type: 'success',
        message: `On track to achieve ${forecast.projectedSQLs} SQLs by end of Q1 (target: ${Q1_TARGETS.sqls}).`,
      });
    } else {
      recs.push({
        type: 'danger',
        message: `At current pace, projected to achieve only ${forecast.projectedSQLs} SQLs (target: ${Q1_TARGETS.sqls}). Consider increasing budget or improving conversion.`,
      });
    }

    return recs;
  }, [kpiSummary, forecast]);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MediaDashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacing & Forecast</h1>
          <p className="text-slate-600">Weekly progress tracking and end-of-quarter projections</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            {/* Phase Progress Visualization */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Campaign Phase Progress</h3>
                  <p className="text-sm text-slate-600">
                    Huidige fase: {currentPhase.name} (Week {currentWeek})
                  </p>
                </div>
                
                {/* Phase Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        currentWeek >= 1 ? "bg-blue-500" : "bg-slate-300"
                      )} />
                      <span className="text-sm font-medium text-slate-700">FASE 1 - TEST</span>
                    </div>
                    <span className="text-xs text-slate-500">€{PHASE_CONFIG.fase1.weekly_budget * 4}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        currentWeek >= 5 ? "bg-amber-500" : "bg-slate-300"
                      )} />
                      <span className="text-sm font-medium text-slate-700">FASE 2 - LEARN</span>
                    </div>
                    <span className="text-xs text-slate-500">€{PHASE_CONFIG.fase2.weekly_budget * 4}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        currentWeek >= 9 ? "bg-green-500" : "bg-slate-300"
                      )} />
                      <span className="text-sm font-medium text-slate-700">FASE 3 - SCALE</span>
                    </div>
                    <span className="text-xs text-slate-500">€{PHASE_CONFIG.fase3.weekly_budget * 5}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      currentWeek <= 4 ? "bg-blue-500" : "bg-blue-400"
                    )}
                    style={{ width: `${(Math.min(currentWeek, 4) / 13) * 100}%` }}
                  />
                  <div 
                    className={cn(
                      "h-full transition-all",
                      currentWeek > 4 && currentWeek <= 8 ? "bg-amber-500" : currentWeek > 8 ? "bg-amber-400" : ""
                    )}
                    style={{ width: currentWeek > 4 ? `${(Math.min(currentWeek - 4, 4) / 13) * 100}%` : '0%' }}
                  />
                  <div 
                    className={cn(
                      "h-full transition-all bg-green-500"
                    )}
                    style={{ width: currentWeek > 8 ? `${((currentWeek - 8) / 13) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Week 1</span>
                  <span>Week 4</span>
                  <span>Week 8</span>
                  <span>Week 13</span>
                </div>
              </CardContent>
            </Card>

            {/* Forecast Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {forecast.onTrack ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-slate-600">Projected SQLs</span>
                  </div>
                  <div className={cn(
                    "text-3xl font-bold",
                    forecast.onTrack ? "text-green-600" : "text-red-600"
                  )}>
                    {forecast.projectedSQLs}
                  </div>
                  <div className="text-sm text-slate-500">
                    Target: {Q1_TARGETS.sqls} SQLs
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-slate-600">Budget Exhaust Date</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {forecast.budgetExhaustDate 
                      ? format(forecast.budgetExhaustDate, 'MMM d')
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-500">
                    At current weekly spend of €{forecast.weeklyRunRate.toFixed(0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-slate-600">Weekly SQL Run Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {forecast.sqlRunRate.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-500">
                    Target: {(Q1_TARGETS.sqls / Q1_TARGETS.weeks).toFixed(1)} SQLs/week
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-4 rounded-lg border-l-4",
                        rec.type === 'success' && "bg-green-50 border-green-500",
                        rec.type === 'warning' && "bg-yellow-50 border-yellow-500",
                        rec.type === 'danger' && "bg-red-50 border-red-500"
                      )}
                    >
                      <p className={cn(
                        "text-sm",
                        rec.type === 'success' && "text-green-800",
                        rec.type === 'warning' && "text-yellow-800",
                        rec.type === 'danger' && "text-red-800"
                      )}>
                        {rec.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pacing Table */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Pacing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead className="text-right">Planned €</TableHead>
                        <TableHead className="text-right">Actual €</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                        <TableHead className="text-right">Target SQLs</TableHead>
                        <TableHead className="text-right">Actual SQLs</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyMetrics.map((week) => {
                        const weekPhase = getCurrentPhase(week.week);
                        return (
                          <TableRow key={week.week} className={cn(
                            week.week === currentWeek && "bg-blue-50"
                          )}>
                            <TableCell className="font-medium">Week {week.week}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                weekPhase.phase === 'fase1' && "bg-blue-100 text-blue-700",
                                weekPhase.phase === 'fase2' && "bg-amber-100 text-amber-700",
                                weekPhase.phase === 'fase3' && "bg-green-100 text-green-700"
                              )}>
                                {weekPhase.phase === 'fase1' ? 'TEST' : weekPhase.phase === 'fase2' ? 'LEARN' : 'SCALE'}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {week.weekStart} - {week.weekEnd}
                            </TableCell>
                            <TableCell className="text-right">
                              €{week.planned_spend.toFixed(0)}
                            </TableCell>
                            <TableCell className="text-right">
                              €{week.actual_spend.toFixed(0)}
                            </TableCell>
                            <TableCell className={cn(
                              "text-right",
                              week.spend_variance > 0 ? "text-red-600" : "text-green-600"
                            )}>
                              {week.spend_variance > 0 ? '+' : ''}€{week.spend_variance.toFixed(0)}
                            </TableCell>
                            <TableCell className="text-right">
                              {week.planned_sqls.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {week.actual_sqls}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {week.cumulative_sqls}
                            </TableCell>
                            <TableCell className="text-center">
                              {week.on_track ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardPacing;
