-- Create tables for ProCore Clone

-- Enable RLS (Row Level Security)
-- Note: JWT configuration is handled by Supabase configuration

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('project_manager', 'team_member', 'client', 'admin')),
  phone TEXT,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  client TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(15, 2) NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  manager UUID NOT NULL REFERENCES public.team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE NOT NULL,
  assigned_to UUID NOT NULL REFERENCES public.team_members(id),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  url TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.team_members(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_amount NUMERIC(15, 2) NOT NULL,
  actual_amount NUMERIC(15, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('under_budget', 'on_budget', 'over_budget')),
  created_by UUID NOT NULL REFERENCES public.team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Team members are viewable by authenticated users"
  ON public.team_members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Team members can be inserted by admins"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Team members can be updated by admins or themselves"
  ON public.team_members FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND (
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE id = auth.uid() AND role = 'admin'
      ) OR id = auth.uid()
    )
  );

-- Create policies for projects
CREATE POLICY "Projects are viewable by authenticated users"
  ON public.projects FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Projects can be inserted by project managers and admins"
  ON public.projects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE id = auth.uid() AND (role = 'project_manager' OR role = 'admin')
    )
  );

CREATE POLICY "Projects can be updated by project managers and admins"
  ON public.projects FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE id = auth.uid() AND (role = 'project_manager' OR role = 'admin')
    )
  );

-- Create policies for tasks
CREATE POLICY "Tasks are viewable by authenticated users"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Tasks can be inserted by authenticated users"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Tasks can be updated by assigned users, project managers, and admins"
  ON public.tasks FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND (
      assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.projects p
        JOIN public.team_members tm ON p.manager = tm.id
        WHERE p.id = project_id AND tm.id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Create policies for documents
CREATE POLICY "Documents are viewable by authenticated users"
  ON public.documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Documents can be inserted by authenticated users"
  ON public.documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Documents can be updated by uploaders, project managers, and admins"
  ON public.documents FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND (
      uploaded_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.projects p
        JOIN public.team_members tm ON p.manager = tm.id
        WHERE p.id = project_id AND tm.id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Create policies for budget_items
CREATE POLICY "Budget items are viewable by authenticated users"
  ON public.budget_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Budget items can be inserted by project managers and admins"
  ON public.budget_items FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE id = auth.uid() AND (role = 'project_manager' OR role = 'admin')
    )
  );

CREATE POLICY "Budget items can be updated by project managers and admins"
  ON public.budget_items FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE id = auth.uid() AND (role = 'project_manager' OR role = 'admin')
    )
  );

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_budget_items_updated_at
BEFORE UPDATE ON public.budget_items
FOR EACH ROW EXECUTE FUNCTION update_modified_column(); 