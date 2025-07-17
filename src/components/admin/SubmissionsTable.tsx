
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  marketing_optin: boolean;
  language: string;
  utm_source: string | null;
  created_at: string;
}

interface SubmissionsTableProps {
  submissions: FormSubmission[];
}

export const SubmissionsTable = ({ submissions }: SubmissionsTableProps) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  useEffect(() => {
    let filtered = submissions;
    
    if (filterType !== "all") {
      filtered = filtered.filter(sub => sub.type === filterType);
    }
    
    if (filterLanguage !== "all") {
      filtered = filtered.filter(sub => sub.language === filterLanguage);
    }
    
    setFilteredSubmissions(filtered);
  }, [submissions, filterType, filterLanguage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getLanguageLabel = (language: string) => {
    return language === 'nl' ? 'Nederlands' : 'Français';
  };

  const getLanguageBadgeVariant = (language: string) => {
    return language === 'nl' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="pt-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Formulierinzendingen
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredSubmissions.length} inzending{filteredSubmissions.length !== 1 ? 'en' : ''} gevonden
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter op type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle types</SelectItem>
                <SelectItem value="stalen">Stalen</SelectItem>
                <SelectItem value="renderboek">Collection Lookbook</SelectItem>
                <SelectItem value="korting">Korting</SelectItem>
                <SelectItem value="keukentrends">Keukentrends</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter op taal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle talen</SelectItem>
                <SelectItem value="nl">Nederlands</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Overzicht inzendingen</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Geen formulierinzendingen gevonden voor de geselecteerde filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Datum</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Source</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Taal</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Naam</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Bedrijf</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Telefoon</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Adres</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Renderbook Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Marketing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(submission.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(submission.type)} className="text-xs">
                          {getTypeLabel(submission.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_source || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLanguageBadgeVariant(submission.language)} className="text-xs">
                          {getLanguageLabel(submission.language)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">
                        {submission.voornaam} {submission.achternaam}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{submission.bedrijf}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {submission.email}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{submission.telefoon || '—'}</TableCell>
                      <TableCell>
                        {submission.straat ? (
                          <div className="text-sm">
                            <div className="text-foreground">{submission.straat}</div>
                            <div className="text-xs text-muted-foreground">
                              {submission.postcode} {submission.gemeente}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {submission.renderbook_type ? (
                          <Badge variant="outline" className="text-xs">
                            {submission.renderbook_type}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={submission.marketing_optin ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {submission.marketing_optin ? 'Ja' : 'Nee'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
