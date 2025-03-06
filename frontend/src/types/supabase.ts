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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          start_date: string | null
          end_date: string | null
          budget: number | null
          progress: number
          created_by: string
          created_at: string
          updated_at: string | null
          client_id: string | null
          client: string | null
          location: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          progress?: number
          created_by: string
          created_at?: string
          updated_at?: string | null
          client_id?: string | null
          client?: string | null
          location?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          progress?: number
          created_by?: string
          created_at?: string
          updated_at?: string | null
          client_id?: string | null
          client?: string | null
          location?: string | null
          tags?: string[] | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string
          status: string
          priority: string
          assignee_id: string | null
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          created_at: string
          updated_at: string
          created_by: string
          completed_at: string | null
          progress: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id: string
          status?: string
          priority?: string
          assignee_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
          created_by: string
          completed_at?: string | null
          progress?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          project_id?: string
          status?: string
          priority?: string
          assignee_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string
          completed_at?: string | null
          progress?: number
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          size: number
          url: string
          uploaded_by: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: string
          size: number
          url: string
          uploaded_by: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: string
          size?: number
          url?: string
          uploaded_by?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          phone: string | null
          company: string | null
          position: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: string
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
          role?: string
          phone?: string | null
          company?: string | null
          position?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      project_members: {
        Row: {
          id: string
          user_id: string
          project_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          role?: string
          joined_at?: string
        }
      }
    }
  }
} 