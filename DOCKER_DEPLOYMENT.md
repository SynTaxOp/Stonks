# Docker Deployment Guide

This guide explains how to deploy Stonks using Docker, where the frontend and backend are built from a single Dockerfile but run as separate services.

## Architecture Overview

- **Single Dockerfile**: Builds both backend (Spring Boot) and frontend (React + Nginx)
- **Two Services**: Backend and Frontend run as separate containers
- **Nginx Proxy**: Frontend serves the React app and proxies `/api/*` requests to the backend
- **Network**: Services communicate via Docker network

## Quick Start

```bash
# 1. Build and start both services
docker-compose up -d --build

# 2. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080/api/*
```

## Dockerfile Structure

The Dockerfile uses multi-stage builds with 4 stages:

1. **backend-build**: Builds the Spring Boot JAR
2. **frontend-build**: Builds the React production bundle
3. **backend-runtime**: Final backend image with JAR
4. **frontend-runtime**: Final frontend image with Nginx serving React build

## Services

### Backend Service (Spring Boot)

- **Container**: `stonks-backend`
- **Port**: `8080`
- **Image**: Built from `backend-runtime` stage
- **Health Check**: `/api/health`
- **Dependencies**: MongoDB (via environment variable)

### Frontend Service (Nginx + React)

- **Container**: `stonks-frontend`
- **Port**: `80`
- **Image**: Built from `frontend-runtime` stage
- **Health Check**: `/health`
- **API Proxy**: All `/api/*` requests are proxied to `backend:8080`

## Environment Variables

Create a `.env` file (optional):

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...

# Server Port (default: 8080)
SERVER_PORT=8080

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=*
```

## How Frontend Calls Backend

1. Frontend React app is served by Nginx at `http://localhost`
2. When frontend makes API calls to `/api/*`, Nginx proxies them to `backend:8080`
3. Backend processes the request and returns response
4. Nginx forwards the response back to the frontend
5. No CORS issues since requests are same-origin from browser's perspective

## API URL Configuration

The frontend is configured to use relative URLs in production:

- **Development**: `http://localhost:8080` (direct backend access)
- **Production (Docker)**: Empty string (uses `/api/` which Nginx proxies)

This is handled in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080');
```

## Building and Running

### Production (docker-compose.yml)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Development (docker-compose.dev.yml)

```bash
# Start with development settings
docker-compose -f docker-compose.dev.yml up --build

# This mounts source code for hot-reload
```

## Building Individual Services

You can also build individual services:

```bash
# Build backend only
docker build --target backend-runtime -t stonks-backend .

# Build frontend only
docker build --target frontend-runtime -t stonks-frontend .

# Run backend
docker run -d --name stonks-backend \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI="your-uri" \
  stonks-backend

# Run frontend (requires backend to be running and accessible)
docker run -d --name stonks-frontend \
  -p 80:80 \
  --link stonks-backend:backend \
  stonks-frontend
```

## Port Configuration

- **Frontend**: Port `80` (change in `docker-compose.yml` if needed)
- **Backend**: Port `8080` (change in `docker-compose.yml` if needed)

To change ports, update `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "9090:8080"  # Host:Container
  frontend:
    ports:
      - "3000:80"    # Host:Container
```

## Health Checks

Both services have health checks:

- **Backend**: Checks `http://localhost:8080/api/health`
- **Frontend**: Checks `http://localhost:80/health`

View health status:

```bash
docker-compose ps
```

## Troubleshooting

### Frontend can't reach backend

1. Ensure both services are running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify network: `docker network inspect stonks_stonks-network`
4. Test backend directly: `curl http://localhost:8080/api/health`

### API requests fail with 502

- Backend might not be ready. Check `docker-compose logs backend`
- Ensure MongoDB connection string is correct
- Verify backend health: `curl http://localhost:8080/api/health`

### Frontend shows blank page

1. Check frontend logs: `docker-compose logs frontend`
2. Verify build succeeded: Check for errors during `docker-compose up --build`
3. Check browser console for JavaScript errors
4. Verify Nginx is running: `docker exec stonks-frontend nginx -t`

### Rebuild after code changes

```bash
# Stop and rebuild
docker-compose down
docker-compose up -d --build

# Or force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production:

1. Update `REACT_APP_API_URL` if needed in `docker-compose.yml`
2. Set proper CORS origins in `.env`
3. Use environment-specific MongoDB URI
4. Configure proper domain names
5. Set up SSL/TLS certificates for HTTPS
6. Use Docker secrets for sensitive data

## Scaling

To scale services:

```bash
# Scale backend (multiple instances)
docker-compose up -d --scale backend=3

# Note: Frontend should point to a load balancer in front of backend instances
```

## Network Configuration

Services communicate via Docker network `stonks-network`:

- Backend accessible at `http://backend:8080` from frontend container
- Frontend accessible at `http://frontend:80` from backend container (if needed)

## Additional Resources

- See `README.md` for general setup
- See `DEPLOYMENT.md` for deployment options
- See `.env.example` for environment variables

