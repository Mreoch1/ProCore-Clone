-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'team_member',
  company TEXT,
  job_title TEXT,
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget NUMERIC(10, 2),
  progress NUMERIC(5, 2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  client_id TEXT,
  client_name TEXT
);

-- Create project_members table
CREATE TABLE project_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours NUMERIC(5, 2),
  actual_hours NUMERIC(5, 2),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create task_comments table
CREATE TABLE task_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_attachments table
CREATE TABLE task_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_documents table
CREATE TABLE project_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_dependencies table
CREATE TABLE task_dependencies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Create project_tags table
CREATE TABLE project_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(project_id, tag)
);

-- Create RLS policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Project creators can update their projects"
  ON projects FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Project creators can delete their projects"
  ON projects FOR DELETE
  USING (auth.uid() = created_by);

-- Tasks policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Task creators and assignees can update tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = assignee_id);

CREATE POLICY "Task creators can delete tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = created_by);

-- Create functions and triggers

-- Function to update project progress based on tasks
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  project_id UUID;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    project_id := NEW.project_id;
  ELSE
    project_id := OLD.project_id;
  END IF;

  -- Count total and completed tasks
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_tasks, completed_tasks
  FROM tasks
  WHERE project_id = project_id;

  -- Update project progress
  IF total_tasks > 0 THEN
    UPDATE projects
    SET progress = (completed_tasks::NUMERIC / total_tasks::NUMERIC) * 100,
        updated_at = NOW()
    WHERE id = project_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task changes
CREATE TRIGGER update_project_progress_trigger
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_progress();

-- Function to set updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create storage buckets
-- Note: This needs to be done in the Supabase dashboard or using the Supabase API

-- Create indexes for performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id); 