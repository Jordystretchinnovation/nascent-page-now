import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SalesKanbanBoard } from './SalesKanbanBoard';
import { SalesFilters } from './SalesFilters';
import { LeadDetailsModal } from './LeadDetailsModal';

interface FormSubmission {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon: string | null;
  straat: string | null;
  postcode: string | null;
  gemeente: string | null;
  renderbook_type: string | null;
  kwaliteit: string | null;
  marketing_optin: boolean;
  language: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  sales_status: string | null;
  sales_rep: string | null;
  sales_comment: string | null;
  toelichting: string | null;
}

export const SalesDashboard = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<FormSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Filter states
  const [salesRepFilter, setSalesRepFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [marketingStatusFilter, setMarketingStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, salesRepFilter, typeFilter, marketingStatusFilter]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Fout bij ophalen gegevens",
          description: "Er is een fout opgetreden bij het ophalen van de leads.",
          variant: "destructive"
        });
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fout",
        description: "Er is een onverwachte fout opgetreden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = submissions;

    // Debug: log all kwaliteit values to see what we have
    console.log('All kwaliteit values:', submissions.map(s => s.kwaliteit).filter(Boolean));

    // Only show marketing qualified leads (goed, goed-klant, redelijk)
    // Make the filter case-insensitive and handle variations
    filtered = filtered.filter(sub => {
      if (!sub.kwaliteit) return false;
      const kwaliteit = sub.kwaliteit.toLowerCase().trim();
      const isQualified = kwaliteit === 'goed' || 
             kwaliteit === 'goed - klant' || 
             kwaliteit.includes('goed') && kwaliteit.includes('klant') ||
             kwaliteit === 'redelijk';
      
      console.log(`Lead ${sub.voornaam} ${sub.achternaam}: kwaliteit="${sub.kwaliteit}" -> qualified: ${isQualified}`);
      return isQualified;
    });

    if (salesRepFilter !== 'all') {
      if (salesRepFilter === 'unassigned') {
        filtered = filtered.filter(sub => !sub.sales_rep);
      } else {
        filtered = filtered.filter(sub => sub.sales_rep === salesRepFilter);
      }
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.type === typeFilter);
    }

    if (marketingStatusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.kwaliteit === marketingStatusFilter);
    }

    console.log(`Filtered leads count: ${filtered.length}`);
    setFilteredSubmissions(filtered);
  };

  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ sales_status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Fout bij bijwerken",
          description: "Er is een fout opgetreden bij het bijwerken van de status.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, sales_status: newStatus } : sub
        )
      );

      toast({
        title: "Status bijgewerkt",
        description: "De lead status is succesvol bijgewerkt.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fout",
        description: "Er is een onverwachte fout opgetreden.",
        variant: "destructive"
      });
    }
  };

  const getSalesStats = () => {
    const stats = filteredSubmissions.reduce((acc, submission) => {
      const status = submission.sales_status || 'te_contacteren';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      te_contacteren: stats.te_contacteren || 0,
      gecontacteerd: stats.gecontacteerd || 0,
      gesprek_gepland: stats.gesprek_gepland || 0,
      afgewezen: stats.Afgewezen || 0, // Fixed: use capitalized 'Afgewezen'
      niet_relevant: stats.niet_relevant || 0,
      total: filteredSubmissions.length,
      unassigned: filteredSubmissions.filter(s => !s.sales_rep).length
    };
  };

  const getSalesMetrics = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate salesReps inside this function
    const salesReps = Array.from(new Set(filteredSubmissions.map(s => s.sales_rep).filter(Boolean)));

    // Conversion rates by sales rep (conversion = reaching gesprek_gepland)
    const conversionByRep = salesReps.map(rep => {
      const repLeads = filteredSubmissions.filter(s => s.sales_rep === rep);
      const converted = repLeads.filter(s => s.sales_status === 'gesprek_gepland').length;
      const total = repLeads.length;
      return {
        rep,
        rate: total > 0 ? Math.round((converted / total) * 100) : 0,
        converted,
        total
      };
    });

    // Conversion rates by lead type (conversion = reaching gesprek_gepland)
    const conversionByType = ['stalen', 'renderboek', 'korting', 'keukentrends'].map(type => {
      const typeLeads = filteredSubmissions.filter(s => s.type === type);
      const converted = typeLeads.filter(s => s.sales_status === 'gesprek_gepland').length;
      const total = typeLeads.length;
      return {
        type,
        rate: total > 0 ? Math.round((converted / total) * 100) : 0,
        converted,
        total
      };
    });

    // Response times - average days to first contact (from te_contacteren to gecontacteerd)
    const contactedLeads = filteredSubmissions.filter(s => 
      s.sales_status && s.sales_status !== 'te_contacteren'
    );
    const avgResponseTime = contactedLeads.length > 0 
      ? Math.round(contactedLeads.reduce((acc, lead) => {
          const createdDate = new Date(lead.created_at);
          const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
          return acc + Math.min(daysSinceCreated, 7); // Cap at 7 days for calculation
        }, 0) / contactedLeads.length)
      : 0;

    // Pipeline velocity - time spent in each key status
    const teContacterenLeads = filteredSubmissions.filter(s => 
      !s.sales_status || s.sales_status === 'te_contacteren'
    );
    const statusContactedLeads = filteredSubmissions.filter(s => s.sales_status === 'gecontacteerd');
    
    const pipelineVelocity = {
      te_contacteren: teContacterenLeads.length > 0 
        ? Math.round(teContacterenLeads.reduce((acc, lead) => {
            const createdDate = new Date(lead.created_at);
            const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
            return acc + daysSinceCreated;
          }, 0) / teContacterenLeads.length)
        : 0,
      gecontacteerd: statusContactedLeads.length > 0 
        ? Math.round(statusContactedLeads.reduce((acc, lead) => {
            const createdDate = new Date(lead.created_at);
            const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
            return acc + daysSinceCreated;
          }, 0) / statusContactedLeads.length)
        : 0
    };

    // Recent activity (last 7 days)
    const recentLeads = filteredSubmissions.filter(s => 
      new Date(s.created_at) >= sevenDaysAgo
    ).length;

    const recentContacted = filteredSubmissions.filter(s => 
      s.sales_status && s.sales_status !== 'te_contacteren' && 
      new Date(s.created_at) >= sevenDaysAgo
    ).length;

    return {
      conversionByRep,
      conversionByType,
      avgResponseTime,
      pipelineVelocity,
      recentLeads,
      recentContacted,
      responseRate: recentLeads > 0 ? Math.round((recentContacted / recentLeads) * 100) : 0
    };
  };

  const openLeadDetails = (lead: FormSubmission) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const stats = getSalesStats();
  const metrics = getSalesMetrics();
  const salesReps = Array.from(new Set(submissions.map(s => s.sales_rep).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Totaal Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Te Contacteren</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.te_contacteren}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Gecontacteerd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.gecontacteerd}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Gesprek Gepland</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.gesprek_gepland}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Afgewezen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.afgewezen}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Niet Toegewezen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unassigned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <SalesFilters
        salesRepFilter={salesRepFilter}
        setSalesRepFilter={setSalesRepFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        marketingStatusFilter={marketingStatusFilter}
        setMarketingStatusFilter={setMarketingStatusFilter}
        salesReps={salesReps}
      />

      {/* Kanban Board */}
      <SalesKanbanBoard
        submissions={filteredSubmissions}
        onStatusUpdate={updateSubmissionStatus}
        onLeadClick={openLeadDetails}
      />

      {/* Sales Metrics & Reporting */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sales Metrics & Reporting</h3>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Gem. Tijd Te Contacteren</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.pipelineVelocity.te_contacteren}</div>
              <p className="text-xs text-muted-foreground">dagen wachtend op contact</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Gem. Tijd Gecontacteerd</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.pipelineVelocity.gecontacteerd}</div>
              <p className="text-xs text-muted-foreground">dagen sinds eerste contact</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Totale Conversie Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {filteredSubmissions.length > 0 
                  ? Math.round((filteredSubmissions.filter(s => s.sales_status === 'gesprek_gepland').length / filteredSubmissions.length) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">naar gesprek gepland</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion by Sales Rep */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Conversie per Sales Rep</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.conversionByRep.map((rep) => (
                  <div key={rep.rep} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{rep.rep}</div>
                      <div className="text-sm text-muted-foreground">
                        {rep.converted}/{rep.total} leads
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${rep.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{rep.rate}%</span>
                    </div>
                  </div>
                ))}
                {metrics.conversionByRep.length === 0 && (
                  <div className="text-sm text-muted-foreground">Geen data beschikbaar</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversion by Lead Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Conversie per Lead Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.conversionByType.map((type) => (
                  <div key={type.type} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{type.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {type.converted}/{type.total} leads
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${type.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{type.rate}%</span>
                    </div>
                  </div>
                ))}
                {metrics.conversionByType.filter(t => t.total > 0).length === 0 && (
                  <div className="text-sm text-muted-foreground">Geen data beschikbaar</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchSubmissions}
      />
    </div>
  );
};