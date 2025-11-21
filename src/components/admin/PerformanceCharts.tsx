import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface Submission {
  type: string;
  kwaliteit: string | null;
  sales_status: string | null;
  created_at: string;
  utm_source: string | null;
}

interface PerformanceChartsProps {
  submissions: Submission[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="hsl(var(--foreground))" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="font-medium"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PerformanceCharts = ({ submissions }: PerformanceChartsProps) => {
  // Lead type distribution
  const typeData = submissions.reduce((acc, sub) => {
    const existing = acc.find(item => item.name === sub.type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: sub.type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Quality distribution - following the same logic as top cards (cumulative)
  const totalLeads = submissions.length;
  const slechtCount = submissions.filter(s => s.kwaliteit === 'Slecht').length;
  // Exclude keukentrends leads from SQL count
  const sqlCount = submissions.filter(s => 
    s.kwaliteit && ['Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(s.kwaliteit) && s.type !== 'keukentrends'
  ).length;
  const mqlCount = submissions.filter(s => s.kwaliteit === 'MQL').length + sqlCount; // MQL + SQL (cumulative)
  
  const qualityData = [
    { name: 'Leads', count: totalLeads },
    { name: 'Slecht', count: slechtCount },
    { name: 'MQL', count: mqlCount },
    { name: 'SQL', count: sqlCount }
  ];

  // Timeline data (by week)
  const timelineData = submissions.reduce((acc, sub) => {
    const date = new Date(sub.created_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const existing = acc.find(item => item.week === weekKey);
    // Qualified includes MQL + SQL, but SQL excludes keukentrends
    const isQualified = sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) &&
      (sub.kwaliteit === 'MQL' || sub.type !== 'keukentrends');
    
    if (existing) {
      existing.total++;
      if (isQualified) existing.qualified++;
    } else {
      acc.push({ week: weekKey, total: 1, qualified: isQualified ? 1 : 0 });
    }
    return acc;
  }, [] as { week: string; total: number; qualified: number }[]).sort((a, b) => a.week.localeCompare(b.week));

  // Channel performance
  const channelData = submissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Unknown';
    const existing = acc.find(item => item.channel === source);
    // Qualified includes MQL + SQL, but SQL excludes keukentrends
    const isQualified = sub.kwaliteit && ['Goed', 'MQL', 'Goed - klant', 'Goed - Klant', 'Redelijk'].includes(sub.kwaliteit) &&
      (sub.kwaliteit === 'MQL' || sub.type !== 'keukentrends');
    
    if (existing) {
      existing.total++;
      if (isQualified) existing.qualified++;
    } else {
      acc.push({ channel: source, total: 1, qualified: isQualified ? 1 : 0 });
    }
    return acc;
  }, [] as { channel: string; total: number; qualified: number }[]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Performance Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Volume Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" name="Total Leads" strokeWidth={2} />
                <Line type="monotone" dataKey="qualified" stroke="hsl(var(--chart-2))" name="Qualified" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" />
                <Bar dataKey="qualified" fill="hsl(var(--chart-2))" name="Qualified" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
