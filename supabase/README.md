# Supabase Setup for ProCore Clone

This directory contains the Supabase configuration for the ProCore Clone application. Supabase is used for authentication, database, and storage functionality.

## Directory Structure

- `migrations/`: Contains SQL migration files for database schema
- `seed.sql`: Contains seed data for initial database setup
- `config.toml`: Supabase configuration file

## Getting Started with Supabase

### Local Development

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start the local Supabase development environment:
   ```bash
   supabase start
   ```

3. Apply migrations:
   ```bash
   supabase db reset
   ```
   This will apply all migrations and seed data.

4. Access the Supabase Studio:
   ```
   http://localhost:54323
   ```

### Environment Variables

Make sure to set up the following environment variables in your frontend application:

```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

You can find your anon key in the Supabase Studio under Project Settings > API.

## Database Schema

The database schema includes the following tables:

- `team_members`: User profiles and team members
- `projects`: Construction projects
- `tasks`: Project tasks
- `documents`: Project documents
- `budget_items`: Project budget items

## Authentication

Supabase Auth is used for user authentication. The application supports:

- Email/password authentication
- Row-level security (RLS) policies for data access control

## Storage

Supabase Storage is used for document storage. The application uses the following buckets:

- `documents`: For storing project documents

## Deployment

To deploy to a production Supabase instance:

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)

2. Link your local project to the remote project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Push your migrations to the remote project:
   ```bash
   supabase db push
   ```

4. Update your environment variables with the production Supabase URL and anon key.

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase CLI Reference](https://supabase.io/docs/reference/cli)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/) 