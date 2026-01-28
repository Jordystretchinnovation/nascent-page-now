export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      campaign_budgets: {
        Row: {
          budget: number
          campaign_name: string
          click_rate: number | null
          created_at: string
          emails_sent: number | null
          end_date: string | null
          id: string
          notes: string | null
          open_rate: number | null
          start_date: string | null
          updated_at: string
          utm_campaign: string[] | null
          utm_medium: string[] | null
          utm_source: string[] | null
        }
        Insert: {
          budget: number
          campaign_name: string
          click_rate?: number | null
          created_at?: string
          emails_sent?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          open_rate?: number | null
          start_date?: string | null
          updated_at?: string
          utm_campaign?: string[] | null
          utm_medium?: string[] | null
          utm_source?: string[] | null
        }
        Update: {
          budget?: number
          campaign_name?: string
          click_rate?: number | null
          created_at?: string
          emails_sent?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          open_rate?: number | null
          start_date?: string | null
          updated_at?: string
          utm_campaign?: string[] | null
          utm_medium?: string[] | null
          utm_source?: string[] | null
        }
        Relationships: []
      }
      colbloc_submissions: {
        Row: {
          achternaam: string
          bedrijf: string
          created_at: string
          email: string
          gemeente: string | null
          id: string
          kwaliteit: string | null
          language: string
          marketing_optin: boolean
          message: string | null
          postcode: string | null
          renderbook_type: string | null
          sales_comment: string | null
          sales_rep: string | null
          sales_status: string | null
          straat: string | null
          telefoon: string | null
          toelichting: string | null
          type: string
          type_bedrijf: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          voornaam: string
        }
        Insert: {
          achternaam: string
          bedrijf: string
          created_at?: string
          email: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam: string
        }
        Update: {
          achternaam?: string
          bedrijf?: string
          created_at?: string
          email?: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type?: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam?: string
        }
        Relationships: []
      }
      decision_triggers: {
        Row: {
          action_fail: string | null
          action_success: string | null
          adset_pattern: string
          applies_to_campaign_type: string | null
          created_at: string | null
          evaluation_week: number | null
          id: string
          is_active: boolean | null
          market: string | null
          metric: string
          operator: string
          severity: string
          shift_to_adset: string | null
          threshold_value: number | null
          trigger_name: string
        }
        Insert: {
          action_fail?: string | null
          action_success?: string | null
          adset_pattern: string
          applies_to_campaign_type?: string | null
          created_at?: string | null
          evaluation_week?: number | null
          id?: string
          is_active?: boolean | null
          market?: string | null
          metric: string
          operator: string
          severity: string
          shift_to_adset?: string | null
          threshold_value?: number | null
          trigger_name: string
        }
        Update: {
          action_fail?: string | null
          action_success?: string | null
          adset_pattern?: string
          applies_to_campaign_type?: string | null
          created_at?: string | null
          evaluation_week?: number | null
          id?: string
          is_active?: boolean | null
          market?: string | null
          metric?: string
          operator?: string
          severity?: string
          shift_to_adset?: string | null
          threshold_value?: number | null
          trigger_name?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          achternaam: string
          bedrijf: string
          created_at: string
          email: string
          gemeente: string | null
          id: string
          kwaliteit: string | null
          language: string
          marketing_optin: boolean
          message: string | null
          postcode: string | null
          renderbook_type: string | null
          sales_comment: string | null
          sales_rep: string | null
          sales_status: string | null
          straat: string | null
          telefoon: string | null
          toelichting: string | null
          type: string
          type_bedrijf: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          voornaam: string
        }
        Insert: {
          achternaam: string
          bedrijf: string
          created_at?: string
          email: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam: string
        }
        Update: {
          achternaam?: string
          bedrijf?: string
          created_at?: string
          email?: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type?: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam?: string
        }
        Relationships: []
      }
      form_submissions_2026: {
        Row: {
          achternaam: string
          bedrijf: string
          created_at: string
          email: string
          gemeente: string | null
          id: string
          kwaliteit: string | null
          language: string
          marketing_optin: boolean
          message: string | null
          postcode: string | null
          renderbook_type: string | null
          sales_comment: string | null
          sales_rep: string | null
          sales_status: string | null
          straat: string | null
          telefoon: string | null
          toelichting: string | null
          type: string
          type_bedrijf: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          voornaam: string
        }
        Insert: {
          achternaam: string
          bedrijf: string
          created_at?: string
          email: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam: string
        }
        Update: {
          achternaam?: string
          bedrijf?: string
          created_at?: string
          email?: string
          gemeente?: string | null
          id?: string
          kwaliteit?: string | null
          language?: string
          marketing_optin?: boolean
          message?: string | null
          postcode?: string | null
          renderbook_type?: string | null
          sales_comment?: string | null
          sales_rep?: string | null
          sales_status?: string | null
          straat?: string | null
          telefoon?: string | null
          toelichting?: string | null
          type?: string
          type_bedrijf?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          voornaam?: string
        }
        Relationships: []
      }
      meta_performance: {
        Row: {
          ad_name: string
          adset_name: string
          campaign_name: string
          created_at: string | null
          date: string
          frequency: number | null
          id: string
          spent: number
        }
        Insert: {
          ad_name: string
          adset_name: string
          campaign_name: string
          created_at?: string | null
          date: string
          frequency?: number | null
          id?: string
          spent: number
        }
        Update: {
          ad_name?: string
          adset_name?: string
          campaign_name?: string
          created_at?: string | null
          date?: string
          frequency?: number | null
          id?: string
          spent?: number
        }
        Relationships: []
      }
      meta_sync_campaigns: {
        Row: {
          campaign_id: string
          campaign_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          campaign_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          campaign_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      triggered_alerts: {
        Row: {
          adset_name: string
          campaign_name: string
          current_value: number | null
          id: string
          metric_name: string
          notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string | null
          threshold_value: number | null
          trigger_id: string | null
          triggered_at: string | null
        }
        Insert: {
          adset_name: string
          campaign_name: string
          current_value?: number | null
          id?: string
          metric_name: string
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string | null
          threshold_value?: number | null
          trigger_id?: string | null
          triggered_at?: string | null
        }
        Update: {
          adset_name?: string
          campaign_name?: string
          current_value?: number | null
          id?: string
          metric_name?: string
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string | null
          threshold_value?: number | null
          trigger_id?: string | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "triggered_alerts_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "decision_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
