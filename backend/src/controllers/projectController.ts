import { Request, Response } from 'express';
import { supabase } from '../index';

// Get all projects
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch projects' });
  }
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks(*),
        documents(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch project' });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, start_date, end_date, status, client, address, budget } = req.body;
    
    // Validate required fields
    if (!name || !status) {
      res.status(400).json({ message: 'Name and status are required' });
      return;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { 
          name, 
          description, 
          start_date, 
          end_date, 
          status, 
          client,
          address,
          budget,
          created_by: req.user.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message || 'Failed to create project' });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, status, client, address, budget } = req.body;
    
    // Validate required fields
    if (!name || !status) {
      res.status(400).json({ message: 'Name and status are required' });
      return;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        name, 
        description, 
        start_date, 
        end_date, 
        status, 
        client,
        address,
        budget,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message || 'Failed to update project' });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message || 'Failed to delete project' });
  }
}; 