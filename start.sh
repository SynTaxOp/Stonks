#!/bin/bash

echo "🚀 Starting Stonks Application..."

# Kill existing processes
echo "🔄 Stopping existing processes..."
kill -9 $(lsof -t -i:8080) 2>/dev/null || true
kill -9 $(lsof -t -i:3000) 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true
sleep 2

# Start Backend
echo "🔧 Starting Backend (Spring Boot)..."
echo "📦 Building backend..."
mvn clean install -DskipTests

# Start backend in background
if [ -f ".mvn/wrapper/maven-wrapper.properties" ]; then
  ./mvnw spring-boot:run > backend.log 2>&1 &
else
  mvn spring-boot:run > backend.log 2>&1 &
fi
BACKEND_PID=$!

echo "⏳ Waiting for backend to start on port 8080..."
# Wait for backend to be ready (check port 8080)
for i in {1..60}; do
  if lsof -ti:8080 > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    sleep 2
    break
  fi
  if [ $i -eq 60 ]; then
    echo "⚠️  Backend may not have started properly. Check backend.log for details."
  fi
  sleep 1
done

# Start Frontend
echo "🌐 Starting Frontend (React)..."
cd frontend

# Check if node_modules exists, install if not
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Set environment variables
export REACT_APP_API_URL=http://localhost:8080

echo "🚀 Starting React development server..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔗 Backend API URL: http://localhost:8080"
echo ""
echo "✅ Both services are starting..."
echo "📋 Backend logs: backend.log"
echo "💡 Press Ctrl+C to stop both services"

# Start frontend (this will run in foreground)
npm start