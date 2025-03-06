import { useState, useEffect } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ProjectDetail from './components/ProjectDetail'
import LoadingSpinner from './components/LoadingSpinner'
import TasksPage from './pages/TasksPage'
import DocumentsPage from './pages/DocumentsPage'
import TeamPage from './pages/TeamPage'
import ReportsPage from './pages/ReportsPage'
import SchedulePage from './pages/SchedulePage'
import BudgetPage from './pages/BudgetPage'
import SettingsPage from './pages/SettingsPage'
import HelpPage from './pages/HelpPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { Project, Task, Document, User } from './types/project'
import { 
  fetchProjects, 
  fetchTasks, 
  fetchDocuments, 
  fetchTeamMembers, 
  fetchBudgetItems,
  signOut,
  getSession,
  getCurrentUser
} from './utils/supabaseClient'

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'project' | 'tasks' | 'documents' | 'team' | 'reports' | 'schedule' | 'budget' | 'settings' | 'help' | '404'>('dashboard');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check for saved session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check Supabase session
        const session = await getSession();
        
        if (session) {
          const user = await getCurrentUser();
          
          if (user) {
            const userData = user.profile || {};
            const authenticatedUser: User = {
              id: user.id,
              name: userData.name || user.user_metadata?.name || 'User',
              email: user.email || '',
              role: userData.role || user.user_metadata?.role || 'team_member',
              company: userData.company || user.user_metadata?.company,
              position: userData.position || user.user_metadata?.position,
              avatar_url: userData.avatar_url
            };
            
            setCurrentUser(authenticatedUser);
            setIsAuthenticated(true);
          }
        } else {
          // Fallback to localStorage for demo purposes
          const savedUser = localStorage.getItem('procore_user');
          if (savedUser) {
            try {
              const user = JSON.parse(savedUser);
              setCurrentUser(user);
              setIsAuthenticated(true);
            } catch (err) {
              console.error('Failed to parse saved user:', err);
              localStorage.removeItem('procore_user');
            }
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  // Mock current user for settings page if not set
  const userForSettings: User = currentUser || {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'project_manager',
    phone: '(555) 123-4567',
    company: 'Construction Co.',
    position: 'Senior Project Manager',
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
  };

  // Fetch data when authenticated
  useEffect(() => {
    if (!isAuthenticated || !sessionChecked) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data from Supabase
        const [projectsData, tasksData, documentsData, teamData] = await Promise.all([
          fetchProjects(),
          fetchTasks(),
          fetchDocuments(),
          fetchTeamMembers()
        ]);
        
        // Update state with real data
        setProjects(projectsData || []);
        setTasks(tasksData || []);
        setDocuments(documentsData || []);
        setTeam(teamData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
        
        // Initialize with empty arrays instead of mock data
        setProjects([]);
        setTasks([]);
        setDocuments([]);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, sessionChecked]);

  // Handle login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('procore_user');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActiveView('dashboard');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handle registration
  const handleRegister = (userData: Partial<User>) => {
    console.log('User registered:', userData);
    // Registration is handled in the LoginPage component
  };

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    setActiveView('project');
  };

  // Handle navigation change
  const handleNavChange = (view: typeof activeView) => {
    setActiveView(view);
    if (view !== 'project') {
      setActiveProject(null);
    }
  };

  // Handle task update
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  // Handle document upload
  const handleDocumentUpload = (newDocument: Document) => {
    setDocuments([newDocument, ...documents]);
  };

  // Handle team member update
  const handleTeamMemberUpdate = (updatedMember: User) => {
    setTeam(team.map(member => member.id === updatedMember.id ? updatedMember : member));
    
    // If the current user is updated, update the current user state
    if (currentUser && currentUser.id === updatedMember.id) {
      setCurrentUser(updatedMember);
    }
  };

  // Handle user settings update
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    // Also update in team members if present
    if (team.some(member => member.id === updatedUser.id)) {
      handleTeamMemberUpdate(updatedUser);
    }
  };

  // Handle support contact
  const handleSupportContact = (message: string, category: string) => {
    console.log(`Support message sent (${category}):`, message);
    // In a real app, this would send the message to a support system
    alert('Your message has been sent to our support team. We will get back to you soon.');
  };

  if (!sessionChecked) {
    return <LoadingSpinner size="large" message="Loading application..." />;
  }

  return (
    <div className="app">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          <Navigation 
            activeView={activeView} 
            onNavChange={handleNavChange} 
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <div className="main-content">
            <Header 
              title={
                activeView === 'dashboard' ? 'Dashboard' :
                activeView === 'project' && activeProject ? activeProject.name :
                activeView === 'tasks' ? 'Tasks' :
                activeView === 'documents' ? 'Documents' :
                activeView === 'team' ? 'Team' :
                activeView === 'reports' ? 'Reports' :
                activeView === 'schedule' ? 'Schedule' :
                activeView === 'budget' ? 'Budget' :
                activeView === 'settings' ? 'Settings' :
                activeView === 'help' ? 'Help Center' :
                'Not Found'
              } 
              user={currentUser}
            />
            
            {loading ? (
              <LoadingSpinner size="large" message="Loading data..." />
            ) : (
              <div className="content">
                {error && <div className="error-message">{error}</div>}
                
                {activeView === 'dashboard' && (
                  <Dashboard 
                    projects={projects} 
                    tasks={tasks} 
                    onProjectSelect={handleProjectSelect} 
                  />
                )}
                
                {activeView === 'project' && activeProject && (
                  <ProjectDetail 
                    project={activeProject} 
                    tasks={tasks.filter(task => task.project_id === activeProject.id)} 
                    documents={documents.filter(doc => doc.project_id === activeProject.id)}
                    onTaskUpdate={handleTaskUpdate}
                    onDocumentUpload={handleDocumentUpload}
                  />
                )}
                
                {activeView === 'tasks' && (
                  <TasksPage 
                    tasks={tasks} 
                    projects={projects} 
                    team={team} 
                    onTaskUpdate={handleTaskUpdate} 
                  />
                )}
                
                {activeView === 'documents' && (
                  <DocumentsPage 
                    documents={documents} 
                    projects={projects} 
                    onDocumentUpload={handleDocumentUpload} 
                    currentUser={currentUser}
                  />
                )}
                
                {activeView === 'team' && (
                  <TeamPage 
                    team={team} 
                    onTeamMemberUpdate={handleTeamMemberUpdate} 
                    currentUser={currentUser}
                  />
                )}
                
                {activeView === 'reports' && (
                  <ReportsPage projects={projects} tasks={tasks} />
                )}
                
                {activeView === 'schedule' && (
                  <SchedulePage projects={projects} tasks={tasks} />
                )}
                
                {activeView === 'budget' && (
                  <BudgetPage projects={projects} currentUser={currentUser} />
                )}
                
                {activeView === 'settings' && (
                  <SettingsPage 
                    user={userForSettings} 
                    onUserUpdate={handleUserUpdate} 
                  />
                )}
                
                {activeView === 'help' && (
                  <HelpPage onSupportContact={handleSupportContact} />
                )}
                
                {activeView === '404' && (
                  <NotFoundPage onNavigate={handleNavChange} />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
