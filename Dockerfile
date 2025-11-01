# Multi-stage build for Stonks Application (Backend + Frontend in Single Container)
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY src ./src

# Build the backend JAR (but don't package yet - we'll add frontend first)
RUN mvn clean package -DskipTests

# Frontend build stage
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build frontend for production
RUN npm run build

# Final assembly stage - combine backend and frontend
FROM maven:3.9-eclipse-temurin-21 AS assembly

WORKDIR /app

# Copy backend source (we'll rebuild with frontend)
COPY pom.xml .
COPY src ./src

# Copy built frontend to Spring Boot static resources
COPY --from=frontend-build /app/build ./src/main/resources/static

# Rebuild JAR with frontend included
RUN mvn clean package -DskipTests

# Final runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy the final JAR with both backend and frontend
COPY --from=assembly /app/target/stocks-api-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run Spring Boot application
# Backend serves API at /api/* and frontend at /* 
ENTRYPOINT ["java", "-jar", "app.jar"]

