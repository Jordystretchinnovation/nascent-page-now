import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FormSubmission {
  id: string;
  created_at: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon: string | null;
  straat: string | null;
  postcode: string | null;
  gemeente: string | null;
  language: string;
  kwaliteit: string | null;
  toelichting: string | null;
  sales_status: string | null;
  sales_rep: string | null;
  sales_comment: string | null;
}

interface LeadQualificationTableProps {
  submissions?: FormSubmission[];
}

const LeadQualificationTable: React.FC<LeadQualificationTableProps> = ({ submissions: propSubmissions }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (propSubmissions) {
      setSubmissions(propSubmissions);
      setLoading(false);
    } else {
      fetchSubmissions();
    }
    
    // Set up real-time listener
    const channel = supabase
      .channel('form_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setSubmissions(prev => prev.map(sub => 
              sub.id === payload.new.id ? { ...sub, ...payload.new } : sub
            ));
          } else if (payload.eventType === 'INSERT') {
            setSubmissions(prev => [payload.new as FormSubmission, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setSubmissions(prev => prev.filter(sub => sub.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propSubmissions]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id: string, field: 'kwaliteit' | 'toelichting' | 'sales_status' | 'sales_rep' | 'sales_comment', value: string | null) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, [field]: value } : sub
        )
      );

      const fieldLabels = {
        kwaliteit: 'Marketing status',
        toelichting: 'Marketing comment',
        sales_status: 'Sales status',
        sales_rep: 'Sales rep',
        sales_comment: 'Sales comment'
      };

      toast({
        title: "Opgeslagen",
        description: `${fieldLabels[field]} is bijgewerkt`,
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het opslaan",
        variant: "destructive"
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'stalen': return 'default';
      case 'keukentrends': return 'secondary';
      case 'lookbook': return 'outline';
      case 'korting': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stalen': return 'Gratis Stalen';
      case 'keukentrends': return 'Keukentrends';
      case 'lookbook': return 'Lookbook';
      case 'korting': return 'Korting';
      default: return type;
    }
  };

  const getKwaliteitBadgeVariant = (kwaliteit: string | null) => {
    switch (kwaliteit) {
      case 'Goed': return 'default';
      case 'Goed - klant': return 'secondary';
      case 'Redelijk': return 'outline';
      case 'MQL': return 'default';
      case 'Slecht': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kwalificatie Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Laden...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kwalificatie Leads ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="table-fixed w-full min-w-[1400px]">
            <colgroup>
              <col className="w-20" />
              <col className="w-16" />
              <col className="w-20" />
              <col className="w-20" />
              <col className="w-48" />
              <col className="w-32" />  
              <col className="w-28" />
              <col className="w-36" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-36" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Bedrijf</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Marketing status</TableHead>
                <TableHead>Marketing comment</TableHead>
                <TableHead>Sales status</TableHead>
                <TableHead>Sales rep</TableHead>
                <TableHead>Sales comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="text-xs">
                    {new Date(submission.created_at).toLocaleDateString('nl-NL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(submission.type)} className="text-xs px-1 py-0">
                      {submission.type === 'stalen' ? 'Stalen' : 
                       submission.type === 'keukentrends' ? 'Trends' :
                       submission.type === 'lookbook' ? 'Book' :
                       submission.type === 'korting' ? 'Korting' : submission.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="break-words">
                      {submission.voornaam} {submission.achternaam}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="break-words">
                      {submission.bedrijf}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="break-all">
                      {submission.email}
                    </div>
                    {submission.telefoon && (
                      <div className="break-words text-muted-foreground mt-0.5">
                        {submission.telefoon}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="break-words">
                      {submission.straat && submission.postcode && submission.gemeente
                        ? `${submission.straat}, ${submission.postcode} ${submission.gemeente}`
                        : '-'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.kwaliteit || ""}
                      onValueChange={(value) => updateSubmission(submission.id, 'kwaliteit', value)}
                      disabled={updatingId === submission.id}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue placeholder="Kies">
                          {submission.kwaliteit && (
                            <Badge variant={getKwaliteitBadgeVariant(submission.kwaliteit)} className="text-xs px-1 py-0">
                              {submission.kwaliteit === 'Goed - klant' ? 'Klant' : submission.kwaliteit}
                            </Badge>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Goed">
                          <Badge variant="default" className="text-xs">Goed</Badge>
                        </SelectItem>
                        <SelectItem value="Goed - klant">
                          <Badge variant="secondary" className="text-xs">Goed - klant</Badge>
                        </SelectItem>
                        <SelectItem value="Redelijk">
                          <Badge variant="outline" className="text-xs">Redelijk</Badge>
                        </SelectItem>
                        <SelectItem value="MQL">
                          <Badge variant="default" className="text-xs">MQL</Badge>
                        </SelectItem>
                        <SelectItem value="Slecht">
                          <Badge variant="destructive" className="text-xs">Slecht</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      defaultValue={submission.toelichting || ""}
                      onBlur={(e) => updateSubmission(submission.id, 'toelichting', e.target.value)}
                      placeholder="Marketing comment..."
                      className="w-36 text-xs resize-none"
                      rows={3}
                      disabled={updatingId === submission.id}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.sales_status || ""}
                      onValueChange={(value) => updateSubmission(submission.id, 'sales_status', value)}
                      disabled={updatingId === submission.id}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Te contacteren">Te contacteren</SelectItem>
                        <SelectItem value="Gecontacteerd">Gecontacteerd</SelectItem>
                        <SelectItem value="Gesprek gepland">Gesprek gepland</SelectItem>
                        <SelectItem value="Afgewezen">Afgewezen</SelectItem>
                        <SelectItem value="Niet relevant">Niet relevant</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.sales_rep || ""}
                      onValueChange={(value) => updateSubmission(submission.id, 'sales_rep', value)}
                      disabled={updatingId === submission.id}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Dominique">Dominique</SelectItem>
                         <SelectItem value="Pierre">Pierre</SelectItem>
                         <SelectItem value="Michael">Michael</SelectItem>
                         <SelectItem value="Michaël">Michaël</SelectItem>
                         <SelectItem value="Alexander">Alexander</SelectItem>
                       </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      defaultValue={submission.sales_comment || ""}
                      onBlur={(e) => updateSubmission(submission.id, 'sales_comment', e.target.value)}
                      placeholder="Sales comment..."
                      className="w-36 text-xs resize-none"
                      rows={3}
                      disabled={updatingId === submission.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadQualificationTable;