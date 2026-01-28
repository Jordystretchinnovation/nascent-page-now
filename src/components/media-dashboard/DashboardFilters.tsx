import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardFilters as FilterState } from '@/types/mediaDashboard';
import { format } from 'date-fns';

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  campaigns: string[];
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  campaigns,
  lastUpdated,
  onRefresh,
  isLoading,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Calendar className="h-4 w-4" />
        <span>
          {format(filters.dateRange.start, 'MMM d, yyyy')} - {format(filters.dateRange.end, 'MMM d, yyyy')}
        </span>
      </div>

      <div className="flex-1" />

      <Select
        value={filters.market}
        onValueChange={(value) => onFiltersChange({ ...filters, market: value as FilterState['market'] })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Market" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Markets</SelectItem>
          <SelectItem value="NL">Netherlands (NL)</SelectItem>
          <SelectItem value="FR">France (FR)</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.campaign}
        onValueChange={(value) => onFiltersChange({ ...filters, campaign: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Campaign" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Campaigns</SelectItem>
          {campaigns.map(campaign => (
            <SelectItem key={campaign} value={campaign}>
              {campaign}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>

      {lastUpdated && (
        <span className="text-xs text-slate-500">
          Updated: {format(lastUpdated, 'HH:mm:ss')}
        </span>
      )}
    </div>
  );
}
