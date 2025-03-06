export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  completedAt?: string;
  progress: number;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TaskComment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskFilter {
  status?: string[];
  priority?: string[];
  assigneeId?: string[];
  dueDate?: string;
  projectId?: string;
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