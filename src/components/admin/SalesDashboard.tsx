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
      afgewezen: stats.afgewezen || 0,
      niet_relevant: stats.niet_relevant || 0,
      total: filteredSubmissions.length,
      unassigned: filteredSubmissions.filter(s => !s.sales_rep).length
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