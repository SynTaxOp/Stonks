# Deployment Guide

This guide provides instructions for deploying the Stonks application to various platforms.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for cloud deployment)
- Java 21 runtime environment (for backend)
- Node.js 16+ (for frontend builds)

## Backend Deployment

### Option 1: Standalone JAR Deployment

1. **Build the JAR file:**
   ```bash
   mvn clean package -DskipTests
   ```

2. **The JAR will be created at:**
   ```
   target/stocks-api-0.0.1-SNAPSHOT.jar
   ```

3. **Run the JAR:**
   ```bash
   java -jar target/stocks-api-0.0.1-SNAPSHOT.jar
   ```

4. **Configure environment variables:**
   - Set `SPRING_DATA_MONGODB_URI` with your MongoDB connection string
   - Set `SERVER_PORT` if you need a different port (default: 8080)

### Option 2: Spring Boot Cloud Platforms

#### Heroku
1. Create a `Procfile` in the root directory:
   ```
   web: java -jar target/stocks-api-0.0.1-SNAPSHOT.jar
   ```

2. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set SPRING_DATA_MONGODB_URI=your-mongodb-uri
   git push heroku main
   ```

#### AWS Elastic Beanstalk
1. Build the JAR file
2. Create an Elastic Beanstalk application
3. Upload the JAR file
4. Configure environment variables for MongoDB URI

#### Google Cloud Platform
1. Build container or use Cloud Run
2. Set environment variables
3. Deploy to Cloud Run

## Frontend Deployment

### Option 1: Static Hosting (Recommended)

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `build/` folder to:**
   - **Netlify**: Drag and drop `build/` folder or connect GitHub repo
   - **Vercel**: Connect GitHub repo or deploy `build/` folder
   - **AWS S3 + CloudFront**: Upload `build/` contents to S3 bucket
   - **GitHub Pages**: Copy `build/` contents to `gh-pages` branch

3. **Configure environment variables:**
   - Set `REACT_APP_API_URL` to your backend API URL
   - For Netlify/Vercel, set in platform dashboard
   - For S3, you may need to rebuild with correct API URL

### Option 2: Server Deployment

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve with a web server:**
   - Copy `build/` folder to your web server (Nginx, Apache, etc.)
   - Configure reverse proxy to backend API

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Environment Variables

### Backend Environment Variables
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string (required)
- `SERVER_PORT` - Server port (default: 8080)
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (default: *)

### Frontend Environment Variables
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)

## Production Checklist

- [ ] MongoDB connection string configured
- [ ] CORS origins restricted to your domain
- [ ] Environment variables set securely
- [ ] SSL/TLS certificates configured
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Database backups configured
- [ ] Frontend API URL points to production backend
- [ ] Remove console.log statements from production build
- [ ] Test all critical flows in production environment

## Security Considerations

1. **Never commit sensitive data:**
   - MongoDB connection strings
   - API keys
   - Environment-specific configurations

2. **Use environment variables** for all sensitive configuration

3. **Restrict CORS** to specific domains in production

4. **Enable HTTPS** for all production deployments

5. **Implement rate limiting** on API endpoints

6. **Set up proper authentication** and authorization

## Monitoring

Consider setting up:
- Application performance monitoring (APM)
- Error tracking (Sentry, Rollbar)
- Log aggregation (Loggly, Papertrail)
- Uptime monitoring (Pingdom, UptimeRobot)

## Rollback Plan

1. Keep previous deployment artifacts
2. Have database backup strategy
3. Document rollback procedure
4. Test rollback in staging environment

## Support

For deployment issues, check:
- Backend logs: `backend.log` or application logs
- Frontend build output
- Browser console for frontend errors
- Network tab for API call issues

