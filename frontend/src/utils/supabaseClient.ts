import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../types/User';
import { Project } from '../types/Project';
import { Task } from '../types/Task';
import { Document } from '../types/Document';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      // Set session expiry based on remember me option
      expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    }
  });
};

export const signUp = async (email: string, password: string, metadata: any) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword
  });
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
  // Get additional user profile data from profiles table
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  // Combine auth data with profile data
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: profileData?.name || data.user.user_metadata?.name || 'User',
    role: profileData?.role || data.user.user_metadata?.role || 'team_member',
    company: profileData?.company || data.user.user_metadata?.company || '',
    position: profileData?.position || data.user.user_metadata?.position || '',
    avatar_url: profileData?.avatar_url || data.user.user_metadata?.avatar_url || '',
    phone: profileData?.phone || data.user.user_metadata?.phone || ''
  };
};

// Project functions
export const getProjects = async () => {
  return await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getProject = async (projectId: string) => {
  return await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
};

export const createProject = async (projectData: Partial<Project>) => {
  return await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();
};

export const updateProject = async (projectId: string, projectData: Partial<Project>) => {
  return await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select()
    .single();
};

export const deleteProject = async (projectId: string) => {
  return await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
};

// Task functions
export const getTasks = async () => {
  return await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getProjectTasks = async (projectId: string) => {
  return await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
};

export const createTask = async (taskData: Partial<Task>) => {
  return await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();
};

export const updateTask = async (taskData: Partial<Task>) => {
  return await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskData.id!)
    .select()
    .single();
};

export const deleteTask = async (taskId: string) => {
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
};

// Document functions
export const getDocuments = async () => {
  return await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getProjectDocuments = async (projectId: string) => {
  return await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
};

export const uploadDocument = async (projectId: string, file: File, metadata: any) => {
  // First upload the file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `documents/${projectId}/${fileName}`;
  
  const { data: fileData, error: fileError } = await supabase.storage
    .from('project-files')
    .upload(filePath, file);
  
  if (fileError) {
    return { data: null, error: fileError };
  }
  
  // Get the public URL for the file
  const { data: urlData } = supabase.storage
    .from('project-files')
    .getPublicUrl(filePath);
  
  // Create a document record in the database
  const documentData = {
    project_id: projectId,
    name: file.name,
    description: metadata.description || '',
    file_type: file.type,
    file_size: file.size,
    file_path: filePath,
    file_url: urlData.publicUrl,
    created_by: metadata.userId,
    category: metadata.category || 'general'
  };
  
  return await supabase
    .from('documents')
    .insert([documentData])
    .select()
    .single();
};

export const deleteDocument = async (documentId: string, filePath: string) => {
  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('project-files')
    .remove([filePath]);
  
  if (storageError) {
    return { data: null, error: storageError };
  }
  
  // Delete the document record
  return await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
};

// Team functions
export const getTeamMembers = async () => {
  return await supabase
    .from('profiles')
    .select('*')
    .order('name');
};

export const getProjectTeam = async (projectId: string) => {
  return await supabase
    .from('project_members')
    .select(`
      profiles:user_id (*)
    `)
    .eq('project_id', projectId);
};

export const addProjectMember = async (projectId: string, userId: string, role: string) => {
  return await supabase
    .from('project_members')
    .insert([{
      project_id: projectId,
      user_id: userId,
      role: role
    }])
    .select()
    .single();
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  return await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);
};

// Real-time subscriptions
export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('projects-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'projects' 
    }, callback)
    .subscribe();
};

export const subscribeToTasks = (callback: (payload: any) => void) => {
  return supabase
    .channel('tasks-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'tasks' 
    }, callback)
    .subscribe();
};

export const subscribeToDocuments = (callback: (payload: any) => void) => {
  return supabase
    .channel('documents-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'documents' 
    }, callback)
    .subscribe();
};

export const subscribeToProjectMembers = (callback: (payload: any) => void) => {
  return supabase
    .channel('project-members-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'project_members' 
    }, callback)
    .subscribe();
}; 