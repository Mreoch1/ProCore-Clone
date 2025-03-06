import { createClient } from '@supabase/supabase-js';
import { User } from '../types/User';
import { Project, ProjectMember, ProjectDocument } from '../types/Project';
import { Task, TaskComment, TaskAttachment } from '../types/Task';
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
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  // Map database fields to Project type
  return data.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.start_date,
    endDate: project.end_date,
    budget: project.budget,
    progress: project.progress,
    createdBy: project.created_by,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    clientId: project.client_id,
    clientName: project.client_name,
    location: project.location,
  }));
};

export const getProject = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
  
  // Map database fields to Project type
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    progress: data.progress,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    clientId: data.client_id,
    clientName: data.client_name,
    location: data.location,
  };
};

export const createProject = async (project: Partial<Project>): Promise<Project | null> => {
  // Map Project type to database fields
  const dbProject = {
    name: project.name,
    description: project.description,
    status: project.status || 'not_started',
    start_date: project.startDate,
    end_date: project.endDate,
    budget: project.budget,
    progress: project.progress || 0,
    created_by: project.createdBy,
    client_id: project.clientId,
    client_name: project.clientName,
    location: project.location,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert([dbProject])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  // Map database response back to Project type
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    progress: data.progress,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    clientId: data.client_id,
    clientName: data.client_name,
    location: data.location,
  };
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project | null> => {
  // Map Project type to database fields
  const dbProject = {
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.startDate,
    end_date: project.endDate,
    budget: project.budget,
    progress: project.progress,
    client_id: project.clientId,
    client_name: project.clientName,
    location: project.location,
    updated_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('projects')
    .update(dbProject)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating project ${id}:`, error);
    return null;
  }
  
  // Map database response back to Project type
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    progress: data.progress,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    clientId: data.client_id,
    clientName: data.client_name,
    location: data.location,
  };
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting project ${id}:`, error);
    return false;
  }
  
  return true;
};

// Task functions
export const getTasks = async (projectId?: string): Promise<Task[]> => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  // Map database fields to Task type
  return data.map(task => ({
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
    progress: task.progress,
  }));
};

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  return getTasks(projectId);
};

export const getTask = async (id: string): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
  
  // Get task comments
  const { data: commentsData, error: commentsError } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', id)
    .order('created_at', { ascending: true });

  if (commentsError) {
    console.error(`Error fetching comments for task ${id}:`, commentsError);
  }

  // Get task attachments
  const { data: attachmentsData, error: attachmentsError } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', id)
    .order('created_at', { ascending: true });

  if (attachmentsError) {
    console.error(`Error fetching attachments for task ${id}:`, attachmentsError);
  }
  
  // Map database fields to Task type
  return {
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
    progress: data.progress,
    comments: commentsData?.map(comment => ({
      id: comment.id,
      text: comment.text,
      userId: comment.user_id,
      userName: comment.user_name,
      createdAt: comment.created_at,
    })) || [],
    attachments: attachmentsData?.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
      uploadedBy: attachment.uploaded_by,
      uploadedAt: attachment.created_at,
    })) || [],
  };
};

export const createTask = async (task: Partial<Task>): Promise<Task | null> => {
  // Map Task type to database fields
  const dbTask = {
    title: task.title,
    description: task.description,
    project_id: task.projectId,
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    assignee_id: task.assigneeId,
    due_date: task.dueDate,
    estimated_hours: task.estimatedHours,
    actual_hours: task.actualHours,
    created_by: task.createdBy,
    progress: task.progress || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([dbTask])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  
  // Map database response back to Task type
  return {
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
    progress: data.progress,
  };
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task | null> => {
  // Map Task type to database fields
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
    progress: task.progress,
    updated_at: new Date().toISOString(),
  };
  
  // If status is completed and there's no completedAt date, set it
  if (task.status === 'completed' && !task.completedAt) {
    dbTask.completed_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .update(dbTask)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating task ${id}:`, error);
    return null;
  }
  
  // Map database response back to Task type
  return {
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
    progress: data.progress,
  };
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting task ${id}:`, error);
    return false;
  }
  
  return true;
};

export const addTaskComment = async (taskId: string, userId: string, userName: string, text: string): Promise<TaskComment | null> => {
  const { data, error } = await supabase
    .from('task_comments')
    .insert([
      {
        task_id: taskId,
        user_id: userId,
        user_name: userName,
        text: text,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error(`Error adding comment to task ${taskId}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    text: data.text,
    userId: data.user_id,
    userName: data.user_name,
    createdAt: data.created_at,
  };
};

export const addTaskAttachment = async (taskId: string, userId: string, file: File): Promise<TaskAttachment | null> => {
  // Upload file to Supabase Storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `task-attachments/${taskId}/${fileName}`;
  
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error(`Error uploading attachment for task ${taskId}:`, uploadError);
    return null;
  }
  
  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);
  
  // Add attachment record to database
  const { data, error } = await supabase
    .from('task_attachments')
    .insert([
      {
        task_id: taskId,
        name: file.name,
        url: publicUrl,
        uploaded_by: userId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error(`Error adding attachment record for task ${taskId}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    uploadedBy: data.uploaded_by,
    uploadedAt: data.created_at,
  };
};

// User functions
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  // Map database fields to User type
  return data.map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }));
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

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }
  
  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  // Update user profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);
  
  if (updateError) {
    console.error('Error updating user profile with avatar URL:', updateError);
    return null;
  }
  
  return publicUrl;
};

// Document functions
export const getDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('project_documents')
    .select('*');
  
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  
  return data;
};

export const getProjectDocuments = async (projectId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching documents for project ${projectId}:`, error);
    return [];
  }
  
  return data;
};

export const uploadDocument = async (projectId: string, file: File, metadata: any): Promise<Document | null> => {
  // Upload file to Supabase Storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `project-documents/${projectId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error(`Error uploading document for project ${projectId}:`, uploadError);
    return null;
  }
  
  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  // Add document record to database
  const { data, error } = await supabase
    .from('project_documents')
    .insert([
      {
        project_id: projectId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: publicUrl,
        uploaded_by: metadata.userId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error(`Error adding document record for project ${projectId}:`, error);
    return null;
  }
  
  return data;
};

export const deleteDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);
  
  if (storageError) {
    console.error(`Error deleting document file ${filePath}:`, storageError);
    return false;
  }
  
  // Delete document record from database
  const { error: dbError } = await supabase
    .from('project_documents')
    .delete()
    .eq('id', documentId);
  
  if (dbError) {
    console.error(`Error deleting document record ${documentId}:`, dbError);
    return false;
  }
  
  return true;
};

// Team functions
export const getTeamMembers = async (): Promise<User[]> => {
  return getUsers();
};

export const getProjectTeam = async (projectId: string): Promise<ProjectMember[]> => {
  const { data, error } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching team for project ${projectId}:`, error);
    return [];
  }
  
  return data;
};

export const addProjectMember = async (projectId: string, userId: string, role: string): Promise<ProjectMember | null> => {
  const { data, error } = await supabase
    .from('project_members')
    .insert([
      {
        project_id: projectId,
        user_id: userId,
        role: role,
        joined_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error(`Error adding member to project ${projectId}:`, error);
    return null;
  }
  
  return data;
};

export const removeProjectMember = async (projectId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error removing member from project ${projectId}:`, error);
    return false;
  }
  
  return true;
};

// Real-time subscriptions
export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('projects-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
    .subscribe();
};

export const subscribeToTasks = (callback: (payload: any) => void) => {
  return supabase
    .channel('tasks-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe();
};

export const subscribeToDocuments = (callback: (payload: any) => void) => {
  return supabase
    .channel('documents-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'project_documents' }, callback)
    .subscribe();
};

export const subscribeToProjectMembers = (callback: (payload: any) => void) => {
  return supabase
    .channel('project-members-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'project_members' }, callback)
    .subscribe();
}; 