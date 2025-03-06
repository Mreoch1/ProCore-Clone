export interface Project {
  id: string;
  name: string;
  description?: string;
  client?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string;
  due_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  project_id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'client';
  phone?: string;
  company?: string;
  position?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
} 