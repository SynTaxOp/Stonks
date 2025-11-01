#!/bin/bash

# Stonks Frontend Status Check Script

echo "🔍 Checking Stonks Frontend Status..."
echo ""

# Check if React server is running
if pgrep -f "react-scripts start" > /dev/null; then
    echo "✅ React development server is running"
else
    echo "❌ React development server is not running"
fi

# Check if port 3000 is accessible
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible at http://localhost:3000"
else
    echo "❌ Frontend is not accessible at http://localhost:3000"
fi

# Check if backend is running
if curl -s http://localhost:8081/api/dashboard > /dev/null 2>&1; then
    echo "✅ Backend API is accessible at http://localhost:8081"
else
    echo "⚠️  Backend API is not accessible at http://localhost:8081"
fi

echo ""
echo "🌐 Frontend URL: http://localhost:3000"
echo "🔗 Backend URL: http://localhost:8081"
