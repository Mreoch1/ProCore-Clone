export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  joinedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  progress: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  clientId?: string;
  clientName?: string;
  teamMembers?: ProjectMember[];
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