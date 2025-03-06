-- Seed data for ProCore Clone

-- Insert team members
INSERT INTO public.team_members (id, name, email, role, phone, company, position, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@example.com', 'admin', '555-123-4567', 'ProCore Inc.', 'Administrator', 'https://i.pravatar.cc/150?u=john.smith@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'sarah.johnson@example.com', 'project_manager', '555-234-5678', 'ProCore Inc.', 'Senior Project Manager', 'https://i.pravatar.cc/150?u=sarah.johnson@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'Michael Brown', 'michael.brown@example.com', 'team_member', '555-345-6789', 'ProCore Inc.', 'Engineer', 'https://i.pravatar.cc/150?u=michael.brown@example.com'),
  ('00000000-0000-0000-0000-000000000004', 'Emily Davis', 'emily.davis@example.com', 'team_member', '555-456-7890', 'ProCore Inc.', 'Architect', 'https://i.pravatar.cc/150?u=emily.davis@example.com'),
  ('00000000-0000-0000-0000-000000000005', 'Robert Wilson', 'robert.wilson@example.com', 'client', '555-567-8901', 'Wilson Construction', 'CEO', 'https://i.pravatar.cc/150?u=robert.wilson@example.com'),
  ('00000000-0000-0000-0000-000000000006', 'Jennifer Lee', 'jennifer.lee@example.com', 'project_manager', '555-678-9012', 'ProCore Inc.', 'Project Manager', 'https://i.pravatar.cc/150?u=jennifer.lee@example.com'),
  ('00000000-0000-0000-0000-000000000007', 'David Martinez', 'david.martinez@example.com', 'team_member', '555-789-0123', 'ProCore Inc.', 'Construction Manager', 'https://i.pravatar.cc/150?u=david.martinez@example.com'),
  ('00000000-0000-0000-0000-000000000008', 'Lisa Thompson', 'lisa.thompson@example.com', 'client', '555-890-1234', 'Thompson Builders', 'Project Owner', 'https://i.pravatar.cc/150?u=lisa.thompson@example.com');

-- Insert projects
INSERT INTO public.projects (id, name, status, client, description, location, start_date, end_date, budget, progress, manager)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Downtown Office Tower', 'in_progress', 'Wilson Construction', 'Construction of a 20-story office building in the downtown area', '123 Main St, Downtown', '2023-01-15', '2024-06-30', 15000000.00, 45, '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', 'Riverside Apartments', 'not_started', 'Thompson Builders', 'Development of luxury apartments along the riverside', '456 River Rd, Riverside', '2023-03-01', '2024-09-15', 8500000.00, 0, '00000000-0000-0000-0000-000000000006'),
  ('00000000-0000-0000-0000-000000000003', 'Community Hospital Expansion', 'in_progress', 'Wilson Construction', 'Expansion of the east wing of Community Hospital', '789 Health Dr, Eastside', '2022-11-10', '2023-12-20', 12000000.00, 75, '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000004', 'Green Valley Shopping Center', 'on_hold', 'Thompson Builders', 'Construction of a new shopping center in Green Valley', '101 Commerce Blvd, Green Valley', '2023-02-20', '2024-04-10', 9500000.00, 25, '00000000-0000-0000-0000-000000000006');

-- Insert tasks
INSERT INTO public.tasks (id, title, description, status, priority, due_date, assigned_to, project_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Foundation Inspection', 'Complete inspection of foundation work', 'completed', 'high', '2023-02-28', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', 'Steel Structure Installation', 'Install main steel structure for floors 1-10', 'in_progress', 'high', '2023-05-15', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', 'Electrical Wiring - Floors 1-5', 'Complete electrical wiring for the first 5 floors', 'not_started', 'medium', '2023-07-30', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000004', 'Site Preparation', 'Clear and prepare the construction site', 'not_started', 'high', '2023-03-15', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000005', 'Finalize Architectural Plans', 'Review and finalize all architectural plans', 'not_started', 'medium', '2023-04-01', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000006', 'East Wing Demolition', 'Demolish old east wing structure', 'completed', 'high', '2022-12-15', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000007', 'Medical Equipment Installation', 'Install and test new medical equipment', 'in_progress', 'high', '2023-10-30', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000008', 'Foundation Work', 'Complete foundation for the shopping center', 'completed', 'high', '2023-03-30', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000009', 'Resolve Permit Issues', 'Work with city officials to resolve permit delays', 'in_progress', 'high', '2023-05-15', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004');

-- Insert documents
INSERT INTO public.documents (id, title, description, file_type, file_size, url, project_id, uploaded_by, category)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Downtown Tower - Architectural Plans', 'Complete architectural plans for the Downtown Office Tower', 'application/pdf', 15000000, 'https://example.com/documents/downtown_tower_plans.pdf', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Plans'),
  ('00000000-0000-0000-0000-000000000002', 'Downtown Tower - Foundation Report', 'Inspection report for the foundation work', 'application/pdf', 8500000, 'https://example.com/documents/downtown_tower_foundation.pdf', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Reports'),
  ('00000000-0000-0000-0000-000000000003', 'Downtown Tower - Steel Structure Specs', 'Specifications for steel structure installation', 'application/pdf', 12000000, 'https://example.com/documents/downtown_tower_steel.pdf', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Specifications'),
  ('00000000-0000-0000-0000-000000000004', 'Riverside Apartments - Initial Designs', 'Initial design concepts for Riverside Apartments', 'application/pdf', 9500000, 'https://example.com/documents/riverside_designs.pdf', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Plans'),
  ('00000000-0000-0000-0000-000000000005', 'Hospital Expansion - Medical Equipment List', 'Detailed list of medical equipment to be installed', 'application/xlsx', 5000000, 'https://example.com/documents/hospital_equipment.xlsx', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Inventory'),
  ('00000000-0000-0000-0000-000000000006', 'Hospital Expansion - Progress Photos', 'Recent photos showing construction progress', 'application/zip', 25000000, 'https://example.com/documents/hospital_photos.zip', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'Photos'),
  ('00000000-0000-0000-0000-000000000007', 'Shopping Center - Permit Application', 'City permit application documents', 'application/pdf', 7000000, 'https://example.com/documents/shopping_center_permit.pdf', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'Permits');

-- Insert budget items
INSERT INTO public.budget_items (id, project_id, category, description, estimated_amount, actual_amount, status, created_by)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Materials', 'Concrete for foundation', 750000.00, 725000.00, 'under_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Materials', 'Steel structure', 2500000.00, 2650000.00, 'over_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Labor', 'Foundation work', 1200000.00, 1200000.00, 'on_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Equipment', 'Crane rental', 350000.00, 375000.00, 'over_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'Materials', 'Medical grade materials', 1500000.00, 1450000.00, 'under_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Equipment', 'Medical equipment', 3500000.00, 3500000.00, 'on_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Labor', 'Specialized installation', 1800000.00, 1950000.00, 'over_budget', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', 'Materials', 'Foundation materials', 850000.00, 825000.00, 'under_budget', '00000000-0000-0000-0000-000000000006'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'Permits', 'City permits and fees', 250000.00, 325000.00, 'over_budget', '00000000-0000-0000-0000-000000000006'); 