import { createClient } from '@supabase/supabase-js';
import { User } from '../types/User';
import { Project } from '../types/Project';
import { Task } from '../types/Task';
import { Document } from '../types/Document';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  if (error) throw error;
  
  // Create user profile in the profiles table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          name: userData.name,
          email: email,
          role: userData.role || 'team_member',
          avatar_url: userData.avatarUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Get user profile from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  // Map profile data to User type
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

// Project functions
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform data to match our interface
  return data.map((project: any) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.start_date,
    endDate: project.end_date,
    budget: project.budget,
    progress: project.progress || 0,
    createdBy: project.created_by,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    clientId: project.client_id,
    clientName: project.client_name,
  })) as Project[];
};

export const getProject = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Transform data to match our interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    progress: data.progress || 0,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    clientId: data.client_id,
    clientName: data.client_name,
  } as Project;
};

export const createProject = async (project: Partial<Project>) => {
  // Transform data to match database schema
  const dbProject = {
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.startDate,
    end_date: project.endDate,
    budget: project.budget,
    progress: project.progress || 0,
    created_by: project.createdBy,
    client_id: project.clientId,
    client_name: project.clientName,
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert(dbProject)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  // Transform data to match database schema
  const dbProject = {
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.startDate,
    end_date: project.endDate,
    budget: project.budget,
    progress: project.progress,
    updated_at: new Date().toISOString(),
    client_id: project.clientId,
    client_name: project.clientName,
  };
  
  const { data, error } = await supabase
    .from('projects')
    .update(dbProject)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Task functions
export const getTasks = async (projectId?: string) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Transform data to match our interface
  return data.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    projectId: task.project_id,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assignee_id,
    dueDate: task.due_date,
    estimatedHours: task.estimated_hours,
    actualHours: task.actual_hours,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    createdBy: task.created_by,
    completedAt: task.completed_at,
  })) as Task[];
};

export const getTask = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      comments:task_comments(*),
      attachments:task_attachments(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Transform data to match our interface
  const task = {
    id: data.id,
    title: data.title,
    description: data.description,
    projectId: data.project_id,
    status: data.status,
    priority: data.priority,
    assigneeId: data.assignee_id,
    dueDate: data.due_date,
    estimatedHours: data.estimated_hours,
    actualHours: data.actual_hours,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    completedAt: data.completed_at,
    comments: data.comments?.map((comment: any) => ({
      id: comment.id,
      text: comment.content,
      userId: comment.user_id,
      userName: comment.user_name,
      createdAt: comment.created_at,
    })),
    attachments: data.attachments?.map((attachment: any) => ({
      id: attachment.id,
      name: attachment.file_name,
      url: attachment.file_url,
      uploadedBy: attachment.uploaded_by,
      uploadedAt: attachment.created_at,
    })),
  } as Task;
  
  return task;
};

export const createTask = async (task: Partial<Task>) => {
  // Transform data to match database schema
  const dbTask = {
    title: task.title,
    description: task.description,
    project_id: task.projectId,
    status: task.status,
    priority: task.priority,
    assignee_id: task.assigneeId,
    due_date: task.dueDate,
    estimated_hours: task.estimatedHours,
    created_by: task.createdBy,
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(dbTask)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  // Transform data to match database schema
  const dbTask = {
    title: task.title,
    description: task.description,
    project_id: task.projectId,
    status: task.status,
    priority: task.priority,
    assignee_id: task.assigneeId,
    due_date: task.dueDate,
    estimated_hours: task.estimatedHours,
    actual_hours: task.actualHours,
    updated_at: new Date().toISOString(),
    completed_at: task.status === 'Completed' ? new Date().toISOString() : task.completedAt,
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .update(dbTask)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Task comments
export const addTaskComment = async (taskId: string, userId: string, userName: string, text: string) => {
  const { data, error } = await supabase
    .from('task_comments')
    .insert({
      task_id: taskId,
      user_id: userId,
      user_name: userName,
      content: text,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// Task attachments
export const addTaskAttachment = async (taskId: string, userId: string, file: File) => {
  // Upload file to storage
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `task-attachments/${taskId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);
  
  // Add attachment record
  const { data, error } = await supabase
    .from('task_attachments')
    .insert({
      task_id: taskId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_url: urlData.publicUrl,
      uploaded_by: userId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  
  // Transform data to match our interface
  return data.map((user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    jobTitle: user.job_title,
    department: user.department,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
  })) as User[];
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      avatar_url: updates.avatarUrl,
      updated_at: new Date().toISOString(),
      ...updates,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return getCurrentUser();
};

export const uploadAvatar = async (userId: string, file: File) => {
  // Upload file to storage
  const fileName = `${userId}-${Date.now()}`;
  const filePath = `avatars/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  // Update user profile
  const { data, error } = await supabase
    .from('profiles')
    .update({
      avatar_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
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