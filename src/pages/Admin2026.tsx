import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { UTMAnalytics } from "@/components/admin/UTMAnalytics";
import CampaignAnalytics from "@/components/admin/CampaignAnalytics";
import LeadQualificationTable from "@/components/admin/LeadQualificationTable";
import { SalesDashboard } from "@/components/admin/SalesDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Download, LogOut, BarChart3 } from "lucide-react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";

interface FormSubmission {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  type_bedrijf: string | null;
  email: string;
  telefoon: string | null;
  straat: string | null;
  postcode: string | null;
  gemeente: string | null;
  message: string | null;
  renderbook_type: string | null;
  kwaliteit: string | null;
  toelichting: string | null;
  sales_status: string | null;
  sales_rep: string | null;
  sales_comment: string | null;
  marketing_optin: boolean;
  language: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

const Admin2026 = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);
  const { toast } = useToast();

  // Filter states for submissions
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  // Filter states for UTM Analytics
  const [filterUTMSource, setFilterUTMSource] = useState<string[]>([]);
  const [filterUTMMedium, setFilterUTMMedium] = useState<string[]>([]);
  const [filterUTMCampaign, setFilterUTMCampaign] = useState<string[]>([]);
  const [filterUTMContent, setFilterUTMContent] = useState<string[]>([]);
  const [filterUTMTerm, setFilterUTMTerm] = useState<string[]>([]);
  const [filterTypeBedrijf, setFilterTypeBedrijf] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState("submissions");
  const [filterQuality, setFilterQuality] = useState<string>("all");

  useEffect(() => {
    fetchSubmissions();
    
    // Set up real-time listener for 2026 table
    const channel = supabase
      .channel('admin_submissions_2026_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions_2026'
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
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions_2026')
        .select(`
          id,
          type,
          voornaam,
          achternaam,
          bedrijf,
          type_bedrijf,
          email,
          telefoon,
          straat,
          postcode,
          gemeente,
          message,
          renderbook_type,
          kwaliteit,
          toelichting,
          sales_status,
          sales_rep,
          sales_comment,
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
    
    if (filterType.length > 0) {
      filtered = filtered.filter(sub => filterType.includes(sub.type));
    }
    
    if (filterLanguage !== "all") {
      filtered = filtered.filter(sub => sub.language === filterLanguage);
    }
    
    if (filterQuality !== "all") {
      if (filterQuality === "ongekwalificeerd") {
        filtered = filtered.filter(sub => !sub.kwaliteit);
      } else if (filterQuality === "Goed - klant") {
        filtered = filtered.filter(sub => sub.kwaliteit === "Goed - klant");
      } else {
        filtered = filtered.filter(sub => sub.kwaliteit === filterQuality);
      }
    }
    
    return filtered;
  };

  const getUTMFilteredData = () => {
    let filtered = submissions;
    
    if (filterType.length > 0) {
      filtered = filtered.filter(sub => filterType.includes(sub.type));
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

    if (filterTypeBedrijf.length > 0) {
      filtered = filtered.filter(sub => sub.type_bedrijf && filterTypeBedrijf.includes(sub.type_bedrijf));
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
      mql: stats.MQL || 0,
      goedKlant: stats['Goed - klant'] || 0,
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
      const excelData = submissions.map(submission => ({
        'ID': submission.id,
        'Type': getTypeLabel(submission.type),
        'Voornaam': submission.voornaam,
        'Achternaam': submission.achternaam,
        'Bedrijf': submission.bedrijf,
        'Type Bedrijf': submission.type_bedrijf || '',
        'Email': submission.email,
        'Telefoon': submission.telefoon || '',
        'Straat': submission.straat || '',
        'Postcode': submission.postcode || '',
        'Gemeente': submission.gemeente || '',
        'Bericht': submission.message || '',
        'Renderbook Type': submission.renderbook_type || '',
        'Kwaliteit': submission.kwaliteit || '',
        'Toelichting': submission.toelichting || '',
        'Sales Status': submission.sales_status || '',
        'Sales Rep': submission.sales_rep || '',
        'Sales Opmerking': submission.sales_comment || '',
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

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 36 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 10 },
        { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
        { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 12 }, { wch: 10 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 18 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Formulierinzendingen 2026');

      const today = new Date().toISOString().split('T')[0];
      const filename = `formulierinzendingen_2026_${today}.xlsx`;

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

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

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
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Admin Dashboard 2026
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Beheer en analyseer formulierinzendingen vanaf 2026
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                Admin 2025
              </Button>
            </Link>
            <Link to="/admin/project-analysis">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Project Analysis
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Uitloggen
            </Button>
          </div>
        </div>

        {activeTab !== "sales" && (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "ongekwalificeerd" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "ongekwalificeerd" ? "all" : "ongekwalificeerd")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Ongekwalificeerd</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.ongekwalificeerd}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "Goed" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "Goed" ? "all" : "Goed")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Goed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.goed}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "MQL" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "MQL" ? "all" : "MQL")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">MQL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.mql}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "Goed - klant" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "Goed - klant" ? "all" : "Goed - klant")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Goed - Klant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.goedKlant}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "Redelijk" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "Redelijk" ? "all" : "Redelijk")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Redelijk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.redelijk}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filterQuality === "Slecht" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setFilterQuality(filterQuality === "Slecht" ? "all" : "Slecht")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Slecht</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{qualityStats.slecht}</div>
                  <p className="text-xs text-muted-foreground">inzendingen</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {filterQuality !== "all" && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium">Actief filter:</span>
            <Badge variant="secondary" className="text-sm">
              {filterQuality === "ongekwalificeerd" ? "Ongekwalificeerd" : filterQuality}
            </Badge>
            <button
              onClick={() => setFilterQuality("all")}
              className="ml-2 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Filter wissen
            </button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-5 w-auto">
              <TabsTrigger value="submissions">Inzendingen</TabsTrigger>
              <TabsTrigger value="qualification">Kwalificatie Leads</TabsTrigger>
              <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
              <TabsTrigger value="utm">UTM Analytics</TabsTrigger>
              <TabsTrigger value="campaign">Campaign Analytics</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporteer naar Excel
              </Button>
            </div>
          </div>
          
          <TabsContent value="submissions" className="space-y-4 mt-4">
            <SubmissionsTable 
              submissions={getSubmissionsFilteredData()}
              filterType={filterType}
              setFilterType={setFilterType}
              filterLanguage={filterLanguage}
              setFilterLanguage={setFilterLanguage}
            />
          </TabsContent>
          
          <TabsContent value="qualification" className="space-y-4 mt-4">
            <LeadQualificationTable submissions={getSubmissionsFilteredData()} />
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            <SalesDashboard tableName="form_submissions_2026" />
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
                filterTypeBedrijf={filterTypeBedrijf}
                setFilterTypeBedrijf={setFilterTypeBedrijf}
              />
            )}
          </TabsContent>
          
          <TabsContent value="campaign" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Laden...</div>
              </div>
            ) : (
              <CampaignAnalytics 
                submissions={submissions}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin2026;
