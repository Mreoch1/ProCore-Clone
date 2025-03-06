import React, { useState, useEffect } from 'react';
import { Project, Task } from '../types/project';
import '../styles/SchedulePage.css';

interface SchedulePageProps {
  projects: Project[];
  tasks: Task[];
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  projects,
  tasks
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);

  useEffect(() => {
    generateScheduleItems();
  }, [selectedProject, projects, tasks, viewMode, currentDate]);

  const generateScheduleItems = () => {
    // Filter tasks based on selected project
    const filteredTasks = selectedProject === 'all'
      ? tasks
      : tasks.filter(task => task.project_id === selectedProject);
    
    // Convert tasks to schedule items
    const items = filteredTasks.map(task => {
      const project = projects.find(p => p.id === task.project_id);
      return {
        id: task.id,
        title: task.title,
        start: task.due_date ? new Date(task.due_date) : null,
        end: task.due_date ? new Date(task.due_date) : null, // In a real app, tasks would have start and end dates
        status: task.status,
        priority: task.priority,
        project: project?.name || 'Unknown Project',
        assignee: task.assigned_to || 'Unassigned'
      };
    }).filter(item => item.start !== null);
    
    // Add project milestones
    if (selectedProject === 'all') {
      projects.forEach(project => {
        if (project.start_date) {
          items.push({
            id: `start-${project.id}`,
            title: `${project.name} Start`,
            start: new Date(project.start_date),
            end: new Date(project.start_date),
            isMilestone: true,
            milestoneType: 'start',
            project: project.name
          });
        }
        
        if (project.end_date) {
          items.push({
            id: `end-${project.id}`,
            title: `${project.name} Deadline`,
            start: new Date(project.end_date),
            end: new Date(project.end_date),
            isMilestone: true,
            milestoneType: 'end',
            project: project.name
          });
        }
      });
    } else {
      const selectedProj = projects.find(p => p.id === selectedProject);
      if (selectedProj) {
        if (selectedProj.start_date) {
          items.push({
            id: `start-${selectedProj.id}`,
            title: `Project Start`,
            start: new Date(selectedProj.start_date),
            end: new Date(selectedProj.start_date),
            isMilestone: true,
            milestoneType: 'start',
            project: selectedProj.name
          });
        }
        
        if (selectedProj.end_date) {
          items.push({
            id: `end-${selectedProj.id}`,
            title: `Project Deadline`,
            start: new Date(selectedProj.end_date),
            end: new Date(selectedProj.end_date),
            isMilestone: true,
            milestoneType: 'end',
            project: selectedProj.name
          });
        }
      }
    }
    
    // Sort items by date
    items.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    setScheduleItems(items);
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return '';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isItemOnDate = (item: any, date: Date) => {
    const itemDate = new Date(item.start);
    return itemDate.getDate() === date.getDate() &&
      itemDate.getMonth() === date.getMonth() &&
      itemDate.getFullYear() === date.getFullYear();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    // Create array for all cells in the calendar (including empty cells for proper alignment)
    const calendarDays = Array(startingDayOfWeek).fill(null).concat(days);
    
    return (
      <div className="month-view">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-header-cell">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`calendar-cell ${day ? (isToday(day) ? 'today' : '') : 'empty'}`}
            >
              {day && (
                <>
                  <div className="calendar-date">{day.getDate()}</div>
                  <div className="calendar-items">
                    {scheduleItems
                      .filter(item => day && isItemOnDate(item, day))
                      .slice(0, 3)
                      .map(item => (
                        <div 
                          key={item.id} 
                          className={`calendar-item ${item.isMilestone ? `milestone milestone-${item.milestoneType}` : `status-${item.status}`}`}
                          title={`${item.title} - ${item.project}`}
                        >
                          {item.title}
                        </div>
                      ))
                    }
                    {scheduleItems.filter(item => day && isItemOnDate(item, day)).length > 3 && (
                      <div className="more-items">
                        +{scheduleItems.filter(item => day && isItemOnDate(item, day)).length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate);
    
    return (
      <div className="week-view">
        <div className="week-header">
          {days.map((day, index) => (
            <div key={index} className={`week-header-cell ${isToday(day) ? 'today' : ''}`}>
              <div className="week-day">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="week-date">{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="week-grid">
          {days.map((day, index) => (
            <div key={index} className={`week-cell ${isToday(day) ? 'today' : ''}`}>
              {scheduleItems
                .filter(item => isItemOnDate(item, day))
                .map(item => (
                  <div 
                    key={item.id} 
                    className={`week-item ${item.isMilestone ? `milestone milestone-${item.milestoneType}` : `status-${item.status}`}`}
                  >
                    <div className="item-title">{item.title}</div>
                    <div className="item-project">{item.project}</div>
                    {!item.isMilestone && (
                      <div className="item-assignee">{item.assignee}</div>
                    )}
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    // Group items by date
    const groupedItems: {[key: string]: any[]} = {};
    
    scheduleItems.forEach(item => {
      const dateKey = item.start.toISOString().split('T')[0];
      if (!groupedItems[dateKey]) {
        groupedItems[dateKey] = [];
      }
      groupedItems[dateKey].push(item);
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedItems).sort();
    
    return (
      <div className="list-view">
        {sortedDates.length > 0 ? (
          sortedDates.map(dateKey => (
            <div key={dateKey} className="list-date-group">
              <div className="list-date-header">
                <div className="list-date">
                  {new Date(dateKey).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="list-items">
                {groupedItems[dateKey].map(item => (
                  <div 
                    key={item.id} 
                    className={`list-item ${item.isMilestone ? `milestone milestone-${item.milestoneType}` : `status-${item.status}`}`}
                  >
                    <div className="item-time">
                      {item.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="item-content">
                      <div className="item-title">{item.title}</div>
                      <div className="item-details">
                        <span className="item-project">{item.project}</span>
                        {!item.isMilestone && (
                          <>
                            <span className="item-separator">•</span>
                            <span className="item-assignee">{item.assignee}</span>
                            <span className="item-separator">•</span>
                            <span className={`item-status status-${item.status}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No scheduled items in the selected time period</div>
        )}
      </div>
    );
  };

  const renderScheduleView = () => {
    switch (viewMode) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'list':
        return renderListView();
      default:
        return null;
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1>Schedule</h1>
      </div>
      
      <div className="schedule-controls">
        <div className="project-selector">
          <label htmlFor="project-filter">Project:</label>
          <select 
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="view-controls">
          <div className="view-selector">
            <button 
              className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          
          <div className="navigation-controls">
            <button className="nav-button" onClick={navigatePrevious}>
              &lt;
            </button>
            <button className="today-button" onClick={navigateToday}>
              Today
            </button>
            <button className="nav-button" onClick={navigateNext}>
              &gt;
            </button>
          </div>
          
          <div className="date-display">
            {formatDateRange()}
          </div>
        </div>
      </div>
      
      <div className="schedule-container">
        {renderScheduleView()}
      </div>
    </div>
  );
};

export default SchedulePage; 