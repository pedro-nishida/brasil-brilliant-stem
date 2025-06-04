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
          color: string | null
          data_obtida: string | null
          descricao: string
          icon: string | null
          id: string
          is_secret: boolean | null
          progress_current: number | null
          progress_target: number | null
          tipo: Database["public"]["Enums"]["achievement_type"]
          titulo: string
          user_id: string
          xp_bonus: number | null
        }
        Insert: {
          color?: string | null
          data_obtida?: string | null
          descricao: string
          icon?: string | null
          id?: string
          is_secret?: boolean | null
          progress_current?: number | null
          progress_target?: number | null
          tipo: Database["public"]["Enums"]["achievement_type"]
          titulo: string
          user_id: string
          xp_bonus?: number | null
        }
        Update: {
          color?: string | null
          data_obtida?: string | null
          descricao?: string
          icon?: string | null
          id?: string
          is_secret?: boolean | null
          progress_current?: number | null
          progress_target?: number | null
          tipo?: Database["public"]["Enums"]["achievement_type"]
          titulo?: string
          user_id?: string
          xp_bonus?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          message_type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          message_type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          message_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
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
      discussion_likes: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          likes_count: number | null
          parent_reply_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          replies_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          alternativas: Json | null
          created_at: string | null
          dificuldade: string | null
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
          dificuldade?: string | null
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
          dificuldade?: string | null
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
      hints: {
        Row: {
          content: string
          created_at: string | null
          exercise_id: string
          hint_level: number
          id: string
          ordem: number
        }
        Insert: {
          content: string
          created_at?: string | null
          exercise_id: string
          hint_level?: number
          id?: string
          ordem?: number
        }
        Update: {
          content?: string
          created_at?: string | null
          exercise_id?: string
          hint_level?: number
          id?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "hints_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          categoria: string | null
          conteudo_teoria: string
          cor: string | null
          course_id: string | null
          created_at: string | null
          difficulty_level: number | null
          dificuldade: string | null
          icone: string | null
          id: string
          is_checkpoint: boolean | null
          mastery_threshold: number | null
          nivel: string | null
          ordem: number
          prerequisite_lesson_id: string | null
          titulo: string
          worksheet_count: number | null
          xp_reward: number | null
        }
        Insert: {
          categoria?: string | null
          conteudo_teoria: string
          cor?: string | null
          course_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          dificuldade?: string | null
          icone?: string | null
          id?: string
          is_checkpoint?: boolean | null
          mastery_threshold?: number | null
          nivel?: string | null
          ordem: number
          prerequisite_lesson_id?: string | null
          titulo: string
          worksheet_count?: number | null
          xp_reward?: number | null
        }
        Update: {
          categoria?: string | null
          conteudo_teoria?: string
          cor?: string | null
          course_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          dificuldade?: string | null
          icone?: string | null
          id?: string
          is_checkpoint?: boolean | null
          mastery_threshold?: number | null
          nivel?: string | null
          ordem?: number
          prerequisite_lesson_id?: string | null
          titulo?: string
          worksheet_count?: number | null
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
          {
            foreignKeyName: "lessons_prerequisite_lesson_id_fkey"
            columns: ["prerequisite_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      math_questions: {
        Row: {
          alternativas: Json | null
          created_at: string
          dificuldade: string | null
          enunciado: string
          explicacao: string | null
          id: string
          ordem: number
          resposta_certa: string
          tipo: string | null
          topic_id: string
        }
        Insert: {
          alternativas?: Json | null
          created_at?: string
          dificuldade?: string | null
          enunciado: string
          explicacao?: string | null
          id?: string
          ordem?: number
          resposta_certa: string
          tipo?: string | null
          topic_id: string
        }
        Update: {
          alternativas?: Json | null
          created_at?: string
          dificuldade?: string | null
          enunciado?: string
          explicacao?: string | null
          id?: string
          ordem?: number
          resposta_certa?: string
          tipo?: string | null
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "math_questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "math_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      math_topics: {
        Row: {
          conteudo_teoria: string
          cor: string | null
          created_at: string
          icone: string | null
          id: string
          nivel: string
          ordem: number
          titulo: string
        }
        Insert: {
          conteudo_teoria: string
          cor?: string | null
          created_at?: string
          icone?: string | null
          id?: string
          nivel?: string
          ordem?: number
          titulo: string
        }
        Update: {
          conteudo_teoria?: string
          cor?: string | null
          created_at?: string
          icone?: string | null
          id?: string
          nivel?: string
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
      reply_likes: {
        Row: {
          created_at: string | null
          id: string
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
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
      study_group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          invite_code: string | null
          is_public: boolean | null
          max_members: number | null
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name?: string
        }
        Relationships: []
      }
      user_friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_math_progress: {
        Row: {
          acertos: number | null
          created_at: string
          id: string
          question_id: string | null
          tempo_estudo: number | null
          tentativas: number | null
          topic_id: string
          ultimo_acesso: string | null
          user_id: string
        }
        Insert: {
          acertos?: number | null
          created_at?: string
          id?: string
          question_id?: string | null
          tempo_estudo?: number | null
          tentativas?: number | null
          topic_id: string
          ultimo_acesso?: string | null
          user_id: string
        }
        Update: {
          acertos?: number | null
          created_at?: string
          id?: string
          question_id?: string | null
          tempo_estudo?: number | null
          tentativas?: number | null
          topic_id?: string
          ultimo_acesso?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_math_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "math_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_math_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "math_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          acertos: number | null
          attempt_count: number | null
          comfort_zone_indicator: number | null
          concluido: boolean | null
          consecutive_correct: number | null
          created_at: string | null
          data_conclusao: string | null
          hint_usage: number | null
          id: string
          is_unlocked: boolean | null
          lesson_id: string
          mastery_score: number | null
          pontuacao: number | null
          tempo_estudo: number | null
          tentativas: number | null
          time_per_problem: number | null
          ultimo_acesso: string | null
          user_id: string
        }
        Insert: {
          acertos?: number | null
          attempt_count?: number | null
          comfort_zone_indicator?: number | null
          concluido?: boolean | null
          consecutive_correct?: number | null
          created_at?: string | null
          data_conclusao?: string | null
          hint_usage?: number | null
          id?: string
          is_unlocked?: boolean | null
          lesson_id: string
          mastery_score?: number | null
          pontuacao?: number | null
          tempo_estudo?: number | null
          tentativas?: number | null
          time_per_problem?: number | null
          ultimo_acesso?: string | null
          user_id: string
        }
        Update: {
          acertos?: number | null
          attempt_count?: number | null
          comfort_zone_indicator?: number | null
          concluido?: boolean | null
          consecutive_correct?: number | null
          created_at?: string | null
          data_conclusao?: string | null
          hint_usage?: number | null
          id?: string
          is_unlocked?: boolean | null
          lesson_id?: string
          mastery_score?: number | null
          pontuacao?: number | null
          tempo_estudo?: number | null
          tentativas?: number | null
          time_per_problem?: number | null
          ultimo_acesso?: string | null
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
      user_worksheet_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          hints_used: number | null
          id: string
          score: number | null
          time_spent: number | null
          user_id: string
          worksheet_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          hints_used?: number | null
          id?: string
          score?: number | null
          time_spent?: number | null
          user_id: string
          worksheet_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          hints_used?: number | null
          id?: string
          score?: number | null
          time_spent?: number | null
          user_id?: string
          worksheet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_worksheet_progress_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "worksheets"
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
      worksheets: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          ordem: number
          problem_count: number | null
          theory_content: string | null
          titulo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          ordem?: number
          problem_count?: number | null
          theory_content?: string | null
          titulo: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          ordem?: number
          problem_count?: number | null
          theory_content?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "worksheets_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_unlock_lesson: {
        Args: { user_uuid: string; lesson_uuid: string }
        Returns: boolean
      }
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
