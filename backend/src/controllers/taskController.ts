import { Request, Response } from 'express';
import { supabase } from '../index';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects(name),
        assigned_to(id, first_name, last_name)
      `)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects(name),
        assigned_to(id, first_name, last_name),
        created_by(id, first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch task' });
  }
};

// Get tasks by project ID
export const getTasksByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to(id, first_name, last_name)
      `)
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch project tasks' });
  }
};

// Get tasks by assignee ID
export const getTasksByAssignee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects(name)
      `)
      .eq('assignee_id', userId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch user tasks' });
  }
};

// Create new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      project_id, 
      assignee_id, 
      due_date, 
      priority, 
      status 
    } = req.body;
    
    // Validate required fields
    if (!title || !project_id || !status) {
      res.status(400).json({ message: 'Title, project ID, and status are required' });
      return;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          title, 
          description, 
          project_id, 
          assignee_id, 
          due_date, 
          priority, 
          status,
          created_by: req.user.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: error.message || 'Failed to create task' });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      assignee_id, 
      due_date, 
      priority, 
      status,
      completion_notes
    } = req.body;
    
    // Validate required fields
    if (!title || !status) {
      res.status(400).json({ message: 'Title and status are required' });
      return;
    }
    
    // Prepare update data
    const updateData: any = {
      title,
      description,
      assignee_id,
      due_date,
      priority,
      status,
      updated_at: new Date()
    };
    
    // If status is completed, add completion details
    if (status === 'completed') {
      updateData.completed_at = new Date();
      updateData.completed_by = req.user.id;
      updateData.completion_notes = completion_notes;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: error.message || 'Failed to update task' });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message || 'Failed to delete task' });
  }
}; 