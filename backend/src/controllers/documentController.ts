import { Request, Response } from 'express';
import { supabase } from '../index';
import fs from 'fs';
import path from 'path';

// Get all documents
export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch documents' });
  }
};

// Get document by ID
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('documents')
      .select('*, projects(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch document' });
  }
};

// Get documents by project ID
export const getDocumentsByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching project documents:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch project documents' });
  }
};

// Create new document with file upload
export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, project_id, category } = req.body;
    const file = req.file;
    
    // Validate required fields
    if (!name || !project_id || !file) {
      // Remove uploaded file if validation fails
      if (file) {
        fs.unlinkSync(file.path);
      }
      res.status(400).json({ message: 'Name, project ID, and file are required' });
      return;
    }
    
    // Get file details
    const fileSize = file.size;
    const fileType = file.mimetype;
    const fileName = file.filename;
    const originalName = file.originalname;
    const filePath = file.path;
    
    // Create document record in database
    const { data, error } = await supabase
      .from('documents')
      .insert([
        { 
          name, 
          description, 
          project_id, 
          category,
          file_name: fileName,
          original_name: originalName,
          file_path: filePath,
          file_size: fileSize,
          file_type: fileType,
          uploaded_by: req.user.id
        }
      ])
      .select()
      .single();
    
    if (error) {
      // Remove uploaded file if database insert fails
      fs.unlinkSync(filePath);
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: error.message || 'Failed to create document' });
  }
};

// Update document
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;
    
    // Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    
    const { data, error } = await supabase
      .from('documents')
      .update({ 
        name, 
        description, 
        category,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: error.message || 'Failed to update document' });
  }
};

// Delete document
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Get document to delete file
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    // Delete file from filesystem
    if (document.file_path && fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: error.message || 'Failed to delete document' });
  }
}; 