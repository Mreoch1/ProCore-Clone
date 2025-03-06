export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      team_members: {
        Row: {
          id: string
          name: string
          email: string
          role: 'project_manager' | 'team_member' | 'client' | 'admin'
          phone: string | null
          company: string | null
          position: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'project_manager' | 'team_member' | 'client' | 'admin'
          phone?: string | null
          company?: string | null
          position?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'project_manager' | 'team_member' | 'client' | 'admin'
          phone?: string | null
          company?: string | null
          position?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          name: string
          status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          client: string
          description: string | null
          location: string | null
          start_date: string
          end_date: string
          budget: number
          progress: number
          manager: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          client: string
          description?: string | null
          location?: string | null
          start_date: string
          end_date: string
          budget: number
          progress: number
          manager: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          status?: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          client?: string
          description?: string | null
          location?: string | null
          start_date?: string
          end_date?: string
          budget?: number
          progress?: number
          manager?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_manager_fkey"
            columns: ["manager"]
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high'
          due_date: string
          assigned_to: string
          project_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high'
          due_date: string
          assigned_to: string
          project_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          assigned_to?: string
          project_id?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_type: string
          file_size: number
          url: string
          project_id: string
          uploaded_by: string
          uploaded_at: string
          category: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_type: string
          file_size: number
          url: string
          project_id: string
          uploaded_by: string
          uploaded_at?: string
          category: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_type?: string
          file_size?: number
          url?: string
          project_id?: string
          uploaded_by?: string
          uploaded_at?: string
          category?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_items: {
        Row: {
          id: string
          project_id: string
          category: string
          description: string
          estimated_amount: number
          actual_amount: number
          status: 'under_budget' | 'on_budget' | 'over_budget'
          created_by: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          category: string
          description: string
          estimated_amount: number
          actual_amount: number
          status: 'under_budget' | 'on_budget' | 'over_budget'
          created_by: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          category?: string
          description?: string
          estimated_amount?: number
          actual_amount?: number
          status?: 'under_budget' | 'on_budget' | 'over_budget'
          created_by?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
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
  }
}

// Helper types for Supabase returns
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type TeamMember = Tables<'team_members'>
export type Project = Tables<'projects'>
export type Task = Tables<'tasks'>
export type Document = Tables<'documents'>
export type BudgetItem = Tables<'budget_items'>

// Extended types with joined data
export type ProjectWithManager = Project & {
  manager: Pick<TeamMember, 'name' | 'email' | 'avatar_url'>
}

export type TaskWithAssignee = Task & {
  assigned_to: Pick<TeamMember, 'name' | 'email' | 'avatar_url'>
  project: Pick<Project, 'name'>
}

export type DocumentWithUploader = Document & {
  uploaded_by: Pick<TeamMember, 'name' | 'email' | 'avatar_url'>
  project: Pick<Project, 'name'>
}

export type BudgetItemWithCreator = BudgetItem & {
  created_by: Pick<TeamMember, 'name' | 'email' | 'avatar_url'>
} 