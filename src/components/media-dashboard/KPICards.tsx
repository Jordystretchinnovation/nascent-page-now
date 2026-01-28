import { TrendingUp, TrendingDown, Target, Users, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KPISummary, getCPSQLColor, getCPSQLBgColor } from '@/types/mediaDashboard';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  kpi: KPISummary;
}

export function KPICards({ kpi }: KPICardsProps) {
  const sqlOnTrack = kpi.sql_progress >= (kpi.budget_progress * 0.9);
  const mqlToSqlOnTrack = kpi.mql_to_sql_rate >= kpi.mql_to_sql_target;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Budget Spent */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Budget Spent</span>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            €{kpi.budget_spent.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-slate-500 mb-3">
            / €{kpi.budget_target.toLocaleString('nl-NL')} target
          </div>
          <Progress value={kpi.budget_progress} className="h-2" />
          <div className="text-xs text-slate-500 mt-1">
            {kpi.budget_progress.toFixed(1)}% spent
          </div>
        </CardContent>
      </Card>

      {/* SQLs */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">SQLs</span>
            {sqlOnTrack ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className={cn(
              "text-3xl font-bold",
              sqlOnTrack ? "text-green-600" : "text-red-600"
            )}>
              {kpi.sqls}
            </span>
            <span className="text-lg text-slate-500 mb-1">/ {kpi.sql_target}</span>
          </div>
          <div className="relative w-24 h-24 mx-auto mt-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={sqlOnTrack ? "#22c55e" : "#ef4444"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${kpi.sql_progress * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{kpi.sql_progress.toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CPSQL */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">CPSQL</span>
            <Target className="h-5 w-5 text-slate-400" />
          </div>
          <div className={cn(
            "text-4xl font-bold",
            getCPSQLColor(kpi.cpsql)
          )}>
            €{kpi.cpsql.toFixed(2)}
          </div>
          <div className={cn(
            "inline-block px-2 py-1 rounded text-xs font-medium mt-2",
            getCPSQLBgColor(kpi.cpsql),
            getCPSQLColor(kpi.cpsql)
          )}>
            Target: max €{kpi.cpsql_target}
          </div>
        </CardContent>
      </Card>

      {/* Total Leads */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total Leads</span>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {kpi.total_leads}
          </div>
          <div className="text-sm text-slate-500">
            Gekwalificeerd: {kpi.gekwalificeerd_rate.toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      {/* MQLs */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">MQLs</span>
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {kpi.mqls}
          </div>
          <div className="text-sm text-slate-500">
            MQL rate: {kpi.mql_rate.toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      {/* MQL→SQL Rate */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">MQL→SQL Rate</span>
            <Percent className="h-5 w-5 text-slate-400" />
          </div>
          <div className={cn(
            "text-3xl font-bold",
            mqlToSqlOnTrack ? "text-green-600" : kpi.mql_to_sql_rate >= 12 ? "text-yellow-600" : "text-red-600"
          )}>
            {kpi.mql_to_sql_rate.toFixed(1)}%
          </div>
          <div className={cn(
            "inline-block px-2 py-1 rounded text-xs font-medium mt-2",
            mqlToSqlOnTrack ? "bg-green-100 text-green-600" : kpi.mql_to_sql_rate >= 12 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
          )}>
            Target: {kpi.mql_to_sql_target}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
