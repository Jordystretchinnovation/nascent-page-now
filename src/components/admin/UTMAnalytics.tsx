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
import { SimpleMultiSelect as MultiSelect, type Option } from "@/components/ui/simple-multi-select";

interface FormSubmissionWithUTM {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  email: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

interface UTMAnalyticsProps {
  submissions: FormSubmissionWithUTM[];
}

export const UTMAnalytics = ({ submissions }: UTMAnalyticsProps) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmissionWithUTM[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUTMSource, setFilterUTMSource] = useState<string[]>([]);
  const [filterUTMMedium, setFilterUTMMedium] = useState<string[]>([]);
  const [filterUTMCampaign, setFilterUTMCampaign] = useState<string[]>([]);
  const [filterUTMContent, setFilterUTMContent] = useState<string[]>([]);
  const [filterUTMTerm, setFilterUTMTerm] = useState<string[]>([]);

  // Ensure submissions is always an array to prevent iteration errors
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  // Get unique values for filter options - with proper safety checks
  const uniqueUTMSources: Option[] = Array.from(new Set(safeSubmissions.map(s => s?.utm_source).filter(Boolean)))
    .map(source => ({ label: source!, value: source! }));
  const uniqueUTMMediums: Option[] = Array.from(new Set(safeSubmissions.map(s => s?.utm_medium).filter(Boolean)))
    .map(medium => ({ label: medium!, value: medium! }));
  const uniqueUTMCampaigns: Option[] = Array.from(new Set(safeSubmissions.map(s => s?.utm_campaign).filter(Boolean)))
    .map(campaign => ({ label: campaign!, value: campaign! }));
  const uniqueUTMContents: Option[] = Array.from(new Set(safeSubmissions.map(s => s?.utm_content).filter(Boolean)))
    .map(content => ({ label: content!, value: content! }));
  const uniqueUTMTerms: Option[] = Array.from(new Set(safeSubmissions.map(s => s?.utm_term).filter(Boolean)))
    .map(term => ({ label: term!, value: term! }));

  useEffect(() => {
    let filtered = safeSubmissions;

    if (filterType !== "all") {
      filtered = filtered.filter(sub => sub?.type === filterType);
    }

    if (filterUTMSource.length > 0) {
      filtered = filtered.filter(sub => sub?.utm_source && filterUTMSource.includes(sub.utm_source));
    }

    if (filterUTMMedium.length > 0) {
      filtered = filtered.filter(sub => sub?.utm_medium && filterUTMMedium.includes(sub.utm_medium));
    }

    if (filterUTMCampaign.length > 0) {
      filtered = filtered.filter(sub => sub?.utm_campaign && filterUTMCampaign.includes(sub.utm_campaign));
    }

    if (filterUTMContent.length > 0) {
      filtered = filtered.filter(sub => sub?.utm_content && filterUTMContent.includes(sub.utm_content));
    }

    if (filterUTMTerm.length > 0) {
      filtered = filtered.filter(sub => sub?.utm_term && filterUTMTerm.includes(sub.utm_term));
    }

    setFilteredSubmissions(filtered);
  }, [safeSubmissions, filterType, filterUTMSource, filterUTMMedium, filterUTMCampaign, filterUTMContent, filterUTMTerm]);

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
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="pt-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              UTM Analytics
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredSubmissions.length} inzending{filteredSubmissions.length !== 1 ? 'en' : ''} gevonden
            </p>
          </div>
          
          {safeSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter op type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  <SelectItem value="stalen">Stalen</SelectItem>
                  <SelectItem value="renderboek">Collection Lookbook</SelectItem>
                  <SelectItem value="korting">Korting</SelectItem>
                </SelectContent>
              </Select>

              {uniqueUTMSources.length > 0 && (
                <MultiSelect
                  options={uniqueUTMSources}
                  selected={filterUTMSource}
                  onChange={setFilterUTMSource}
                  placeholder="Filter op UTM Source"
                />
              )}

              {uniqueUTMMediums.length > 0 && (
                <MultiSelect
                  options={uniqueUTMMediums}
                  selected={filterUTMMedium}
                  onChange={setFilterUTMMedium}
                  placeholder="Filter op UTM Medium"
                />
              )}

              {uniqueUTMCampaigns.length > 0 && (
                <MultiSelect
                  options={uniqueUTMCampaigns}
                  selected={filterUTMCampaign}
                  onChange={setFilterUTMCampaign}
                  placeholder="Filter op UTM Campaign"
                />
              )}

              {uniqueUTMContents.length > 0 && (
                <MultiSelect
                  options={uniqueUTMContents}
                  selected={filterUTMContent}
                  onChange={setFilterUTMContent}
                  placeholder="Filter op UTM Content"
                />
              )}

              {uniqueUTMTerms.length > 0 && (
                <MultiSelect
                  options={uniqueUTMTerms}
                  selected={filterUTMTerm}
                  onChange={setFilterUTMTerm}
                  placeholder="Filter op UTM Term"
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Geen data beschikbaar voor filtering.</p>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">UTM Parameters Overzicht</CardTitle>
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
                    <TableHead className="text-xs font-medium text-muted-foreground">Naam</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Source</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Medium</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Campaign</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Content</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">UTM Term</TableHead>
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
                      <TableCell className="text-sm font-medium text-foreground">
                        {submission.voornaam} {submission.achternaam}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {submission.email}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_source || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_medium || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_campaign || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_content || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {submission.utm_term || '—'}
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
