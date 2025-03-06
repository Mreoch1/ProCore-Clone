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