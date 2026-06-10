#!/bin/bash

# Start FastAPI backend in the background
echo "Starting FastAPI backend on port 8000..."
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &

# Wait for backend to start (optional but good for logs)
sleep 2

# Start Nginx in the foreground
echo "Starting Nginx on port 8080..."
nginx -g 'daemon off;'
