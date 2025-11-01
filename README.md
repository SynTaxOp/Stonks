# Stonks - Investment Portfolio Tracking Platform

A comprehensive full-stack application for tracking and managing mutual fund investments with real-time performance analytics, SIP management, and portfolio insights.

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](DOCKER.md)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?style=flat&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🚀 Features

### Core Features
- **User Authentication** - Secure login and registration system
- **Portfolio Dashboard** - Comprehensive view of all investments
- **Fund Management** - Track multiple mutual funds
- **Transaction Management** - Record and manage buy/sell transactions
- **SIP Management** - Register and track Systematic Investment Plans
- **Performance Analytics** - Real-time performance metrics and charts
- **XIRR Calculation** - Internal Rate of Return calculations
- **NAV History** - Historical Net Asset Value tracking
- **Today's P&L** - Daily profit/loss tracking
- **Realized Profits** - Track short-term and long-term capital gains

### Advanced Features
- **Bulk Transactions** - Add multiple transactions at once
- **Fund Search** - Search and add funds from a comprehensive database
- **Performance Graphs** - Visual representation of investment performance
- **Portfolio Summary** - Aggregated view of all investments
- **User Profile Management** - Update profile and change password
- **Delete Operations** - Remove funds and transactions with confirmation dialogs

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.6
- **Java Version**: 21
- **Database**: MongoDB (MongoDB Atlas)
- **API**: RESTful API
- **Port**: 8080

### Frontend (React)
- **Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React
- **Port**: 3000

## 📋 Prerequisites

### For Docker Deployment
- **Docker Engine 20.10+** (or Docker Desktop)
- **Docker Compose 2.0+** (optional, for docker-compose commands)
- **MongoDB** (MongoDB Atlas account or local instance)

### For Manual Installation
- **Java 21** or higher
- **Maven 3.6+** (or use included Maven Wrapper)
- **Node.js 16+** and npm
- **MongoDB** (MongoDB Atlas account or local instance)

## 🛠️ Installation

### Option 1: Docker (Recommended) 🐳

The easiest and most consistent way to run the entire application using a single Dockerfile that builds both frontend and backend separately, then runs them as connected services:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Stonks

# 2. Create .env file with your MongoDB URI (optional)
cp .env.example .env
# Edit .env and add your MongoDB connection string if needed:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...

# 3. Build and start with Docker Compose (Recommended)
docker-compose up -d --build

# This will:
# - Build backend (Spring Boot) on port 8080
# - Build frontend (React + Nginx) on port 80
# - Frontend automatically proxies /api/* requests to backend

# 4. Access the application
# Frontend: http://localhost (or http://localhost:80)
# Backend API: http://localhost:8080/api/*
# All API calls from frontend are automatically proxied to backend
```

**Alternative: Build individual services:**

```bash
# Build backend only
docker build --target backend-runtime -t stonks-backend .

# Build frontend only  
docker build --target frontend-runtime -t stonks-frontend .

# Run separately (using Docker Compose is easier)
```

**For Development with hot-reload:**

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Docker Commands:**

```bash
# View logs
docker logs -f stonks-app

# Stop container
docker stop stonks-app

# Restart container
docker restart stonks-app

# Remove container
docker rm stonks-app

# View container status
docker ps | grep stonks
```

For detailed Docker instructions, troubleshooting, and production deployment, see [DOCKER.md](DOCKER.md).

### Option 2: Manual Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Stonks
```

### 2. Backend Setup

#### Configure MongoDB
Update `src/main/resources/application.properties` with your MongoDB connection string:
```properties
spring.data.mongodb.uri=your-mongodb-connection-string
```

#### Build and Run Backend
```bash
# Option 1: Using Maven Wrapper
./mvnw clean install
./mvnw spring-boot:run

# Option 2: Using Maven (if installed)
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Quick Start (Both Services)

Use the provided startup script to start both backend and frontend:
```bash
chmod +x start.sh
./start.sh
```

This script will:
- Build the backend
- Start the backend server
- Wait for backend to be ready
- Start the frontend development server

## 📁 Project Structure

```
Stonks/
├── src/                          # Backend source code
│   └── main/
│       ├── java/com/stonks/
│       │   ├── api/             # API controllers
│       │   ├── config/          # Configuration classes
│       │   ├── controller/       # REST controllers
│       │   ├── dto/              # Data Transfer Objects
│       │   ├── exception/        # Exception handlers
│       │   ├── model/            # Entity models
│       │   ├── repository/       # MongoDB repositories
│       │   ├── service/          # Business logic
│       │   └── util/             # Utility classes
│       └── resources/
│           └── application.properties
├── frontend/                     # React frontend
│   └── src/
│       ├── components/           # React components
│       │   ├── Auth/            # Authentication components
│       │   ├── Dashboard/       # Dashboard components
│       │   ├── common/          # Reusable components
│       │   └── ...
│       ├── contexts/            # React contexts
│       ├── services/            # API services
│       └── types/               # TypeScript types
├── Dockerfile                    # Single Dockerfile (backend + frontend)
├── docker-compose.yml           # Production Docker Compose
├── docker-compose.dev.yml       # Development Docker Compose
├── .dockerignore                # Docker ignore rules
├── .env.example                 # Environment variables template
├── pom.xml                      # Maven configuration
├── start.sh                     # Manual startup script
├── README.md                    # This file
├── DOCKER.md                    # Docker deployment guide
├── DEPLOYMENT.md                # Deployment instructions
└── QUICK_START.md               # Quick start guide
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users` - User registration
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Dashboard
- `GET /api/dashboard?userId={id}` - Get dashboard data
- `GET /api/dashboard/searchFund?searchText={text}` - Search funds

### User Funds
- `GET /api/userFund?userId={id}&fundId={fundId}` - Get fund details
- `POST /api/userFund` - Add user fund
- `DELETE /api/userFund?userId={id}&fundId={fundId}` - Delete fund

### Transactions
- `POST /api/transactions` - Add transaction
- `GET /api/transactions?userId={id}&fundId={fundId}` - Get transactions
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### SIPs
- `POST /api/sip` - Register SIP
- `GET /api/sip?userId={id}` - Get SIPs
- `PUT /api/sip/{id}` - Update SIP
- `DELETE /api/sip/{id}` - Delete SIP

## 🔐 Environment Variables

### Docker Deployment

Copy the example file and customize:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# MongoDB Connection String (required)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Backend Server Port (default: 8080)
SERVER_PORT=8080

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=*

# Frontend API URL
REACT_APP_API_URL=http://localhost:8080
```

### Manual Installation

#### Backend
Create or update `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=your-mongodb-connection-string
server.port=8080
cors.allowed.origins=*
```

#### Frontend
Create `.env` file in `frontend/` directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

**For Production:**
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

## 🧪 Testing

### Backend
```bash
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Using Docker (Recommended) 🐳

```bash
# Build image (builds both backend and frontend)
docker build -t stonks-app .

# Or using docker-compose
docker-compose build

# Run container
docker-compose up -d

# Verify
docker ps
curl http://localhost:8080/api/health
curl http://localhost:8080
```

**Production Optimizations:**
- Single container with both backend and frontend
- Multi-stage builds reduce image size
- Total size: ~200MB (Alpine JRE + embedded frontend)
- Frontend served from Spring Boot static resources
- Health checks enabled
- Automatic restart on failure
- Single port (8080) for both API and frontend

### Manual Build

#### Backend
```bash
mvn clean package -DskipTests
java -jar target/stocks-api-0.0.1-SNAPSHOT.jar

# With production environment variables
SPRING_DATA_MONGODB_URI=your-prod-uri \
SERVER_PORT=8080 \
java -jar target/stocks-api-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm ci                    # Install dependencies
npm run build            # Build for production
```
The production build will be in `frontend/build/`

**Serving Frontend:**
```bash
# Option 1: Using serve
npx serve -s build -l 3000

# Option 2: Using Nginx (recommended for production)
# Copy build/ contents to Nginx html directory
sudo cp -r build/* /usr/share/nginx/html/
```

## 🚢 Deployment

### Docker Deployment (Recommended)

#### Using Docker Compose

```bash
# Production deployment
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Deploying to Cloud Platforms

**1. Build and Tag Image:**
```bash
docker build -t your-registry/stonks-app:latest .
```

**2. Push to Registry:**
```bash
docker push your-registry/stonks-app:latest
```

**3. Deploy to Cloud:**

- **AWS ECS/EC2**: Use docker-compose or ECS task definitions
- **Google Cloud Run**: Deploy single container using gcloud CLI
- **Azure Container Instances**: Use Azure CLI or portal
- **Heroku**: Use Container Registry
- **DigitalOcean**: Use App Platform or Droplets with Docker
- **Railway**: Connect GitHub repo and deploy
- **Fly.io**: Deploy with flyctl CLI

**4. Environment Variables:**
```bash
# Set environment variables for production
export MONGODB_URI=your-production-mongodb-uri
export CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Traditional Deployment

#### Backend Deployment
```bash
# Build the JAR file
mvn clean package

# Run the application
java -jar target/stocks-api-0.0.1-SNAPSHOT.jar

# With environment variables
SPRING_DATA_MONGODB_URI=your-uri java -jar target/stocks-api-0.0.1-SNAPSHOT.jar
```

**Platforms:**
- **AWS Elastic Beanstalk**: Upload JAR file
- **Heroku**: Use Java buildpack
- **Google Cloud Platform**: Use App Engine or Cloud Run
- **Azure**: Use App Service for Java

#### Frontend Deployment
```bash
# Build the production bundle
cd frontend
npm run build

# Deploy build/ folder to:
# - Netlify: Drag and drop or connect Git repo
# - Vercel: Connect Git repo or use CLI
# - AWS S3 + CloudFront: Upload to S3 bucket
# - GitHub Pages: Copy to gh-pages branch
# - Nginx/Apache: Copy to web root
```

**Update API URL for Production:**
- Create `.env.production` file:
```env
REACT_APP_API_URL=https://api.yourdomain.com
```
- Rebuild with: `npm run build`

## 📊 Monitoring & Logs

### Docker Containers

```bash
# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check container resource usage
docker stats

# View container health status
docker-compose ps
```

### Application Logs

**Backend:**
- Logs are output to stdout (captured by Docker)
- View with: `docker logs -f stonks-backend`

**Frontend:**
- Nginx access logs: Available in container
- View with: `docker logs -f stonks-frontend`



Made with ❤️ for better investment tracking

