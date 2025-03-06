import { useState, useEffect } from 'react';
import { Document, Project } from '../types/project';
import '../styles/DocumentsPage.css';

interface DocumentsPageProps {
  documents: Document[];
  projects: Project[];
  onDocumentUpload?: (document: Partial<Document>) => void;
  onDocumentDelete?: (documentId: string) => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents,
  projects,
  onDocumentUpload,
  onDocumentDelete
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    description: '',
    category: '',
    project_id: '',
    file_type: '',
    file_size: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Document categories
  const categories = [
    'Plans',
    'Contracts',
    'Permits',
    'Specifications',
    'Reports',
    'Photos',
    'Invoices',
    'Other'
  ];

  useEffect(() => {
    filterDocuments();
  }, [documents, selectedProject, selectedCategory, searchQuery]);

  const filterDocuments = () => {
    let filtered = [...documents];
    
    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(doc => doc.project_id === selectedProject);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        (doc.description && doc.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredDocuments(filtered);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Update new document with file info
      setNewDocument(prev => ({
        ...prev,
        title: file.name,
        file_type: file.type,
        file_size: file.size
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !newDocument.title || !newDocument.project_id) {
      alert('Please fill in all required fields and select a file');
      return;
    }
    
    if (onDocumentUpload) {
      // In a real app, you would upload the file to a server here
      // For now, we'll just simulate it
      const uploadedDocument: Partial<Document> = {
        ...newDocument,
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'Current User', // In a real app, this would be the current user
        url: URL.createObjectURL(selectedFile) // In a real app, this would be the URL from the server
      };
      
      onDocumentUpload(uploadedDocument);
      
      // Reset form
      setNewDocument({
        title: '',
        description: '',
        category: '',
        project_id: '',
        file_type: '',
        file_size: 0
      });
      setSelectedFile(null);
      setShowUploadForm(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '🗜️';
    if (fileType.includes('video')) return '🎬';
    return '📁';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>Documents</h1>
        <button 
          className="action-button"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '+ Upload Document'}
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="file">Select File*</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <div className="selected-file-info">
                  <span>{selectedFile.name}</span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Document Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newDocument.title}
                onChange={handleInputChange}
                required
                placeholder="Enter document title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newDocument.description || ''}
                onChange={handleInputChange}
                placeholder="Enter document description"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project_id">Project*</label>
                <select
                  id="project_id"
                  name="project_id"
                  value={newDocument.project_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newDocument.category || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="action-button">Upload Document</button>
              <button 
                type="button" 
                className="action-button secondary"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="documents-filters">
        <div className="filter-group">
          <label htmlFor="project-filter">Project:</label>
          <select 
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select 
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="search-group">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="documents-grid">
          {filteredDocuments.map(document => (
            <div key={document.id} className="document-card">
              <div className="document-icon">
                {getFileIcon(document.file_type)}
              </div>
              <div className="document-info">
                <h3 className="document-title">{document.title}</h3>
                <div className="document-meta">
                  <span className="document-category">{document.category || 'Uncategorized'}</span>
                  <span className="document-size">{formatFileSize(document.file_size)}</span>
                </div>
                {document.description && (
                  <p className="document-description">{document.description}</p>
                )}
                <div className="document-details">
                  <div className="document-project">
                    <span className="detail-label">Project:</span>
                    <span className="detail-value">{getProjectName(document.project_id)}</span>
                  </div>
                  <div className="document-uploaded">
                    <span className="detail-label">Uploaded:</span>
                    <span className="detail-value">{formatDate(document.uploaded_at)}</span>
                  </div>
                  <div className="document-uploader">
                    <span className="detail-label">By:</span>
                    <span className="detail-value">{document.uploaded_by}</span>
                  </div>
                </div>
              </div>
              <div className="document-actions">
                <a href={document.url} className="icon-button" title="Download" target="_blank" rel="noopener noreferrer">
                  ⬇️
                </a>
                <button className="icon-button" title="Share">
                  🔗
                </button>
                <button 
                  className="icon-button" 
                  title="Delete"
                  onClick={() => onDocumentDelete && onDocumentDelete(document.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No documents match your filters. Try changing your filter criteria or upload a new document.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage; 