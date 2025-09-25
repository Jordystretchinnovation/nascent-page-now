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
}

const LeadQualificationTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

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

  const updateSubmission = async (id: string, field: 'kwaliteit' | 'toelichting', value: string | null) => {
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

      toast({
        title: "Opgeslagen",
        description: `${field === 'kwaliteit' ? 'Kwaliteit' : 'Toelichting'} is bijgewerkt`,
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Bedrijf</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tel</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Kwaliteit</TableHead>
                <TableHead>Toelichting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(submission.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(submission.type)}>
                      {getTypeLabel(submission.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {submission.voornaam} {submission.achternaam}
                  </TableCell>
                  <TableCell>{submission.bedrijf}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.telefoon || '-'}</TableCell>
                  <TableCell>
                    {submission.straat && submission.postcode && submission.gemeente
                      ? `${submission.straat}, ${submission.postcode} ${submission.gemeente}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.kwaliteit || ""}
                      onValueChange={(value) => updateSubmission(submission.id, 'kwaliteit', value)}
                      disabled={updatingId === submission.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Selecteer">
                          {submission.kwaliteit && (
                            <Badge variant={getKwaliteitBadgeVariant(submission.kwaliteit)} className="text-xs">
                              {submission.kwaliteit}
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
                        <SelectItem value="Slecht">
                          <Badge variant="destructive" className="text-xs">Slecht</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={submission.toelichting || ""}
                      onChange={(e) => updateSubmission(submission.id, 'toelichting', e.target.value)}
                      placeholder="Voeg toelichting toe..."
                      className="min-w-[200px] resize-none"
                      rows={2}
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