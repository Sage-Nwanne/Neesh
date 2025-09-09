# NEESH Deployment Guide

## Overview

NEESH is configured for deployment across multiple platforms with the following architecture:
- **Frontend**: React/Vite application (Netlify, Vercel, or Firebase Hosting)
- **Backend**: Node.js/Express API (Vercel, Railway, or Heroku)
- **Database**: Supabase (already hosted)
- **Analytics**: Google Analytics (configured)

## Quick Deploy Options

### Option 1: Netlify + Vercel (Recommended)
- **Frontend**: Netlify (configured)
- **Backend**: Vercel (configured)
- **Best for**: Production deployments with custom domains

### Option 2: Firebase Hosting + Cloud Functions
- **Frontend**: Firebase Hosting (configured)
- **Backend**: Firebase Cloud Functions
- **Best for**: Google Cloud ecosystem integration

### Option 3: Vercel Full-Stack
- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions
- **Best for**: Unified deployment platform

## Pre-Deployment Checklist

### 1. Environment Variables Setup

**Frontend (.env.production):**
```bash
VITE_GA_TRACKING_ID=G-B3SXLCTCZ9
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
VITE_SUPABASE_URL=https://smfzrubkyxejzkblrrjr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w
VITE_ENABLE_ANALYTICS=true
VITE_NODE_ENV=production
```

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.netlify.app
SUPABASE_URL=https://smfzrubkyxejzkblrrjr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret-key
RESEND_API_KEY=your-resend-api-key
```

### 2. Build Test
```bash
# Test frontend build
npm run build:frontend

# Test backend (if applicable)
npm run build:backend
```

## Deployment Instructions

### Option 1: Netlify + Vercel Deployment

#### Step 1: Deploy Backend to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Backend:**
```bash
cd backend
vercel --prod
```

3. **Set Environment Variables in Vercel:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all backend environment variables

#### Step 2: Deploy Frontend to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy:**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

3. **Set Environment Variables in Netlify:**
- Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
- Add all frontend environment variables

### Option 2: Firebase Deployment

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase (if not done):**
```bash
firebase init
```

3. **Deploy:**
```bash
npm run build:frontend
firebase deploy
```

### Option 3: One-Click Deployments

#### Deploy to Netlify (Frontend)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/neesh)

#### Deploy to Vercel (Full-Stack)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/neesh)

## Post-Deployment Configuration

### 1. Update CORS Settings
Update backend CORS configuration with your frontend domain:

```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

### 2. Update Supabase Settings
- Add your production domains to Supabase Auth settings
- Update redirect URLs for authentication

### 3. Configure Custom Domains (Optional)
- Set up custom domain in Netlify/Vercel
- Update environment variables with new domain
- Update Google Analytics settings

### 4. SSL/HTTPS Configuration
- Both Netlify and Vercel provide automatic SSL
- Ensure all API calls use HTTPS in production

## Monitoring and Maintenance

### 1. Analytics Setup
- Verify Google Analytics is tracking correctly
- Set up conversion goals
- Monitor key metrics

### 2. Error Monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor API response times
- Set up uptime monitoring

### 3. Performance Optimization
- Enable CDN for static assets
- Optimize images and fonts
- Monitor Core Web Vitals

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check backend CORS configuration
   - Verify frontend domain is whitelisted

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable naming (VITE_ prefix for frontend)

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **API Connection Issues:**
   - Verify backend URL in frontend config
   - Check network/firewall settings

### Debug Commands:
```bash
# Check build output
npm run build:frontend

# Test production build locally
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## Security Considerations

1. **Environment Variables:**
   - Never commit .env files
   - Use different keys for production
   - Rotate API keys regularly

2. **HTTPS Only:**
   - Force HTTPS redirects
   - Use secure cookies
   - Enable HSTS headers

3. **API Security:**
   - Implement rate limiting
   - Validate all inputs
   - Use proper authentication

## Backup and Recovery

1. **Database Backups:**
   - Supabase provides automatic backups
   - Set up additional backup strategies if needed

2. **Code Backups:**
   - Ensure code is in version control
   - Tag releases for easy rollback

3. **Environment Backups:**
   - Document all environment variables
   - Keep secure backup of configuration

## Performance Monitoring

- **Frontend**: Use Lighthouse, Web Vitals
- **Backend**: Monitor API response times
- **Database**: Monitor Supabase performance metrics
- **Analytics**: Track user engagement and conversions
