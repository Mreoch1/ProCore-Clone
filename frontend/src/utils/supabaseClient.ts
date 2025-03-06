import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  if (error) throw error;
  
  // After signup, create a team member record
  if (data.user) {
    const { error: profileError } = await supabase
      .from('team_members')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: email,
        role: userData.role || 'team_member',
        company: userData.company,
        position: userData.position,
      });
    
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  if (data.user) {
    // Get the team member profile
    const { data: teamMember, error: profileError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }
    
    return {
      ...data.user,
      profile: teamMember || null
    };
  }
  
  return null;
};

// Data fetching functions
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      manager:team_members(name, email, avatar_url)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchTasks = async (projectId?: string) => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      assigned_to:team_members(name, email, avatar_url),
      project:projects(name)
    `)
    .order('due_date', { ascending: true });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchDocuments = async (projectId?: string) => {
  let query = supabase
    .from('documents')
    .select(`
      *,
      uploaded_by:team_members(name, email, avatar_url),
      project:projects(name)
    `)
    .order('uploaded_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchTeamMembers = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchBudgetItems = async (projectId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select(`
      *,
      created_by:team_members(name, email, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Data mutation functions
export const createProject = async (projectData: any) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProject = async (projectId: string, projectData: any) => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createTask = async (taskData: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (taskId: string, taskData: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const uploadDocument = async (file: File, projectId: string, metadata: any) => {
  // First upload the file to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `documents/${projectId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  // Create document record
  const documentData = {
    title: metadata.title || file.name,
    description: metadata.description || '',
    file_type: file.type,
    file_size: file.size,
    url: urlData.publicUrl,
    project_id: projectId,
    uploaded_by: metadata.uploaded_by,
    category: metadata.category || 'Other'
  };
  
  const { data, error } = await supabase
    .from('documents')
    .insert(documentData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createBudgetItem = async (budgetItemData: any) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert(budgetItemData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBudgetItem = async (itemId: string, budgetItemData: any) => {
  const { data, error } = await supabase
    .from('budget_items')
    .update(budgetItemData)
    .eq('id', itemId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTeamMember = async (memberId: string, memberData: any) => {
  const { data, error } = await supabase
    .from('team_members')
    .update(memberData)
    .eq('id', memberId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
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