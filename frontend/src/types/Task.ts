export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  completed_at?: string;
  progress: number;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TaskComment {
  id: string;
  text: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TaskFilter {
  status?: string[];
  priority?: string[];
  assignee_id?: string[];
  due_date?: string;
  project_id?: string;
  searchTerm?: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  blocked: number;
  overdue: number;
  review: number;
} 