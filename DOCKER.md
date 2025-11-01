# Docker Setup Guide

This guide explains how to build and run the Stonks application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Production Build

Build and run the entire application (frontend + backend in single container):

```bash
# Build the image
docker build -t stonks-app .

# Or using docker-compose
docker-compose up -d
```

Access the application:
- **Frontend & Backend**: http://localhost:8080
- **API**: http://localhost:8080/api/*

### Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Environment Variables

Copy the example environment file and customize:

```bash
cp .env.example .env
```

Edit `.env` file to customize configuration:

```env
# MongoDB Connection String (required)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Backend Port (default: 8080)
SERVER_PORT=8080

# CORS Origins (default: *)
CORS_ALLOWED_ORIGINS=*
```

## Single Container Architecture

The application uses a **single Dockerfile** that:
1. Builds the React frontend
2. Embeds it into Spring Boot static resources
3. Packages everything into a single JAR
4. Runs in one container

### Manual Build and Run

```bash
# Build the image
docker build -t stonks-app .

# Run the container
docker run -d --name stonks-app \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=your-mongodb-uri \
  stonks-app
```

## Docker Compose Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# View application logs
docker-compose logs -f

# Or directly
docker logs -f stonks-app
```

### Rebuild Images
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Stop and Remove Containers
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

## Production Deployment

### Build and Push Images

1. **Build images:**
   ```bash
   docker-compose build
   ```

2. **Tag for registry:**
   ```bash
   docker tag stonks-backend:latest your-registry/stonks-backend:latest
   docker tag stonks-frontend:latest your-registry/stonks-frontend:latest
   ```

3. **Push to registry:**
   ```bash
   docker push your-registry/stonks-backend:latest
   docker push your-registry/stonks-frontend:latest
   ```

### Deploy with Docker Compose

1. Update `docker-compose.yml` to use your registry images:
   ```yaml
   services:
     backend:
       image: your-registry/stonks-backend:latest
       # ... rest of config
   
     frontend:
       image: your-registry/stonks-frontend:latest
       # ... rest of config
   ```

2. Deploy:
   ```bash
   docker-compose up -d
   ```

## Troubleshooting

### Container won't start
- Check MongoDB connection string
- Verify port 8080 is not in use: `lsof -i:8080`
- Check logs: `docker logs stonks-app`
- Verify Docker has enough resources

### Frontend not loading
- Check if static files are in JAR: `docker exec stonks-app jar -tf app.jar | grep static`
- Verify WebConfig is loaded: `docker logs stonks-app | grep -i WebConfig`
- Test directly: `curl http://localhost:8080`

### API requests failing
- Test health endpoint: `curl http://localhost:8080/api/health`
- Check CORS configuration
- Verify MongoDB connection in logs

### Build failures
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`
- Check disk space: `docker system df`

### MongoDB connection issues
- Verify MongoDB URI is correct
- Check network connectivity from container
- Ensure MongoDB allows connections from your IP/Docker network

## Health Checks

The container includes health checks:

- **Health Endpoint**: `http://localhost:8080/api/health`

Check health status:
```bash
docker ps
# Or
docker-compose ps
```

View health details:
```bash
docker inspect stonks-app | grep Health -A 10
```

## Volumes (Development)

The development compose file (`docker-compose.dev.yml`) includes volumes for:
- Backend source code hot-reload
- Frontend source code hot-reload

Note: Production builds do not use volumes.

## Ports

Default port:
- **Application**: 8080 (serves both frontend and backend API)

To change port, update `docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "3000:8080"  # Map host port 3000 to container port 8080
```

Or use environment variable:
```bash
docker run -p 3000:8080 -e SERVER_PORT=8080 stonks-app
```

## Security Notes

1. **Never commit `.env` files** with sensitive data
2. **Use secrets management** for production (Docker Secrets, Kubernetes Secrets, etc.)
3. **Update CORS origins** to specific domains in production
4. **Use HTTPS** in production (add reverse proxy like Traefik or Nginx with SSL)

## Multi-Architecture Builds

Build for multiple platforms:

```bash
# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t stonks-app:latest .
```

## Clean Up

Remove all containers, networks, and volumes:
```bash
docker-compose down -v
docker system prune -a
```

Remove only stopped containers:
```bash
docker-compose down
```

---

For more Docker commands, see: https://docs.docker.com/compose/

