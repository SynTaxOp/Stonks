#!/bin/bash

# Stonks Frontend Startup Script

echo "🚀 Starting Stonks Frontend Development Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any existing processes on port 3000
echo "🔄 Checking for existing processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Found existing process on port 3000. Stopping it..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
    echo "✅ Port 3000 is now free"
else
    echo "✅ Port 3000 is available"
fi

# Kill any existing React development servers
echo "🔄 Checking for existing React development servers..."
pkill -f "react-scripts start" 2>/dev/null || true
sleep 1

# Set environment variables
export REACT_APP_API_URL=http://localhost:8081

echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔗 Backend API URL: $REACT_APP_API_URL"
echo ""

# Start the development server
echo "🚀 Starting React development server..."
npm start
