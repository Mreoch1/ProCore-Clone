export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date: string;
  budget: number;
  client: string;
  location: string;
  team_members: string[];
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  role: string;
  company?: string;
  position?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Document {
  id: string;
  project_id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  project_id: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  project_id: string;
  type: 'progress' | 'budget' | 'timeline' | 'resource';
  data: any;
  generated_at: string;
  generated_by: string;
} 