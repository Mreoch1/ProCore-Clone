# Recon Project Management System

A full-featured construction project management application built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure login and registration with Supabase Auth
- **Project Management**: Create and manage construction projects
- **Task Management**: Assign and track tasks for team members
- **Document Management**: Upload, organize, and share project documents
- **Budget Tracking**: Monitor project budgets and expenses
- **Team Collaboration**: Manage team members and their roles
- **Real-time Updates**: Get instant updates on project changes

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - CSS for styling
  - React Router for navigation

- **Backend**:
  - Supabase for authentication, database, and storage
  - PostgreSQL database with Row Level Security
  - Supabase Storage for file uploads

- **Deployment**:
  - Docker for containerization
  - GitHub for version control and CI/CD
  - Netlify for frontend hosting
  - Supabase for backend services

## Project Structure

```
procore-clone/
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
├── backend/                # Backend services (minimal, mostly using Supabase)
│   ├── src/                # Backend source code
│   └── Dockerfile          # Backend Docker configuration
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   ├── seed.sql            # Seed data
│   └── config.toml         # Supabase configuration
├── docker-compose.yml      # Docker Compose configuration
└── netlify.toml            # Netlify deployment configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose
- Supabase CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recon-project-management.git
   cd recon-project-management
   ```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     JWT_SECRET=your_jwt_secret
     ```

3. Start the application using Docker:
   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080

### Alternative Setup (Without Docker)

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env.local` file in the `frontend` directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the Supabase local development environment:
   ```bash
   cd ../supabase
   supabase start
   ```

4. Apply database migrations and seed data:
   ```bash
   supabase db reset
   ```

5. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

For testing purposes, you can use the following credentials:

- **Admin User**:
  - Email: admin@recon-project.com
  - Password: password123

- **Project Manager**:
  - Email: pm@recon-project.com
  - Password: password123

- **Team Member**:
  - Email: team@recon-project.com
  - Password: password123

## Deployment

### Docker Deployment

1. Build and push Docker images:
   ```bash
   docker-compose build
   docker tag recon-frontend:latest yourusername/recon-frontend:latest
   docker tag recon-backend:latest yourusername/recon-backend:latest
   docker push yourusername/recon-frontend:latest
   docker push yourusername/recon-backend:latest
   ```

2. Deploy using Docker Compose on your server:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Frontend Deployment (Netlify)

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Environment variables: Add your Supabase URL and key

3. Deploy:
   - Automatic deployment will occur on push to the main branch
   - Manual deployment can be triggered from the Netlify dashboard

### Backend Deployment (Supabase)

1. Create a new project on Supabase
2. Apply migrations:
   ```bash
   cd supabase
   supabase link --project-ref your-project-ref
   supabase db push
   ```

3. Update your frontend environment variables with the production Supabase URL and key

## Development

### GitHub Integration

The project is set up with GitHub for version control and CI/CD:

- **Main Branch**: Production-ready code
- **Development Branch**: Active development
- **Feature Branches**: Created for new features
- **Pull Requests**: Required for merging into development and main

### Netlify Integration

Netlify is configured for continuous deployment:

- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Custom domain configuration
- Environment variable management

### Supabase Integration

Supabase provides the backend infrastructure:

- Authentication and user management
- PostgreSQL database with Row Level Security
- Real-time subscriptions for live updates
- Storage for document management

## Documentation

For more detailed information, see the following documents:

- [Project Document](./PROJECT_DOCUMENT.md): Comprehensive project overview
- [TODO List](./TODO.md): Current development tasks and roadmap

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by ProCore construction management software
- Built with Supabase, React, and TypeScript 