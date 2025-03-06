# Recon Project Management System

A comprehensive project management system for construction and engineering teams.

## Project Structure

This project is organized into two main directories:

- `frontend/`: Contains the React application built with Vite, TypeScript, and Supabase
- `backend/`: Contains the Express.js API server (deployed separately)

## Deployment Instructions

### Netlify Deployment

The frontend of this application is configured to be deployed on Netlify. Follow these steps to deploy:

1. Push your code to a GitHub repository
2. Log in to Netlify and create a new site from Git
3. Select your repository
4. Netlify will automatically detect the build settings from the `netlify.toml` file
5. Add the following environment variables in the Netlify UI:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_API_URL`: The URL of your backend API (if using a separate backend)

### Environment Variables

The application uses the following environment variables:

#### Frontend (Vite)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_API_URL`: The URL of your backend API

#### Backend (Express)
- `JWT_SECRET`: Secret key for JWT token generation
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key
- `FRONTEND_URL`: URL of the frontend application (for CORS)

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Features

- User authentication with Supabase
- Project management
- Task tracking
- Document management
- Team collaboration
- Real-time updates
- Responsive design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact us at support@recon-project.com. 