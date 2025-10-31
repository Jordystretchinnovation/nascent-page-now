import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { LogOut, Download } from "lucide-react";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
import { CampaignPerformanceTable } from "@/components/admin/CampaignPerformanceTable";
import { BudgetInput } from "@/components/admin/BudgetInput";
import { ChannelBreakdown } from "@/components/admin/ChannelBreakdown";
import { RecommendationsSection } from "@/components/admin/RecommendationsSection";
import { PerformanceCharts } from "@/components/admin/PerformanceCharts";

interface FormSubmission {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  type_bedrijf: string | null;
  email: string;
  kwaliteit: string | null;
  sales_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

interface CampaignBudget {
  id: string;
  campaign_name: string;
  utm_campaign: string[] | null;
  utm_source: string[] | null;
  utm_medium: string[] | null;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
}

const AdminProjectAnalysis = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [budgets, setBudgets] = useState<CampaignBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const authenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('form_submissions')
        .select('id, type, voornaam, achternaam, bedrijf, type_bedrijf, email, kwaliteit, sales_status, utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('campaign_budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (budgetsError) throw budgetsError;

      setSubmissions(submissionsData || []);
      setBudgets(budgetsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to fetch analysis data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetUpdate = () => {
    fetchData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const exportToPDF = () => {
    window.print();
    toast({
      title: "Export initiated",
      description: "Use browser print dialog to save as PDF.",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading analysis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Project Analysis
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Executive summary and campaign performance insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <ExecutiveSummary submissions={submissions} />

        <PerformanceCharts submissions={submissions} />

        <ChannelBreakdown submissions={submissions} budgets={budgets} />

        <BudgetInput budgets={budgets} onBudgetUpdate={handleBudgetUpdate} />

        <CampaignPerformanceTable submissions={submissions} budgets={budgets} />

        <RecommendationsSection submissions={submissions} budgets={budgets} />
      </div>
    </div>
  );
};

export default AdminProjectAnalysis;
