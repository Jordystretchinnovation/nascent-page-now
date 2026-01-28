import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Download, Check, X, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
}

interface SyncedCampaign {
  id: string;
  campaign_id: string;
  campaign_name: string;
  is_active: boolean;
  last_synced_at: string | null;
}

export function MetaSyncSettings() {
  const [metaCampaigns, setMetaCampaigns] = useState<MetaCampaign[]>([]);
  const [syncedCampaigns, setSyncedCampaigns] = useState<SyncedCampaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(2025, 0, 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  // Load synced campaigns from database
  useEffect(() => {
    loadSyncedCampaigns();
  }, []);

  const loadSyncedCampaigns = async () => {
    setIsLoadingSync(true);
    try {
      const { data, error } = await supabase
        .from('meta_sync_campaigns')
        .select('*')
        .order('campaign_name');

      if (error) throw error;

      setSyncedCampaigns((data as SyncedCampaign[]) || []);
      
      // Pre-select active campaigns
      const activeCampaignIds = new Set(
        (data as SyncedCampaign[] || [])
          .filter(c => c.is_active)
          .map(c => c.campaign_id)
      );
      setSelectedCampaigns(activeCampaignIds);
    } catch (error) {
      console.error('Error loading synced campaigns:', error);
    } finally {
      setIsLoadingSync(false);
    }
  };

  // Fetch campaigns from Meta API
  const fetchMetaCampaigns = async () => {
    setIsLoadingMeta(true);
    try {
      const { data, error } = await supabase.functions.invoke('meta-sync', {
        body: { action: 'list_campaigns' },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setMetaCampaigns(data.campaigns || []);
      toast({
        title: 'Campaigns loaded',
        description: `Found ${data.campaigns?.length || 0} campaigns from Meta`,
      });
    } catch (error: any) {
      console.error('Error fetching Meta campaigns:', error);
      toast({
        title: 'Error loading campaigns',
        description: error.message || 'Failed to fetch campaigns from Meta',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMeta(false);
    }
  };

  // Toggle campaign selection
  const toggleCampaign = (campaignId: string) => {
    const newSelected = new Set(selectedCampaigns);
    if (newSelected.has(campaignId)) {
      newSelected.delete(campaignId);
    } else {
      newSelected.add(campaignId);
    }
    setSelectedCampaigns(newSelected);
  };

  // Save selected campaigns
  const saveSelectedCampaigns = async () => {
    try {
      // Get all campaigns that should be saved (from Meta list)
      const campaignsToSave = metaCampaigns
        .filter(c => selectedCampaigns.has(c.id))
        .map(c => ({
          campaign_id: c.id,
          campaign_name: c.name,
          is_active: true,
        }));

      // Upsert selected campaigns
      for (const campaign of campaignsToSave) {
        const { error } = await supabase
          .from('meta_sync_campaigns')
          .upsert(campaign, { onConflict: 'campaign_id' });

        if (error) throw error;
      }

      // Deactivate unselected campaigns
      const unselectedIds = metaCampaigns
        .filter(c => !selectedCampaigns.has(c.id))
        .map(c => c.id);

      if (unselectedIds.length > 0) {
        await supabase
          .from('meta_sync_campaigns')
          .update({ is_active: false })
          .in('campaign_id', unselectedIds);
      }

      toast({
        title: 'Campaigns saved',
        description: `${campaignsToSave.length} campaigns configured for sync`,
      });

      loadSyncedCampaigns();
    } catch (error: any) {
      console.error('Error saving campaigns:', error);
      toast({
        title: 'Error saving campaigns',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Sync performance data
  const syncPerformanceData = async () => {
    if (selectedCampaigns.size === 0) {
      toast({
        title: 'No campaigns selected',
        description: 'Please select at least one campaign to sync',
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('meta-sync', {
        body: {
          action: 'sync_performance',
          campaign_ids: Array.from(selectedCampaigns),
          start_date: startDate,
          end_date: endDate,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: 'Sync complete',
        description: data.message,
      });

      loadSyncedCampaigns();
    } catch (error: any) {
      console.error('Error syncing data:', error);
      toast({
        title: 'Sync failed',
        description: error.message || 'Failed to sync performance data',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Configuration */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Meta Ads Sync Configuration</CardTitle>
          <CardDescription>
            Configure which Meta campaigns to sync and fetch performance data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={fetchMetaCampaigns}
              disabled={isLoadingMeta}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMeta ? 'animate-spin' : ''}`} />
              Load Campaigns from Meta
            </Button>

            {metaCampaigns.length > 0 && (
              <Button onClick={saveSelectedCampaigns} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Save Selection
              </Button>
            )}

            <Button
              onClick={syncPerformanceData}
              disabled={isSyncing || selectedCampaigns.size === 0}
            >
              <Download className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Performance Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meta Campaigns List */}
      {metaCampaigns.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Available Campaigns ({metaCampaigns.length})</CardTitle>
            <CardDescription>
              Select which campaigns to include in the performance sync
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {metaCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50"
                >
                  <Checkbox
                    id={campaign.id}
                    checked={selectedCampaigns.has(campaign.id)}
                    onCheckedChange={() => toggleCampaign(campaign.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={campaign.id}
                      className="font-medium cursor-pointer"
                    >
                      {campaign.name}
                    </label>
                    <div className="text-sm text-slate-500">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        campaign.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {campaign.status}
                      </span>
                      <span className="ml-2">{campaign.objective}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Currently Synced Campaigns */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Configured Campaigns</CardTitle>
          <CardDescription>
            Campaigns currently configured for sync
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSync ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : syncedCampaigns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No campaigns configured yet. Load campaigns from Meta to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {syncedCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {campaign.is_active ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-slate-400" />
                    )}
                    <span className={campaign.is_active ? '' : 'text-slate-400'}>
                      {campaign.campaign_name}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {campaign.last_synced_at ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last sync: {format(new Date(campaign.last_synced_at), 'MMM d, HH:mm')}
                      </span>
                    ) : (
                      'Never synced'
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
