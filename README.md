# ProCore - Project Management Application

ProCore is a modern, full-stack project management application designed to help teams collaborate effectively, track tasks, and manage projects efficiently. Built with React, TypeScript, and Supabase, it provides a robust platform for project planning, task tracking, and team collaboration.

## Features

- **User Authentication**: Secure login, registration, and password reset functionality
- **Dashboard**: Customizable dashboard with project statistics and recent activities
- **Project Management**: Create, edit, and track projects with detailed information
- **Task Management**: Comprehensive task tracking with filtering, sorting, and search capabilities
- **Team Collaboration**: Assign tasks to team members and track progress
- **Document Management**: Upload and manage project-related documents
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - React Router
  - CSS Modules
  - Supabase Client

- **Backend**:
  - Supabase (PostgreSQL database)
  - Supabase Authentication
  - Supabase Storage

- **Deployment**:
  - Netlify (Frontend)
  - Supabase (Backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/procore.git
   cd procore
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the frontend directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Database Setup

1. Create a new project in Supabase
2. Set up the following tables:
   - profiles
   - projects
   - tasks
   - task_comments
   - task_attachments
   - project_members
   - project_documents

Detailed SQL schema is available in the `database/schema.sql` file.

## Deployment

### Frontend Deployment (Netlify)

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard
4. Deploy

### Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Project Structure

```
procore/
├── frontend/                # Frontend application
│   ├── public/              # Public assets
│   │   └── index.html       # HTML template
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS styles
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite configuration
├── database/                # Database scripts
│   └── schema.sql           # SQL schema
├── netlify.toml             # Netlify configuration
├── _redirects               # Netlify redirects
└── README.md                # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)
- [Netlify](https://www.netlify.com/) 