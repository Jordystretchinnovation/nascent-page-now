import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MarketPerformance, AudiencePerformance } from '@/types/mediaDashboard';

interface MarketAudienceChartsProps {
  marketData: MarketPerformance[];
  audienceData: AudiencePerformance[];
}

export function MarketAudienceCharts({ marketData, audienceData }: MarketAudienceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Performance by Market */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Performance by Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis dataKey="market" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={40} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name.includes('cpl') || name.includes('cpsql')) {
                      return [`€${value.toFixed(2)}`, name.toUpperCase()];
                    }
                    return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                  }}
                />
                <Legend />
                <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                <Bar dataKey="sqls" fill="#22c55e" name="SQLs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {marketData.map(m => (
              <div key={m.market} className="p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-slate-700">{m.market}</div>
                <div className="text-slate-600">CPL: €{m.cpl.toFixed(2)}</div>
                <div className="text-slate-600">CPSQL: €{m.cpsql.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance by Audience */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Performance by Audience Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis dataKey="audience_type" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name.includes('cpl') || name.includes('cpsql')) {
                      return [`€${value.toFixed(2)}`, name.toUpperCase()];
                    }
                    return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                  }}
                />
                <Legend />
                <Bar dataKey="leads" fill="#8b5cf6" name="Leads" />
                <Bar dataKey="sqls" fill="#22c55e" name="SQLs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {audienceData.map(a => (
              <div key={a.audience_type} className="p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-slate-700">{a.audience_type}</div>
                <div className="text-slate-600">CPL: €{a.cpl.toFixed(2)}</div>
                <div className="text-slate-600">CPSQL: €{a.cpsql.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
