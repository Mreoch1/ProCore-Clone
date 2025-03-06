export interface Project {
  id: string;
  name: string;
  description?: string;
  client: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  progress?: number; // 0-100
  created_at?: string;
  updated_at?: string;
  manager?: string;
  team_members?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  project_id: string;
  created_at?: string;
  updated_at?: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  user_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'client' | 'subcontractor' | 'consultant';
  avatar_url?: string;
  phone?: string;
  company?: string;
  position?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_type: string;
  file_size: number;
  url: string;
  project_id: string;
  uploaded_by: string;
  uploaded_at: string;
  version?: string;
  status?: 'draft' | 'review' | 'approved' | 'rejected';
  category?: string;
} 