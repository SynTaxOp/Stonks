# Stonks - Investment Portfolio Tracking Platform

A comprehensive full-stack application for tracking and managing mutual fund investments with real-time performance analytics, SIP management, and portfolio insights.

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
- **Port**: 8081

### Frontend (React)
- **Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React
- **Port**: 3000

## 📋 Prerequisites

- **Java 21** or higher
- **Maven 3.6+** (or use included Maven Wrapper)
- **Node.js 16+** and npm
- **MongoDB** (MongoDB Atlas account or local instance)

## 🛠️ Installation

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

The backend will start on `http://localhost:8081`

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
├── pom.xml                      # Maven configuration
├── start.sh                     # Startup script
└── README.md                    # This file
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

### Backend
Create or update `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=your-mongodb-connection-string
server.port=8081
cors.allowed.origins=*
```

### Frontend
Create `.env` file in `frontend/` directory:
```env
REACT_APP_API_URL=http://localhost:8081
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

### Backend
```bash
mvn clean package
java -jar target/stocks-api-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```
The production build will be in `frontend/build/`

## 🚢 Deployment

### Backend Deployment
- Build the JAR file: `mvn clean package`
- Deploy to your preferred platform (AWS, Heroku, etc.)
- Ensure MongoDB connection string is configured
- Set appropriate CORS origins for production

### Frontend Deployment
- Build the production bundle: `npm run build`
- Deploy `build/` folder to static hosting (Netlify, Vercel, AWS S3, etc.)
- Update API URL in environment variables



Made with ❤️ for better investment tracking

