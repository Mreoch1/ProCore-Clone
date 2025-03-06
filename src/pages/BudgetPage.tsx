import React, { useState, useEffect } from 'react';
import { Project, User } from '../types/project';
import { fetchBudgetItems } from '../utils/supabaseClient';
import '../styles/BudgetPage.css';

interface BudgetItem {
  id: string;
  project_id: string;
  category: string;
  description: string;
  estimated_amount: number;
  actual_amount: number;
  status: 'under_budget' | 'on_budget' | 'over_budget';
  created_by: string;
  created_at: string;
  updated_at?: string;
}

interface BudgetPageProps {
  projects: Project[];
  team: User[];
  onBudgetItemCreate?: (budgetItem: Partial<BudgetItem>) => void;
  onBudgetItemUpdate?: (id: string, updates: Partial<BudgetItem>) => void;
  onBudgetItemDelete?: (id: string) => void;
}

const BudgetPage: React.FC<BudgetPageProps> = ({
  projects,
  team,
  onBudgetItemCreate = () => {},
  onBudgetItemUpdate = () => {},
  onBudgetItemDelete = () => {}
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    const loadBudgetItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await fetchBudgetItems(selectedProject?.id || '');
        setBudgetItems(items || []);
      } catch (err: any) {
        console.error('Error fetching budget items:', err);
        setError(err.message);
        setBudgetItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetItems();
  }, [selectedProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    if (projectId === 'all') {
      setSelectedProject(null);
    } else {
      const project = projects.find(p => p.id === projectId);
      setSelectedProject(project || null);
    }
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleAddBudgetItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newBudgetItem: Partial<BudgetItem> = {
      project_id: formData.get('project_id') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      estimated_amount: parseFloat(formData.get('estimated_amount') as string),
      actual_amount: parseFloat(formData.get('actual_amount') as string) || 0,
      status: 'pending',
      created_by: team[0]?.id || '',
      created_at: new Date().toISOString()
    };
    
    onBudgetItemCreate(newBudgetItem);
    
    // In a real app, this would be handled by the parent component
    // For demo purposes, we'll add it to our local state
    const newItem = {
      ...newBudgetItem,
      id: `temp-${Date.now()}`,
    } as BudgetItem;
    
    setBudgetItems([...budgetItems, newItem]);
    setShowAddForm(false);
    form.reset();
  };

  const handleDeleteBudgetItem = (id: string) => {
    onBudgetItemDelete(id);
    
    // For demo purposes
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const filteredBudgetItems = budgetItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const sortedBudgetItems = [...filteredBudgetItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
      case 'estimated_amount':
        comparison = a.estimated_amount - b.estimated_amount;
        break;
      case 'actual_amount':
        comparison = a.actual_amount - b.actual_amount;
        break;
      case 'variance':
        const varianceA = a.actual_amount - a.estimated_amount;
        const varianceB = b.actual_amount - b.estimated_amount;
        comparison = varianceA - varianceB;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const calculateTotals = () => {
    const totals = filteredBudgetItems.reduce((acc, item) => {
      return {
        estimated: acc.estimated + item.estimated_amount,
        actual: acc.actual + item.actual_amount
      };
    }, { estimated: 0, actual: 0 });
    
    return {
      ...totals,
      variance: totals.actual - totals.estimated,
      percentVariance: totals.estimated ? ((totals.actual - totals.estimated) / totals.estimated) * 100 : 0
    };
  };

  const totals = calculateTotals();
  const categories = Array.from(new Set(budgetItems.map(item => item.category)));

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1>Budget Management</h1>
        <p>Track and manage project budgets and expenses</p>
      </div>
      
      <div className="budget-controls">
        <div className="project-selector">
          <label htmlFor="project-select">Project:</label>
          <select 
            id="project-select" 
            onChange={handleProjectChange}
            value={selectedProject?.id || 'all'}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-controls">
          <div className="category-filter">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter" 
              onChange={handleCategoryFilterChange}
              value={filterCategory}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort-control">
            <label htmlFor="sort-by">Sort By:</label>
            <select 
              id="sort-by" 
              onChange={handleSortChange}
              value={sortBy}
            >
              <option value="category">Category</option>
              <option value="description">Description</option>
              <option value="estimated_amount">Estimated Amount</option>
              <option value="actual_amount">Actual Amount</option>
              <option value="variance">Variance</option>
            </select>
            <button 
              className="sort-direction-btn" 
              onClick={toggleSortDirection}
              aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        <button 
          className="add-budget-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Budget Item'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-budget-form-container">
          <h2>Add Budget Item</h2>
          <form className="add-budget-form" onSubmit={handleAddBudgetItem}>
            <div className="form-group">
              <label htmlFor="project_id">Project</label>
              <select 
                id="project_id" 
                name="project_id" 
                required
                defaultValue={selectedProject?.id || ''}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" required>
                <option value="Materials">Materials</option>
                <option value="Labor">Labor</option>
                <option value="Equipment">Equipment</option>
                <option value="Subcontractors">Subcontractors</option>
                <option value="Permits">Permits</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input 
                type="text" 
                id="description" 
                name="description" 
                required 
                placeholder="Enter description"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="estimated_amount">Estimated Amount ($)</label>
              <input 
                type="number" 
                id="estimated_amount" 
                name="estimated_amount" 
                required 
                min="0" 
                step="0.01" 
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="actual_amount">Actual Amount ($)</label>
              <input 
                type="number" 
                id="actual_amount" 
                name="actual_amount" 
                min="0" 
                step="0.01" 
                placeholder="0.00"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Budget Item</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="budget-summary">
        <div className="summary-card">
          <h3>Total Estimated</h3>
          <div className="amount">${totals.estimated.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <h3>Total Actual</h3>
          <div className="amount">${totals.actual.toLocaleString()}</div>
        </div>
        <div className={`summary-card ${totals.variance > 0 ? 'over-budget' : 'under-budget'}`}>
          <h3>Variance</h3>
          <div className="amount">
            ${Math.abs(totals.variance).toLocaleString()}
            <span className="variance-indicator">
              {totals.variance > 0 ? 'Over' : totals.variance < 0 ? 'Under' : 'On Budget'}
            </span>
          </div>
        </div>
        <div className={`summary-card ${totals.percentVariance > 0 ? 'over-budget' : 'under-budget'}`}>
          <h3>Percent Variance</h3>
          <div className="amount">
            {Math.abs(totals.percentVariance).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="budget-table-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Estimated ($)</th>
              <th>Actual ($)</th>
              <th>Variance ($)</th>
              <th>% Variance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBudgetItems.length > 0 ? (
              sortedBudgetItems.map(item => {
                const variance = item.actual_amount - item.estimated_amount;
                const percentVariance = item.estimated_amount 
                  ? (variance / item.estimated_amount) * 100 
                  : 0;
                
                return (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td className="amount-cell">${item.estimated_amount.toLocaleString()}</td>
                    <td className="amount-cell">${item.actual_amount.toLocaleString()}</td>
                    <td className={`amount-cell ${variance > 0 ? 'over-budget' : variance < 0 ? 'under-budget' : ''}`}>
                      ${Math.abs(variance).toLocaleString()}
                      <span className="variance-indicator-small">
                        {variance > 0 ? '↑' : variance < 0 ? '↓' : ''}
                      </span>
                    </td>
                    <td className={`amount-cell ${percentVariance > 0 ? 'over-budget' : percentVariance < 0 ? 'under-budget' : ''}`}>
                      {Math.abs(percentVariance).toFixed(2)}%
                    </td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn" 
                          aria-label="Edit"
                          onClick={() => onBudgetItemUpdate(item.id, {})}
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn" 
                          aria-label="Delete"
                          onClick={() => handleDeleteBudgetItem(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="empty-state">
                  No budget items found. Add a budget item to get started.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td colSpan={2}><strong>Totals</strong></td>
              <td className="amount-cell"><strong>${totals.estimated.toLocaleString()}</strong></td>
              <td className="amount-cell"><strong>${totals.actual.toLocaleString()}</strong></td>
              <td className={`amount-cell ${totals.variance > 0 ? 'over-budget' : totals.variance < 0 ? 'under-budget' : ''}`}>
                <strong>${Math.abs(totals.variance).toLocaleString()}</strong>
              </td>
              <td className={`amount-cell ${totals.percentVariance > 0 ? 'over-budget' : totals.percentVariance < 0 ? 'under-budget' : ''}`}>
                <strong>{Math.abs(totals.percentVariance).toFixed(2)}%</strong>
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="budget-charts">
        <div className="chart-container">
          <h3>Budget Breakdown by Category</h3>
          <div className="budget-chart">
            {categories.map(category => {
              const categoryItems = filteredBudgetItems.filter(item => item.category === category);
              const categoryEstimated = categoryItems.reduce((sum, item) => sum + item.estimated_amount, 0);
              const categoryActual = categoryItems.reduce((sum, item) => sum + item.actual_amount, 0);
              const totalEstimated = totals.estimated;
              const estimatedPercentage = totalEstimated ? (categoryEstimated / totalEstimated) * 100 : 0;
              const actualPercentage = totalEstimated ? (categoryActual / totalEstimated) * 100 : 0;
              
              return (
                <div key={category} className="chart-item">
                  <div className="chart-label">{category}</div>
                  <div className="chart-bars">
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar estimated"
                        style={{ width: `${estimatedPercentage}%` }}
                      >
                        <span className="chart-value">${categoryEstimated.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="chart-bar-container">
                      <div 
                        className={`chart-bar actual ${categoryActual > categoryEstimated ? 'over-budget' : 'under-budget'}`}
                        style={{ width: `${actualPercentage}%` }}
                      >
                        <span className="chart-value">${categoryActual.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color estimated"></div>
                <div className="legend-label">Estimated</div>
              </div>
              <div className="legend-item">
                <div className="legend-color actual"></div>
                <div className="legend-label">Actual</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage; 