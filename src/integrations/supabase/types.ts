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
      achievements: {
        Row: {
          data_obtida: string | null
          descricao: string
          id: string
          tipo: Database["public"]["Enums"]["achievement_type"]
          titulo: string
          user_id: string
          xp_bonus: number | null
        }
        Insert: {
          data_obtida?: string | null
          descricao: string
          id?: string
          tipo: Database["public"]["Enums"]["achievement_type"]
          titulo: string
          user_id: string
          xp_bonus?: number | null
        }
        Update: {
          data_obtida?: string | null
          descricao?: string
          id?: string
          tipo?: Database["public"]["Enums"]["achievement_type"]
          titulo?: string
          user_id?: string
          xp_bonus?: number | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          cor: string
          created_at: string | null
          descricao: string
          icone: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          cor: string
          created_at?: string | null
          descricao: string
          icone: string
          id?: string
          nome: string
          ordem: number
        }
        Update: {
          cor?: string
          created_at?: string | null
          descricao?: string
          icone?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      exercises: {
        Row: {
          alternativas: Json | null
          created_at: string | null
          enunciado: string
          explicacao: string | null
          id: string
          lesson_id: string
          ordem: number
          resposta_certa: string
          tipo: Database["public"]["Enums"]["exercise_type"]
        }
        Insert: {
          alternativas?: Json | null
          created_at?: string | null
          enunciado: string
          explicacao?: string | null
          id?: string
          lesson_id: string
          ordem: number
          resposta_certa: string
          tipo: Database["public"]["Enums"]["exercise_type"]
        }
        Update: {
          alternativas?: Json | null
          created_at?: string | null
          enunciado?: string
          explicacao?: string | null
          id?: string
          lesson_id?: string
          ordem?: number
          resposta_certa?: string
          tipo?: Database["public"]["Enums"]["exercise_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          conteudo: string
          course_id: string
          created_at: string | null
          dificuldade: string | null
          id: string
          ordem: number
          titulo: string
          xp_reward: number | null
        }
        Insert: {
          conteudo: string
          course_id: string
          created_at?: string | null
          dificuldade?: string | null
          id?: string
          ordem: number
          titulo: string
          xp_reward?: number | null
        }
        Update: {
          conteudo?: string
          course_id?: string
          created_at?: string | null
          dificuldade?: string | null
          id?: string
          ordem?: number
          titulo?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          created_at: string | null
          dias_consecutivos: number | null
          id: string
          maior_streak: number | null
          ultima_atividade: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dias_consecutivos?: number | null
          id?: string
          maior_streak?: number | null
          ultima_atividade?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dias_consecutivos?: number | null
          id?: string
          maior_streak?: number | null
          ultima_atividade?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          concluido: boolean | null
          created_at: string | null
          data_conclusao: string | null
          id: string
          lesson_id: string
          pontuacao: number | null
          tentativas: number | null
          user_id: string
        }
        Insert: {
          concluido?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          id?: string
          lesson_id: string
          pontuacao?: number | null
          tentativas?: number | null
          user_id: string
        }
        Update: {
          concluido?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          id?: string
          lesson_id?: string
          pontuacao?: number | null
          tentativas?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profile: {
        Row: {
          avatar: string | null
          created_at: string | null
          escola: string | null
          id: string
          idade: number | null
          nome: string
          streak_atual: number | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          escola?: string | null
          id: string
          idade?: number | null
          nome: string
          streak_atual?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          escola?: string | null
          id?: string
          idade?: number | null
          nome?: string
          streak_atual?: number | null
          updated_at?: string | null
          xp?: number | null
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
      achievement_type:
        | "first_lesson"
        | "streak_7"
        | "streak_30"
        | "math_master"
        | "physics_expert"
        | "chemistry_pro"
        | "biology_ace"
      exercise_type: "multiple_choice" | "true_false" | "numeric" | "text"
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
      achievement_type: [
        "first_lesson",
        "streak_7",
        "streak_30",
        "math_master",
        "physics_expert",
        "chemistry_pro",
        "biology_ace",
      ],
      exercise_type: ["multiple_choice", "true_false", "numeric", "text"],
    },
  },
} as const
