import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SalesFiltersProps {
  salesRepFilter: string;
  setSalesRepFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  marketingStatusFilter: string;
  setMarketingStatusFilter: (value: string) => void;
  salesReps: string[];
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  salesRepFilter,
  setSalesRepFilter,
  typeFilter,
  setTypeFilter,
  marketingStatusFilter,
  setMarketingStatusFilter,
  salesReps
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sales-rep-filter">Sales Representative</Label>
            <Select value={salesRepFilter} onValueChange={setSalesRepFilter}>
              <SelectTrigger id="sales-rep-filter">
                <SelectValue placeholder="Selecteer sales rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Sales Reps</SelectItem>
                <SelectItem value="unassigned">Niet Toegewezen</SelectItem>
                {salesReps.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-filter">Lead Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Selecteer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Types</SelectItem>
                <SelectItem value="stalen">Stalen</SelectItem>
                <SelectItem value="renderboek">Collection Lookbook</SelectItem>
                <SelectItem value="korting">Korting</SelectItem>
                <SelectItem value="keukentrends">Keukentrends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketing-status-filter">Marketing Status</Label>
            <Select value={marketingStatusFilter} onValueChange={setMarketingStatusFilter}>
              <SelectTrigger id="marketing-status-filter">
                <SelectValue placeholder="Selecteer marketing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                <SelectItem value="Goed">Goed</SelectItem>
                <SelectItem value="Goed - Klant">Goed - Klant</SelectItem>
                <SelectItem value="Redelijk">Redelijk</SelectItem>
                <SelectItem value="MQL">MQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};