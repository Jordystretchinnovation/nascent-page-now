import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { SimpleMultiSelect } from "@/components/ui/simple-multi-select";

interface CampaignBudget {
  id: string;
  campaign_name: string;
  utm_campaign: string[] | null;
  utm_source: string[] | null;
  utm_medium: string[] | null;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
}

interface BudgetInputProps {
  budgets: CampaignBudget[];
  onBudgetUpdate: () => void;
}

export const BudgetInput = ({ budgets, onBudgetUpdate }: BudgetInputProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: '',
    utm_campaign: [] as string[],
    utm_source: [] as string[],
    utm_medium: [] as string[],
    budget: '',
    start_date: '',
    end_date: '',
    notes: ''
  });
  const [utmOptions, setUtmOptions] = useState({
    campaigns: [] as { label: string; value: string }[],
    sources: [] as { label: string; value: string }[],
    mediums: [] as { label: string; value: string }[]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUTMOptions();
  }, []);

  const fetchUTMOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('utm_campaign, utm_source, utm_medium');

      if (error) throw error;

      const campaigns = new Set<string>();
      const sources = new Set<string>();
      const mediums = new Set<string>();

      data?.forEach(item => {
        if (item.utm_campaign) campaigns.add(item.utm_campaign);
        if (item.utm_source) sources.add(item.utm_source);
        if (item.utm_medium) mediums.add(item.utm_medium);
      });

      setUtmOptions({
        campaigns: Array.from(campaigns).map(v => ({ label: v, value: v })),
        sources: Array.from(sources).map(v => ({ label: v, value: v })),
        mediums: Array.from(mediums).map(v => ({ label: v, value: v }))
      });
    } catch (error) {
      console.error('Error fetching UTM options:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('campaign_budgets')
        .insert([{
          campaign_name: formData.campaign_name,
          utm_campaign: formData.utm_campaign.length > 0 ? formData.utm_campaign : null,
          utm_source: formData.utm_source.length > 0 ? formData.utm_source : null,
          utm_medium: formData.utm_medium.length > 0 ? formData.utm_medium : null,
          budget: parseFloat(formData.budget),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          notes: formData.notes || null
        }]);

      if (error) throw error;

      toast({
        title: "Budget added",
        description: "Campaign budget has been saved successfully.",
      });

      setFormData({
        campaign_name: '',
        utm_campaign: [],
        utm_source: [],
        utm_medium: [],
        budget: '',
        start_date: '',
        end_date: '',
        notes: ''
      });
      setShowForm(false);
      onBudgetUpdate();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign budget.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaign_budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Budget deleted",
        description: "Campaign budget has been removed.",
      });

      onBudgetUpdate();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign budget.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Campaign Budgets</CardTitle>
          <Button 
            onClick={() => setShowForm(!showForm)}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign_name">Campaign Name *</Label>
                <Input
                  id="campaign_name"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="utm_campaign">UTM Campaigns</Label>
                <SimpleMultiSelect
                  options={utmOptions.campaigns}
                  selected={formData.utm_campaign}
                  onChange={(values) => setFormData({...formData, utm_campaign: values})}
                  placeholder="Select campaigns..."
                />
              </div>
              <div>
                <Label htmlFor="utm_source">UTM Sources</Label>
                <SimpleMultiSelect
                  options={utmOptions.sources}
                  selected={formData.utm_source}
                  onChange={(values) => setFormData({...formData, utm_source: values})}
                  placeholder="Select sources..."
                />
              </div>
              <div>
                <Label htmlFor="utm_medium">UTM Mediums</Label>
                <SimpleMultiSelect
                  options={utmOptions.mediums}
                  selected={formData.utm_medium}
                  onChange={(values) => setFormData({...formData, utm_medium: values})}
                  placeholder="Select mediums..."
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Budget</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {budgets.length > 0 ? (
          <div className="space-y-2">
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex-1">
                  <div className="font-medium">{budget.campaign_name}</div>
                  <div className="text-sm text-muted-foreground">
                    €{budget.budget.toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
                    {budget.utm_campaign && budget.utm_campaign.length > 0 && 
                      ` • Campaigns: ${budget.utm_campaign.join(', ')}`}
                    {budget.utm_source && budget.utm_source.length > 0 && 
                      ` • Sources: ${budget.utm_source.join(', ')}`}
                    {budget.utm_medium && budget.utm_medium.length > 0 && 
                      ` • Mediums: ${budget.utm_medium.join(', ')}`}
                  </div>
                  {budget.notes && (
                    <div className="text-xs text-muted-foreground mt-1">{budget.notes}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(budget.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No budgets added yet. Click "Add Budget" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
