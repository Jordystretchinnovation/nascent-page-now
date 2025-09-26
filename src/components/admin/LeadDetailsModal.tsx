import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Building, User, Mail, Phone, MapPin, Tag, MessageSquare } from 'lucide-react';

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

interface LeadDetailsModalProps {
  lead: FormSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [salesStatus, setSalesStatus] = useState('');
  const [salesRep, setSalesRep] = useState('');
  const [salesComment, setSalesComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (lead) {
      setSalesStatus(lead.sales_status || 'te_contacteren');
      setSalesRep(lead.sales_rep || 'none');
      setSalesComment(lead.sales_comment || '');
    }
  }, [lead]);

  if (!lead) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({
          sales_status: salesStatus,
          sales_rep: salesRep === 'none' ? null : salesRep,
          sales_comment: salesComment || null
        })
        .eq('id', lead.id);

      if (error) {
        console.error('Error updating lead:', error);
        toast({
          title: "Fout bij bijwerken",
          description: "Er is een fout opgetreden bij het bijwerken van de lead.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Lead bijgewerkt",
        description: "De lead informatie is succesvol bijgewerkt.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fout",
        description: "Er is een onverwachte fout opgetreden.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'stalen':
        return 'default';
      case 'renderboek':
        return 'secondary';
      case 'korting':
        return 'destructive';
      case 'keukentrends':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stalen':
        return 'Stalen';
      case 'renderboek':
        return 'Collection Lookbook';
      case 'korting':
        return 'Korting';
      case 'keukentrends':
        return 'Keukentrends';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.voornaam} {lead.achternaam}
            <Badge variant={getTypeBadgeVariant(lead.type)}>
              {getTypeLabel(lead.type)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{lead.bedrijf}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              {lead.telefoon && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.telefoon}</span>
                </div>
              )}
              {(lead.straat || lead.postcode || lead.gemeente) && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {[lead.straat, lead.postcode, lead.gemeente].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(lead.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marketing Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Marketing Status</Label>
                <div className="mt-1">
                  {lead.kwaliteit ? (
                    <Badge variant="secondary">{lead.kwaliteit}</Badge>
                  ) : (
                    <Badge variant="outline">Ongekwalificeerd</Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Marketing Opt-in</Label>
                <div className="mt-1">
                  <Badge variant={lead.marketing_optin ? "default" : "destructive"}>
                    {lead.marketing_optin ? "Ja" : "Nee"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Taal</Label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {lead.language === 'nl' ? 'Nederlands' : 'Frans'}
                  </Badge>
                </div>
              </div>
              {lead.toelichting && (
                <div>
                  <Label className="text-sm font-medium">Marketing Toelichting</Label>
                  <p className="text-sm text-muted-foreground mt-1">{lead.toelichting}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* UTM Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Bron</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.utm_source && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Source:</strong> {lead.utm_source}
                  </span>
                </div>
              )}
              {lead.utm_medium && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Medium:</strong> {lead.utm_medium}
                  </span>
                </div>
              )}
              {lead.utm_campaign && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Campaign:</strong> {lead.utm_campaign}
                  </span>
                </div>
              )}
              {lead.utm_content && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Content:</strong> {lead.utm_content}
                  </span>
                </div>
              )}
              {lead.renderbook_type && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Renderbook Type:</strong> {lead.renderbook_type}
                  </span>
                </div>
              )}
              {!lead.utm_source && !lead.utm_medium && !lead.utm_campaign && (
                <p className="text-sm text-muted-foreground">Geen UTM gegevens beschikbaar</p>
              )}
            </CardContent>
          </Card>

          {/* Sales Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Acties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sales-status">Sales Status</Label>
                <Select value={salesStatus} onValueChange={setSalesStatus}>
                  <SelectTrigger id="sales-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="te_contacteren">Te Contacteren</SelectItem>
                    <SelectItem value="gecontacteerd">Gecontacteerd</SelectItem>
                    <SelectItem value="gesprek_gepland">Gesprek Gepland</SelectItem>
                    <SelectItem value="afgewezen">Afgewezen</SelectItem>
                    <SelectItem value="niet_relevant">Niet Relevant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sales-rep">Sales Representative</Label>
                <Select value={salesRep} onValueChange={setSalesRep}>
                  <SelectTrigger id="sales-rep">
                    <SelectValue placeholder="Kies sales rep" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-50">
                    <SelectItem value="none">Geen sales rep</SelectItem>
                    <SelectItem value="Dominique">Dominique</SelectItem>
                    <SelectItem value="Pierre">Pierre</SelectItem>
                    <SelectItem value="Michael">Michael</SelectItem>
                    <SelectItem value="Alexander">Alexander</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sales-comment">Sales Commentaar</Label>
                <Textarea
                  id="sales-comment"
                  value={salesComment}
                  onChange={(e) => setSalesComment(e.target.value)}
                  placeholder="Voeg sales commentaar toe..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Bijwerken...' : 'Bijwerken'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Annuleren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};