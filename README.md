# NEESH - Magazine Marketplace Monorepo

A full-stack magazine marketplace application with React frontend and Node.js backend.

## Project Structure

```
neesh-monorepo/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── package.json       # Root package.json for monorepo scripts
└── README.md         # This file
```

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 3000) and backend (port 5000) concurrently.

3. **Build for production:**
   ```bash
   npm run build
   ```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure your environment variables.

## Deployment

The application is configured for deployment on platforms like Heroku, Vercel, or Railway.

### Frontend Deployment
- Build output: `frontend/dist`
- Environment variables: Set `VITE_API_URL` to your backend URL

### Backend Deployment
- Entry point: `backend/server.js`
- Environment variables: Configure all variables from `.env.example`

## API Documentation

The backend API is available at `/api` with the following endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/publisher/magazines` - Get publisher magazines
- `GET /api/retailer/inventory` - Get retailer inventory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
