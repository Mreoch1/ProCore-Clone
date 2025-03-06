# ProCore Clone

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
│   └── package.json        # Frontend dependencies
└── supabase/               # Supabase configuration
    ├── migrations/         # Database migrations
    ├── seed.sql            # Seed data
    └── config.toml         # Supabase configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/procore-clone.git
   cd procore-clone
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the `frontend` directory
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the Supabase local development environment:
   ```bash
   cd ../supabase
   supabase start
   ```

5. Apply database migrations and seed data:
   ```bash
   supabase db reset
   ```

6. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

For testing purposes, you can use the following credentials:

- **Admin User**:
  - Email: john.smith@example.com
  - Password: password123

- **Project Manager**:
  - Email: sarah.johnson@example.com
  - Password: password123

- **Team Member**:
  - Email: michael.brown@example.com
  - Password: password123

## Deployment

### Frontend Deployment (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set the build command to `cd frontend && npm run build`
4. Set the publish directory to `frontend/dist`
5. Add the environment variables in the Netlify dashboard

### Backend Deployment (Supabase)

1. Create a new project on Supabase
2. Link your local Supabase project to the remote project
3. Push your migrations to the remote project
4. Update your frontend environment variables with the production Supabase URL and anon key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by ProCore construction management software
- Built with Supabase, React, and TypeScript 