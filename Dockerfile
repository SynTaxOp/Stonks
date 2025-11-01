# Multi-stage build for Stonks Application
# Builds both Backend and Frontend separately

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
# For production, frontend will use /api/ which nginx proxies to backend
ARG REACT_APP_API_URL=
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build frontend for production
RUN npm run build

# ============================================
# Stage 3: Backend Runtime
# ============================================
FROM eclipse-temurin:21-jre-alpine AS backend-runtime

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy the backend JAR
COPY --from=backend-build /app/target/stocks-api-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run Spring Boot application (backend only, no frontend)
ENTRYPOINT ["java", "-jar", "app.jar"]

# ============================================
# Stage 4: Frontend Runtime (Nginx)
# ============================================
FROM nginx:alpine AS frontend-runtime

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
