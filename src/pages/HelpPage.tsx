import React, { useState } from 'react';
import '../styles/HelpPage.css';

interface HelpPageProps {
  onContactSupport?: (message: string, category: string, email: string) => void;
}

const HelpPage: React.FC<HelpPageProps> = ({
  onContactSupport = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');
  const [contactForm, setContactForm] = useState({
    email: '',
    category: 'general',
    message: ''
  });
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  
  // Mock FAQs data
  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      faqs: [
        {
          id: 'gs-1',
          question: 'How do I create my first project?',
          answer: 'To create your first project, navigate to the Projects page and click on the "New Project" button. Fill in the required information such as project name, description, start date, and end date. You can also assign team members to the project at this stage or add them later.'
        },
        {
          id: 'gs-2',
          question: 'How do I invite team members?',
          answer: 'You can invite team members by going to the Team page and clicking on the "Invite Member" button. Enter their email address, select their role, and click "Send Invitation". They will receive an email with instructions to join your workspace.'
        },
        {
          id: 'gs-3',
          question: 'What are the different user roles?',
          answer: 'The system has several roles including Project Manager, Team Lead, Developer, Designer, and Viewer. Each role has different permissions and access levels. Project Managers have full access, while Viewers can only view content without making changes.'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      faqs: [
        {
          id: 'proj-1',
          question: 'How do I edit project details?',
          answer: 'To edit project details, go to the Projects page, select the project you want to edit, and click on the "Edit" button or icon. You can modify the project name, description, dates, and other properties.'
        },
        {
          id: 'proj-2',
          question: 'Can I archive a project instead of deleting it?',
          answer: 'Yes, you can archive a project to keep its data while removing it from your active projects list. On the Projects page, select the project and click on the "Archive" option from the actions menu. Archived projects can be restored later if needed.'
        },
        {
          id: 'proj-3',
          question: 'How do I track project progress?',
          answer: 'You can track project progress through the Dashboard and Reports pages. The Dashboard provides a high-level overview with key metrics, while the Reports page offers detailed analytics on task completion, budget utilization, and team performance.'
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      faqs: [
        {
          id: 'task-1',
          question: 'How do I assign a task to someone?',
          answer: 'To assign a task, go to the Tasks page, select the task you want to assign, and click on the "Assign" button or select the assignee field. Choose the team member from the dropdown list and save your changes.'
        },
        {
          id: 'task-2',
          question: 'What do the different task statuses mean?',
          answer: 'Task statuses help track progress. "Not Started" means work hasn\'t begun, "In Progress" means work has started, "Under Review" means it\'s being checked, "Completed" means the task is finished, and "Blocked" means there are obstacles preventing progress.'
        },
        {
          id: 'task-3',
          question: 'Can I set recurring tasks?',
          answer: 'Yes, when creating or editing a task, you can check the "Make Recurring" option and set the frequency (daily, weekly, monthly) and end conditions. This is useful for regular meetings, reports, or maintenance tasks.'
        }
      ]
    },
    {
      id: 'documents',
      title: 'Documents',
      faqs: [
        {
          id: 'doc-1',
          question: 'What file types are supported for upload?',
          answer: 'The system supports a wide range of file types including PDF, Word documents (.docx, .doc), Excel spreadsheets (.xlsx, .xls), images (.jpg, .png, .gif), CAD files (.dwg), and more. The maximum file size is 50MB per file.'
        },
        {
          id: 'doc-2',
          question: 'How do I share documents with external stakeholders?',
          answer: 'To share documents with people outside your team, select the document and click on "Share". You can generate a secure link with optional password protection and expiration date, or send an email invitation directly from the system.'
        },
        {
          id: 'doc-3',
          question: 'Can I edit documents online?',
          answer: 'For certain file types like Word documents and spreadsheets, you can use the "Edit Online" feature which opens the document in a compatible web editor. Changes are automatically saved back to the system. For other file types, you\'ll need to download, edit, and re-upload.'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      faqs: [
        {
          id: 'rep-1',
          question: 'How do I export reports?',
          answer: 'To export a report, navigate to the Reports page, select the report you want to export, and click on the "Export" button. You can choose from formats like PDF, Excel, or CSV depending on the report type.'
        },
        {
          id: 'rep-2',
          question: 'Can I schedule automated reports?',
          answer: 'Yes, you can schedule reports to be generated and sent automatically. Go to the Reports page, select the report, click on "Schedule", and set the frequency (daily, weekly, monthly) and recipients. Reports will be delivered via email.'
        },
        {
          id: 'rep-3',
          question: 'How do I create a custom report?',
          answer: 'To create a custom report, go to the Reports page and click on "Create Custom Report". Select the data points you want to include, choose visualization types, set filters, and save your report. Custom reports can be shared with team members.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Billing',
      faqs: [
        {
          id: 'acc-1',
          question: 'How do I change my password?',
          answer: 'To change your password, go to the Settings page, select the "Account & Security" tab, and look for the "Change Password" section. Enter your current password and your new password twice to confirm.'
        },
        {
          id: 'acc-2',
          question: 'How do I update my subscription plan?',
          answer: 'To update your subscription, go to Settings, select the "Billing" tab, and click on "Change Plan". You can view available plans and their features, select the one that fits your needs, and follow the payment process to upgrade or downgrade.'
        },
        {
          id: 'acc-3',
          question: 'How do I update my profile information?',
          answer: 'To update your profile, go to the Settings page and select the "Profile" tab. You can edit your name, contact information, job title, profile picture, and other personal details. Don\'t forget to save your changes.'
        }
      ]
    }
  ];
  
  // Video tutorials data
  const videoTutorials = [
    {
      id: 'video-1',
      title: 'Getting Started with ProCore Clone',
      thumbnail: 'https://via.placeholder.com/300x180',
      duration: '5:32',
      description: 'Learn the basics of navigating the platform and setting up your first project.'
    },
    {
      id: 'video-2',
      title: 'Managing Tasks Effectively',
      thumbnail: 'https://via.placeholder.com/300x180',
      duration: '7:15',
      description: 'Discover how to create, assign, and track tasks to improve team productivity.'
    },
    {
      id: 'video-3',
      title: 'Creating Detailed Reports',
      thumbnail: 'https://via.placeholder.com/300x180',
      duration: '6:48',
      description: 'Learn how to generate insightful reports to track project progress and performance.'
    },
    {
      id: 'video-4',
      title: 'Document Management Best Practices',
      thumbnail: 'https://via.placeholder.com/300x180',
      duration: '8:22',
      description: 'Explore efficient ways to organize, share, and collaborate on project documents.'
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === '' 
    ? [] 
    : faqCategories.flatMap(category => 
        category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(faq => ({ ...faq, category: category.title }))
      );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContactSupport(contactForm.message, contactForm.category, contactForm.email);
    // In a real app, this would send the data to the server
    alert('Your message has been sent! Our support team will get back to you soon.');
    
    // Reset form
    setContactForm({
      email: '',
      category: 'general',
      message: ''
    });
  };
  
  const toggleFaq = (faqId: string) => {
    setExpandedFaqs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId) 
        : [...prev, faqId]
    );
  };
  
  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help Center</h1>
        <p>Find answers to common questions or contact our support team</p>
        
        <div className="help-search">
          <input 
            type="text" 
            placeholder="Search for help..." 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
          <button className="search-btn">
            <i className="search-icon">🔍</i>
          </button>
        </div>
      </div>
      
      {searchQuery.trim() !== '' && (
        <div className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          {filteredFaqs.length === 0 ? (
            <p className="no-results">No results found. Try different keywords or contact support.</p>
          ) : (
            <div className="faq-list">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <div 
                    className={`faq-question ${expandedFaqs.includes(faq.id) ? 'expanded' : ''}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <h3>{faq.question}</h3>
                    <span className="category-tag">{faq.category}</span>
                    <span className="expand-icon">{expandedFaqs.includes(faq.id) ? '−' : '+'}</span>
                  </div>
                  {expandedFaqs.includes(faq.id) && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {searchQuery.trim() === '' && (
        <div className="help-content">
          <div className="help-sidebar">
            <h3>Help Categories</h3>
            <ul className="help-categories">
              {faqCategories.map(category => (
                <li 
                  key={category.id}
                  className={activeCategory === category.id ? 'active' : ''}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.title}
                </li>
              ))}
            </ul>
            
            <div className="contact-support">
              <h3>Need More Help?</h3>
              <p>Our support team is ready to assist you with any questions or issues.</p>
              <button 
                className="contact-btn"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Support
              </button>
            </div>
          </div>
          
          <div className="help-main">
            {faqCategories.find(cat => cat.id === activeCategory) && (
              <div className="faq-section">
                <h2>{faqCategories.find(cat => cat.id === activeCategory)?.title} FAQs</h2>
                <div className="faq-list">
                  {faqCategories
                    .find(cat => cat.id === activeCategory)?.faqs
                    .map(faq => (
                      <div key={faq.id} className="faq-item">
                        <div 
                          className={`faq-question ${expandedFaqs.includes(faq.id) ? 'expanded' : ''}`}
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <h3>{faq.question}</h3>
                          <span className="expand-icon">{expandedFaqs.includes(faq.id) ? '−' : '+'}</span>
                        </div>
                        {expandedFaqs.includes(faq.id) && (
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            <div className="video-tutorials">
              <h2>Video Tutorials</h2>
              <div className="video-grid">
                {videoTutorials.map(video => (
                  <div key={video.id} className="video-card">
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <span className="video-duration">{video.duration}</span>
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div id="contact-form" className="contact-section">
              <h2>Contact Support</h2>
              <p>Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.</p>
              
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={contactForm.email} 
                    onChange={handleContactFormChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category" 
                    name="category" 
                    value={contactForm.category} 
                    onChange={handleContactFormChange} 
                    required
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Account</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={contactForm.message} 
                    onChange={handleContactFormChange} 
                    required 
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="help-footer">
        <div className="help-resources">
          <div className="resource-item">
            <h3>Documentation</h3>
            <p>Browse our detailed documentation for in-depth information about all features.</p>
            <a href="#" className="resource-link">View Documentation</a>
          </div>
          
          <div className="resource-item">
            <h3>Community Forum</h3>
            <p>Join our community forum to connect with other users and share knowledge.</p>
            <a href="#" className="resource-link">Visit Forum</a>
          </div>
          
          <div className="resource-item">
            <h3>Webinars & Training</h3>
            <p>Register for upcoming webinars or access recorded training sessions.</p>
            <a href="#" className="resource-link">View Schedule</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 