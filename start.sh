#!/bin/bash

# Startup script: Starts Backend → Waits → Starts Nginx

set -e

echo "🚀 Starting Stonks Application..."

# Function to check if backend is ready
check_backend() {
    curl -f http://localhost:8080/api/health > /dev/null 2>&1
}

# Step 1: Start Backend in background
echo "📦 Starting Backend Server..."
java -jar /app/app.jar > /var/log/backend.log 2>&1 &
BACKEND_PID=$!

echo "⏳ Waiting for Backend to be ready..."
# Wait for backend to be ready (max 120 seconds)
MAX_WAIT=120
WAIT_TIME=0
while ! check_backend; do
    if [ $WAIT_TIME -ge $MAX_WAIT ]; then
        echo "❌ Backend failed to start within $MAX_WAIT seconds"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 2
    WAIT_TIME=$((WAIT_TIME + 2))
    echo "   Waiting... (${WAIT_TIME}s/${MAX_WAIT}s)"
done

echo "✅ Backend is ready on http://localhost:8080"

# Step 2: Start Nginx
echo "🌐 Starting Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2
echo "✅ Nginx is ready on http://localhost:80"

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $NGINX_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    wait
    echo "✅ Shutdown complete"
    exit 0
}

# Trap signals for graceful shutdown
trap cleanup SIGTERM SIGINT

# Keep script running and monitor processes
echo ""
echo "✨ Application is running!"
echo "   Backend: http://localhost:8080"
echo "   Frontend: http://localhost:80"
echo ""
echo "Press Ctrl+C to stop"

# Monitor processes
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend process died, shutting down..."
        cleanup
    fi
    
    # Check if nginx is still running
    if ! kill -0 $NGINX_PID 2>/dev/null; then
        echo "❌ Nginx process died, shutting down..."
        cleanup
    fi
    
    sleep 5
done
