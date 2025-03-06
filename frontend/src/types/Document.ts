export interface Document {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  file_type: string;
  file_size: number;
  file_path: string;
  file_url: string;
  category?: string;
  version?: number;
  created_at: string;
  updated_at?: string;
  created_by: string;
} 