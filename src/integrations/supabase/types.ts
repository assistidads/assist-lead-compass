export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alasan_bukan_leads: {
        Row: {
          alasan: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          alasan: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          alasan?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kode_ads: {
        Row: {
          created_at: string | null
          id: string
          kode: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kode: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kode?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      layanan_assist: {
        Row: {
          created_at: string | null
          id: string
          nama: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nama: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nama?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      prospek: {
        Row: {
          alasan_bukan_leads_id: string | null
          created_at: string | null
          created_by: string
          id: string
          id_ads: string | null
          keterangan_bukan_leads: string | null
          kode_ads_id: string | null
          kota: string
          layanan_assist_id: string | null
          nama_faskes: string
          nama_prospek: string
          no_whatsapp: string
          pic_leads_id: string | null
          provinsi_id: string
          provinsi_nama: string
          status_leads: Database["public"]["Enums"]["status_leads"]
          sumber_leads_id: string | null
          tanggal_prospek: string
          tipe_faskes: Database["public"]["Enums"]["tipe_faskes"]
          updated_at: string | null
        }
        Insert: {
          alasan_bukan_leads_id?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          id_ads?: string | null
          keterangan_bukan_leads?: string | null
          kode_ads_id?: string | null
          kota: string
          layanan_assist_id?: string | null
          nama_faskes: string
          nama_prospek: string
          no_whatsapp: string
          pic_leads_id?: string | null
          provinsi_id: string
          provinsi_nama: string
          status_leads: Database["public"]["Enums"]["status_leads"]
          sumber_leads_id?: string | null
          tanggal_prospek: string
          tipe_faskes: Database["public"]["Enums"]["tipe_faskes"]
          updated_at?: string | null
        }
        Update: {
          alasan_bukan_leads_id?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          id_ads?: string | null
          keterangan_bukan_leads?: string | null
          kode_ads_id?: string | null
          kota?: string
          layanan_assist_id?: string | null
          nama_faskes?: string
          nama_prospek?: string
          no_whatsapp?: string
          pic_leads_id?: string | null
          provinsi_id?: string
          provinsi_nama?: string
          status_leads?: Database["public"]["Enums"]["status_leads"]
          sumber_leads_id?: string | null
          tanggal_prospek?: string
          tipe_faskes?: Database["public"]["Enums"]["tipe_faskes"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospek_alasan_bukan_leads_id_fkey"
            columns: ["alasan_bukan_leads_id"]
            isOneToOne: false
            referencedRelation: "alasan_bukan_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospek_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospek_kode_ads_id_fkey"
            columns: ["kode_ads_id"]
            isOneToOne: false
            referencedRelation: "kode_ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospek_layanan_assist_id_fkey"
            columns: ["layanan_assist_id"]
            isOneToOne: false
            referencedRelation: "layanan_assist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospek_pic_leads_id_fkey"
            columns: ["pic_leads_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospek_sumber_leads_id_fkey"
            columns: ["sumber_leads_id"]
            isOneToOne: false
            referencedRelation: "sumber_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sumber_leads: {
        Row: {
          created_at: string | null
          id: string
          nama: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nama: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nama?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      status_leads:
        | "Prospek"
        | "Dihubungi"
        | "Leads"
        | "Bukan Leads"
        | "On Going"
      tipe_faskes:
        | "Rumah Sakit"
        | "Klinik"
        | "Puskesmas"
        | "Laboratorium"
        | "Apotek"
      user_role: "admin" | "cs_support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_leads: [
        "Prospek",
        "Dihubungi",
        "Leads",
        "Bukan Leads",
        "On Going",
      ],
      tipe_faskes: [
        "Rumah Sakit",
        "Klinik",
        "Puskesmas",
        "Laboratorium",
        "Apotek",
      ],
      user_role: ["admin", "cs_support"],
    },
  },
} as const
