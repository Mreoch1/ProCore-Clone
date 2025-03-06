import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Supabase client (with error handling for demo purposes)
let supabase: any;
try {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
  
  // Only create the client if we have valid credentials
  if (supabaseUrl.includes('http') && supabaseKey.length > 0) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('⚠️ Invalid Supabase credentials. Using mock database for demo purposes.');
    // Create a mock supabase client for demo purposes
    supabase = {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: { id: 'mock-id' }, error: null }),
        update: () => ({ data: { id: 'mock-id' }, error: null }),
        delete: () => ({ error: null }),
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: { id: 'mock-id' }, error: null }),
        order: () => ({ data: [], error: null })
      })
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock supabase client for demo purposes
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: { id: 'mock-id' }, error: null }),
      update: () => ({ data: { id: 'mock-id' }, error: null }),
      delete: () => ({ error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: { id: 'mock-id' }, error: null }),
      order: () => ({ data: [], error: null })
    })
  };
}

export { supabase };

// Import routes
import projectRoutes from './routes/projects';
import userRoutes from './routes/users';
import documentRoutes from './routes/documents';
import taskRoutes from './routes/tasks';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Demo route for testing
app.get('/api/demo', (req, res) => {
  res.status(200).json({
    message: 'ProCore Clone API is running in demo mode',
    projects: [
      { id: '1', name: 'Office Building Construction', status: 'in_progress', client: 'ABC Corp' },
      { id: '2', name: 'Highway Expansion Project', status: 'planning', client: 'Department of Transportation' },
      { id: '3', name: 'Residential Complex', status: 'completed', client: 'XYZ Developers' }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Demo data available at http://localhost:${PORT}/api/demo`);
});

export default app; 