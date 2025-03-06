import { useState, useEffect } from 'react';
import { User, Project } from '../types/project';
import '../styles/TeamPage.css';

interface TeamPageProps {
  team: User[];
  projects: Project[];
  onTeamMemberAdd?: (member: Partial<User>) => void;
  onTeamMemberUpdate?: (memberId: string, updates: Partial<User>) => void;
  onTeamMemberDelete?: (memberId: string) => void;
}

const TeamPage: React.FC<TeamPageProps> = ({
  team,
  projects,
  onTeamMemberAdd,
  onTeamMemberUpdate,
  onTeamMemberDelete
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [filteredTeam, setFilteredTeam] = useState<User[]>(team);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<User>>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'team_member',
    company: '',
    position: '',
    phone: ''
  });

  useEffect(() => {
    filterTeamMembers();
  }, [team, searchQuery, roleFilter]);

  const filterTeamMembers = () => {
    let filtered = [...team];
    
    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        (member.first_name && member.first_name.toLowerCase().includes(query)) || 
        (member.last_name && member.last_name.toLowerCase().includes(query)) ||
        (member.email && member.email.toLowerCase().includes(query)) ||
        (member.company && member.company.toLowerCase().includes(query)) ||
        (member.position && member.position.toLowerCase().includes(query))
      );
    }
    
    setFilteredTeam(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.first_name || !newMember.last_name || !newMember.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (onTeamMemberAdd) {
      onTeamMemberAdd(newMember);
      
      // Reset form
      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        role: 'team_member',
        company: '',
        position: '',
        phone: ''
      });
      setShowAddMemberForm(false);
    }
  };

  const getInitials = (user: User) => {
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  };

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getProjectsForUser = (userId: string) => {
    // In a real app, you would have a relationship between users and projects
    // For now, we'll just return a random subset of projects for demo purposes
    const userProjects = projects.filter((_, index) => index % (userId.length % 3 + 2) === 0);
    return userProjects.length > 0 ? userProjects : [];
  };

  return (
    <div className="team-page">
      <div className="team-header">
        <h1>Team</h1>
        <button 
          className="action-button"
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
        >
          {showAddMemberForm ? 'Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {showAddMemberForm && (
        <div className="add-member-form-container">
          <form className="add-member-form" onSubmit={handleAddMember}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name*</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={newMember.first_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Last Name*</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={newMember.last_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newMember.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={newMember.company || ''}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={newMember.position || ''}
                  onChange={handleInputChange}
                  placeholder="Enter job position"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role">Role*</label>
                <select
                  id="role"
                  name="role"
                  value={newMember.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="project_manager">Project Manager</option>
                  <option value="team_member">Team Member</option>
                  <option value="client">Client</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="action-button">Add Team Member</button>
              <button 
                type="button" 
                className="action-button secondary"
                onClick={() => setShowAddMemberForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="team-filters">
        <div className="filter-group">
          <label htmlFor="role-filter">Role:</label>
          <select 
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="project_manager">Project Manager</option>
            <option value="team_member">Team Member</option>
            <option value="client">Client</option>
            <option value="subcontractor">Subcontractor</option>
            <option value="consultant">Consultant</option>
          </select>
        </div>
        
        <div className="search-group">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTeam.length > 0 ? (
        <div className="team-grid">
          {filteredTeam.map(member => {
            const memberProjects = getProjectsForUser(member.id);
            
            return (
              <div key={member.id} className="team-card">
                <div className="team-card-header">
                  <div className="team-avatar" data-role={member.role}>
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
                    ) : (
                      getInitials(member)
                    )}
                  </div>
                  <div className="team-info">
                    <h3>{member.first_name} {member.last_name}</h3>
                    <div className="team-role" data-role={member.role}>
                      {formatRoleName(member.role || 'team_member')}
                    </div>
                  </div>
                  <div className="team-actions">
                    <button className="icon-button" title="Edit">✏️</button>
                    <button 
                      className="icon-button" 
                      title="Delete"
                      onClick={() => onTeamMemberDelete && onTeamMemberDelete(member.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="team-card-body">
                  <div className="team-contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    </div>
                    {member.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <a href={`tel:${member.phone}`}>{member.phone}</a>
                      </div>
                    )}
                    {member.company && (
                      <div className="contact-item">
                        <span className="contact-icon">🏢</span>
                        <span>{member.company}</span>
                      </div>
                    )}
                    {member.position && (
                      <div className="contact-item">
                        <span className="contact-icon">👔</span>
                        <span>{member.position}</span>
                      </div>
                    )}
                  </div>
                  
                  {memberProjects.length > 0 && (
                    <div className="team-projects">
                      <h4>Assigned Projects</h4>
                      <ul className="project-list">
                        {memberProjects.map(project => (
                          <li key={project.id} className="project-item">
                            <span className="project-name">{project.name}</span>
                            <span className="project-status" data-status={project.status}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>No team members match your filters. Try changing your filter criteria or add a new team member.</p>
        </div>
      )}
    </div>
  );
};

export default TeamPage; 