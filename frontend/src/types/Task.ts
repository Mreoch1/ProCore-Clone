export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: string;
  priority: string;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  completedAt?: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  dependencies?: string[];
  progress?: number;
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

export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  review: number;
  todo: number;
  overdue: number;
} 