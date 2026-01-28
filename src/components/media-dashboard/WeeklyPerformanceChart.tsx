import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { WeeklyMetrics, Q1_TARGETS } from '@/types/mediaDashboard';

interface WeeklyPerformanceChartProps {
  data: WeeklyMetrics[];
}

export function WeeklyPerformanceChart({ data }: WeeklyPerformanceChartProps) {
  const chartData = data.map(week => ({
    name: `W${week.week}`,
    leads: week.leads,
    sqls: week.actual_sqls,
    spend: week.actual_spend,
    cumulativeSQLs: week.cumulative_sqls,
  }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#64748b"
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'spend') return [`€${value.toFixed(0)}`, 'Spend'];
                  return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                }}
              />
              <Legend />
              <ReferenceLine 
                y={Q1_TARGETS.weekly_sqls} 
                yAxisId="left"
                stroke="#22c55e" 
                strokeDasharray="5 5"
                label={{ value: 'SQL Target', position: 'right', fontSize: 10 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Leads"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sqls"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                name="SQLs"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="spend"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Spend"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
