#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process for ProCore Clone"

# Build backend
echo "📦 Building backend..."
cd backend
npm ci
npm run build
echo "✅ Backend build complete"

# Build frontend
echo "📦 Building frontend..."
cd ../frontend
npm ci
npm run build
echo "✅ Frontend build complete"

# Deploy backend (example for Heroku)
echo "🚀 Deploying backend to Heroku..."
cd ../backend
# Uncomment and customize these lines for your actual deployment
# git add .
# git commit -m "Deploy backend"
# git push heroku main
echo "✅ Backend deployment complete"

# Deploy frontend (example for Netlify)
echo "🚀 Deploying frontend to Netlify..."
cd ../frontend
# Uncomment and customize these lines for your actual deployment
# netlify deploy --prod
echo "✅ Frontend deployment complete"

echo "🎉 Deployment completed successfully!" 