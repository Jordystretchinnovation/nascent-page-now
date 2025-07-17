
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { UTMAnalytics } from "@/components/admin/UTMAnalytics";

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

  const getSubmissionStats = () => {
    const stats = submissions.reduce((acc, submission) => {
      acc[submission.type] = (acc[submission.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      stalen: stats.stalen || 0,
      renderboek: stats.renderboek || 0,
      korting: stats.korting || 0,
      keukentrends: stats.keukentrends || 0,
      total: submissions.length
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const stats = getSubmissionStats();

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

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submissions">Inzendingen</TabsTrigger>
            <TabsTrigger value="utm">UTM Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="space-y-4">
            <SubmissionsTable submissions={submissions} />
          </TabsContent>
          
          <TabsContent value="utm" className="space-y-4">
            <UTMAnalytics submissions={submissions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
