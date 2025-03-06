import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../index';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    
    // For demo purposes, set a mock user
    req.user = {
      id: decoded.id || 'mock-user-id',
      email: decoded.email || 'mock@example.com',
      role: decoded.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 