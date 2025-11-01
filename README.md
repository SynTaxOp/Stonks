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

The easiest and most consistent way to run the entire application:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Stonks

# 2. Create .env file with your MongoDB URI
cp .env.example .env
# Edit .env and add your MongoDB connection string:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...

# 3. Build Docker images
docker build -f Dockerfile.backend -t stonks-backend .
docker build -f Dockerfile.frontend -t stonks-frontend .

# 4. Create Docker network
docker network create stonks-network

# 5. Start backend container
docker run -d --name stonks-backend \
  --network stonks-network \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI="your-mongodb-uri" \
  stonks-backend

# 6. Start frontend container
docker run -d --name stonks-frontend \
  --network stonks-network \
  -p 80:80 \
  stonks-frontend

# 7. Access the application
# Frontend: http://localhost
# Backend: http://localhost:8080
```

**Using Docker Compose (if available):**

```bash
# Build and start all services with one command
docker-compose up -d

# Or for development mode with hot-reload
docker-compose -f docker-compose.dev.yml up
```

**Docker Commands:**

```bash
# View logs
docker logs -f stonks-backend
docker logs -f stonks-frontend

# Stop containers
docker stop stonks-backend stonks-frontend

# Restart containers
docker restart stonks-backend stonks-frontend

# Remove containers
docker rm stonks-backend stonks-frontend

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
├── Dockerfile.backend           # Backend Docker image
├── Dockerfile.frontend          # Frontend Docker image
├── docker-compose.yml           # Production Docker Compose
├── docker-compose.dev.yml       # Development Docker Compose
├── nginx.conf                   # Nginx configuration
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
# Build images
docker build -f Dockerfile.backend -t stonks-backend .
docker build -f Dockerfile.frontend -t stonks-frontend .

# Or using docker-compose
docker-compose build

# Run containers
docker-compose up -d

# Verify
docker ps
curl http://localhost:8080/api/health
```

**Production Optimizations:**
- Multi-stage builds reduce image size
- Backend: ~150MB (Alpine JRE)
- Frontend: ~25MB (Nginx Alpine)
- Health checks enabled
- Automatic restart on failure

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

**1. Build and Tag Images:**
```bash
docker build -f Dockerfile.backend -t your-registry/stonks-backend:latest .
docker build -f Dockerfile.frontend -t your-registry/stonks-frontend:latest .
```

**2. Push to Registry:**
```bash
docker push your-registry/stonks-backend:latest
docker push your-registry/stonks-frontend:latest
```

**3. Deploy to Cloud:**

- **AWS ECS/EC2**: Use docker-compose or ECS task definitions
- **Google Cloud Run**: Deploy containers using gcloud CLI
- **Azure Container Instances**: Use Azure CLI or portal
- **Heroku**: Use Container Registry
- **DigitalOcean**: Use App Platform or Droplets with Docker

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

