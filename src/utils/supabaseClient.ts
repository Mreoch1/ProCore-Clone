import { createClient } from '@supabase/supabase-js';
import { User, Project, Task, Document, BudgetItem } from '../types/project';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, metadata: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return data;
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Data fetching functions
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Project[];
};

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });
  if (error) throw error;
  return data as Task[];
};

export const fetchDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Document[];
};

export const fetchTeamMembers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data as User[];
};

export const fetchBudgetItems = async (projectId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data as BudgetItem[];
};

// Data mutation functions
export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
};

export const uploadDocument = async (
  file: File,
  projectId: string,
  uploadedBy: string
) => {
  // Upload file to storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(`${projectId}/${file.name}`, file);
  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileData.path);

  // Create document record
  const document: Omit<Document, 'id' | 'created_at' | 'updated_at'> = {
    project_id: projectId,
    name: file.name,
    type: file.type,
    size: file.size,
    url: publicUrl,
    uploaded_by: uploadedBy,
  };

  const { data: docData, error: docError } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();
  if (docError) throw docError;

  return docData as Document;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as User;
};

export const createBudgetItem = async (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert([item])
    .select()
    .single();
  if (error) throw error;
  return data as BudgetItem;
};

// Real-time subscriptions
export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:projects')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
    .subscribe();
};

export const subscribeToTasks = (projectId: string | null, callback: (payload: any) => void) => {
  const channel = supabase.channel(`public:tasks:${projectId || 'all'}`);
  
  if (projectId) {
    return channel
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, callback)
      .subscribe();
  } else {
    return channel
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, callback)
      .subscribe();
  }
}; 