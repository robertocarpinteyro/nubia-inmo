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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          assigned_advisor: string | null
          client_email: string | null
          client_name: string
          client_phone: string
          created_at: string | null
          google_calendar_event_id: string | null
          id: string
          notes: string | null
          property_id: string
          property_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          assigned_advisor?: string | null
          client_email?: string | null
          client_name: string
          client_phone: string
          created_at?: string | null
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          property_id: string
          property_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          assigned_advisor?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string | null
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          property_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: Json
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          featured: boolean | null
          floor_plans: string[] | null
          half_bathrooms: number | null
          id: string
          images: string[] | null
          latitude: number | null
          location: Json
          location_city: string | null
          location_development: string | null
          longitude: number | null
          map_embed_url: string | null
          name: string
          operation_type: string | null
          parking_spots: number | null
          pet_friendly: boolean | null
          price: number | null
          price_per_sqm: number | null
          property_condition: string | null
          property_id: string
          published: boolean | null
          search_vector: unknown
          status: string | null
          subtype: string | null
          technical_sheet_url: string | null
          type: string
          updated_at: string | null
          video_url: string | null
          virtual_tour: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area: Json
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          floor_plans?: string[] | null
          half_bathrooms?: number | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location: Json
          location_city?: string | null
          location_development?: string | null
          longitude?: number | null
          map_embed_url?: string | null
          name: string
          operation_type?: string | null
          parking_spots?: number | null
          pet_friendly?: boolean | null
          price?: number | null
          price_per_sqm?: number | null
          property_condition?: string | null
          property_id: string
          published?: boolean | null
          search_vector?: unknown
          status?: string | null
          subtype?: string | null
          technical_sheet_url?: string | null
          type: string
          updated_at?: string | null
          video_url?: string | null
          virtual_tour?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: Json
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          floor_plans?: string[] | null
          half_bathrooms?: number | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: Json
          location_city?: string | null
          location_development?: string | null
          longitude?: number | null
          map_embed_url?: string | null
          name?: string
          operation_type?: string | null
          parking_spots?: number | null
          pet_friendly?: boolean | null
          price?: number | null
          price_per_sqm?: number | null
          property_condition?: string | null
          property_id?: string
          published?: boolean | null
          search_vector?: unknown
          status?: string | null
          subtype?: string | null
          technical_sheet_url?: string | null
          type?: string
          updated_at?: string | null
          video_url?: string | null
          virtual_tour?: string | null
        }
        Relationships: []
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

// ── Alias de conveniencia ─────────────────────────────────────────
export type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"]
