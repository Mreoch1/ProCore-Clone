import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Session management
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Database helpers
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  return { data, error };
};

export const fetchTasks = async (projectId?: string) => {
  let query = supabase.from('tasks').select('*');
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const fetchDocuments = async (projectId?: string) => {
  let query = supabase.from('documents').select('*');
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const fetchTeamMembers = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*');
  
  return { data, error };
};

export const fetchBudgetItems = async (projectId?: string) => {
  let query = supabase.from('budget_items').select('*');
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export default supabase; 