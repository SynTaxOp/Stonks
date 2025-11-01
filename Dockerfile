# Single-Container Dockerfile
# Builds Backend + Frontend, runs both in one container

# ============================================
# Stage 1: Backend Build
# ============================================
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY src ./src

# Build the backend JAR
RUN mvn clean package -DskipTests

# ============================================
# Stage 2: Frontend Build
# ============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build argument for API URL (use relative path since nginx will proxy)
ARG REACT_APP_API_URL=
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build frontend for production
RUN npm run build

# ============================================
# Stage 3: Final Runtime (Backend + Nginx)
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Install Nginx and curl for health checks
RUN apk add --no-cache nginx curl bash

WORKDIR /app

# Copy backend JAR
COPY --from=backend-build /app/target/stocks-api-0.0.1-SNAPSHOT.jar app.jar

# Copy frontend build
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Create nginx directories
RUN mkdir -p /var/log/nginx /var/lib/nginx /run/nginx

# Expose ports
EXPOSE 8080 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:80/health && curl -f http://localhost:8080/api/health || exit 1

# Start backend and nginx via startup script
CMD ["/start.sh"]
