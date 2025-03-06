export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  joined_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  progress: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
  client_id?: string;
  client?: string;
  team_members?: string[];
  documents?: ProjectDocument[];
  tags?: string[];
  location?: string;
}

export interface ProjectStatistics {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  overdue: number;
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