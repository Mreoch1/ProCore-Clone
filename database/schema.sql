-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'project_manager', 'team_member', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed')),
  client TEXT,
  address TEXT,
  budget DECIMAL(12,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table (for user-project relationships)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'member', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('to_do', 'in_progress', 'in_review', 'completed')),
  created_by UUID REFERENCES users(id),
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table (for tasks and documents)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (task_id IS NOT NULL AND document_id IS NULL) OR
    (task_id IS NULL AND document_id IS NOT NULL)
  )
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete users" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for projects
CREATE POLICY "Project members can view projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers and admins can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
    )
  );

CREATE POLICY "Project managers and admins can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'manager')
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Project managers and admins can delete projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = projects.id AND user_id = auth.uid() AND role = 'owner'
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_document_id ON comments(document_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tasks_modtime
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_documents_modtime
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_comments_modtime
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_modified_column(); 