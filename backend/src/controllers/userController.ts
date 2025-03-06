import { Request, Response } from 'express';
import { supabase } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error || !user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to request by auth middleware
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch user' });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, role, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch user' });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !email || !password || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          first_name, 
          last_name, 
          email: email.toLowerCase(), 
          password: hashedPassword, 
          role 
        }
      ])
      .select('id, first_name, last_name, email, role, created_at')
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message || 'Failed to create user' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role, password } = req.body;
    
    // Prepare update object
    const updateData: any = {
      first_name,
      last_name,
      email: email?.toLowerCase(),
      role,
      updated_at: new Date()
    };
    
    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, first_name, last_name, email, role, created_at')
      .single();
    
    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message || 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Prevent deleting yourself
    if (id === req.user.id) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message || 'Failed to delete user' });
  }
}; 