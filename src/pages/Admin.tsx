
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { UTMAnalytics } from "@/components/admin/UTMAnalytics";
import LeadQualificationTable from "@/components/admin/LeadQualificationTable";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';

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
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter states for submissions
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  // Filter states for UTM Analytics
  const [filterUTMSource, setFilterUTMSource] = useState<string[]>([]);
  const [filterUTMMedium, setFilterUTMMedium] = useState<string[]>([]);
  const [filterUTMCampaign, setFilterUTMCampaign] = useState<string[]>([]);
  const [filterUTMContent, setFilterUTMContent] = useState<string[]>([]);
  const [filterUTMTerm, setFilterUTMTerm] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState("submissions");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select(`
          id,
          type,
          voornaam,
          achternaam,
          bedrijf,
          email,
          telefoon,
          straat,
          postcode,
          gemeente,
          renderbook_type,
          kwaliteit,
          marketing_optin,
          language,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Fout bij ophalen gegevens",
          description: "Er is een fout opgetreden bij het ophalen van de formulierinzendingen.",
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

  const getSubmissionsFilteredData = () => {
    let filtered = submissions;
    
    if (filterType !== "all") {
      filtered = filtered.filter(sub => sub.type === filterType);
    }
    
    if (filterLanguage !== "all") {
      filtered = filtered.filter(sub => sub.language === filterLanguage);
    }
    
    return filtered;
  };

  const getUTMFilteredData = () => {
    let filtered = submissions;
    
    if (filterType !== "all") {
      filtered = filtered.filter(sub => sub.type === filterType);
    }

    if (filterUTMSource.length > 0) {
      filtered = filtered.filter(sub => sub.utm_source && filterUTMSource.includes(sub.utm_source));
    }

    if (filterUTMMedium.length > 0) {
      filtered = filtered.filter(sub => sub.utm_medium && filterUTMMedium.includes(sub.utm_medium));
    }

    if (filterUTMCampaign.length > 0) {
      filtered = filtered.filter(sub => sub.utm_campaign && filterUTMCampaign.includes(sub.utm_campaign));
    }

    if (filterUTMContent.length > 0) {
      filtered = filtered.filter(sub => sub.utm_content && filterUTMContent.includes(sub.utm_content));
    }

    if (filterUTMTerm.length > 0) {
      filtered = filtered.filter(sub => sub.utm_term && filterUTMTerm.includes(sub.utm_term));
    }
    
    return filtered;
  };

  const getCurrentFilteredData = () => {
    return activeTab === "utm" ? getUTMFilteredData() : getSubmissionsFilteredData();
  };

  const getSubmissionStats = () => {
    const currentData = getCurrentFilteredData();
    const stats = currentData.reduce((acc, submission) => {
      acc[submission.type] = (acc[submission.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      stalen: stats.stalen || 0,
      renderboek: stats.renderboek || 0,
      korting: stats.korting || 0,
      keukentrends: stats.keukentrends || 0,
      total: currentData.length
    };
  };

  const getQualityStats = () => {
    const currentData = getCurrentFilteredData();
    const stats = currentData.reduce((acc, submission) => {
      const quality = submission.kwaliteit;
      if (!quality) {
        acc.ongekwalificeerd = (acc.ongekwalificeerd || 0) + 1;
      } else {
        acc[quality] = (acc[quality] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      ongekwalificeerd: stats.ongekwalificeerd || 0,
      goed: stats.Goed || 0,
      goedKlant: stats['Goed - Klant'] || 0,
      redelijk: stats.Redelijk || 0,
      slecht: stats.Slecht || 0
    };
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

  const exportToExcel = () => {
    try {
      // Transform data for Excel with proper column names
      const excelData = submissions.map(submission => ({
        'ID': submission.id,
        'Type': getTypeLabel(submission.type),
        'Voornaam': submission.voornaam,
        'Achternaam': submission.achternaam,
        'Bedrijf': submission.bedrijf,
        'Email': submission.email,
        'Telefoon': submission.telefoon || '',
        'Straat': submission.straat || '',
        'Postcode': submission.postcode || '',
        'Gemeente': submission.gemeente || '',
        'Renderbook Type': submission.renderbook_type || '',
        'Marketing Optin': submission.marketing_optin ? 'Ja' : 'Nee',
        'Taal': submission.language === 'nl' ? 'Nederlands' : 'Frans',
        'UTM Source': submission.utm_source || '',
        'UTM Medium': submission.utm_medium || '',
        'UTM Campaign': submission.utm_campaign || '',
        'UTM Content': submission.utm_content || '',
        'UTM Term': submission.utm_term || '',
        'Aangemaakt op': new Date(submission.created_at).toLocaleDateString('nl-NL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      const colWidths = [
        { wch: 36 }, // ID
        { wch: 15 }, // Type
        { wch: 15 }, // Voornaam
        { wch: 15 }, // Achternaam
        { wch: 20 }, // Bedrijf
        { wch: 25 }, // Email
        { wch: 15 }, // Telefoon
        { wch: 25 }, // Straat
        { wch: 10 }, // Postcode
        { wch: 15 }, // Gemeente
        { wch: 15 }, // Renderbook Type
        { wch: 12 }, // Marketing Optin
        { wch: 10 }, // Taal
        { wch: 15 }, // UTM Source
        { wch: 15 }, // UTM Medium
        { wch: 15 }, // UTM Campaign
        { wch: 15 }, // UTM Content
        { wch: 15 }, // UTM Term
        { wch: 18 }  // Aangemaakt op
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Formulierinzendingen');

      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0];
      const filename = `formulierinzendingen_${today}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Export geslaagd",
        description: `Excel bestand "${filename}" is gedownload.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export mislukt",
        description: "Er is een fout opgetreden bij het exporteren naar Excel.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const stats = getSubmissionStats();
  const qualityStats = getQualityStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer en analyseer formulierinzendingen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Totaal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">formulierinzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant('stalen')} className="text-xs">
                  {getTypeLabel('stalen')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.stalen}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant('renderboek')} className="text-xs">
                  {getTypeLabel('renderboek')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.renderboek}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant('korting')} className="text-xs">
                  {getTypeLabel('korting')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.korting}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant('keukentrends')} className="text-xs">
                  {getTypeLabel('keukentrends')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.keukentrends}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Ongekwalificeerd</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityStats.ongekwalificeerd}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Goed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityStats.goed}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Goed - Klant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityStats.goedKlant}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Redelijk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityStats.redelijk}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Slecht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityStats.slecht}</div>
              <p className="text-xs text-muted-foreground">inzendingen</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="submissions">Inzendingen</TabsTrigger>
              <TabsTrigger value="qualification">Kwalificatie Leads</TabsTrigger>
              <TabsTrigger value="utm">UTM Analytics</TabsTrigger>
            </TabsList>
            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporteer naar Excel
            </Button>
          </div>
          
          <TabsContent value="submissions" className="space-y-4 mt-4">
            <SubmissionsTable 
              submissions={submissions}
              filterType={filterType}
              setFilterType={setFilterType}
              filterLanguage={filterLanguage}
              setFilterLanguage={setFilterLanguage}
            />
          </TabsContent>
          
          <TabsContent value="qualification" className="space-y-4 mt-4">
            <LeadQualificationTable />
          </TabsContent>
          
          <TabsContent value="utm" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Laden...</div>
              </div>
            ) : (
              <UTMAnalytics 
                submissions={submissions}
                filterType={filterType}
                setFilterType={setFilterType}
                filterUTMSource={filterUTMSource}
                setFilterUTMSource={setFilterUTMSource}
                filterUTMMedium={filterUTMMedium}
                setFilterUTMMedium={setFilterUTMMedium}
                filterUTMCampaign={filterUTMCampaign}
                setFilterUTMCampaign={setFilterUTMCampaign}
                filterUTMContent={filterUTMContent}
                setFilterUTMContent={setFilterUTMContent}
                filterUTMTerm={filterUTMTerm}
                setFilterUTMTerm={setFilterUTMTerm}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
