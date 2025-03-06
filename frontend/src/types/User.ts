export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'client';
  company?: string;
  position?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  last_sign_in_at?: string;
} 