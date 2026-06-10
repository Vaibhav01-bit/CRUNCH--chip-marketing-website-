# Stage 1: Build the React frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production environment with Python and Nginx
FROM python:3.12-slim

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy the built React app to Nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy backend requirements and install them
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code
COPY backend ./backend

# Remove default nginx configs to avoid conflicts
RUN rm /etc/nginx/sites-enabled/default || true

# Copy custom nginx configuration to the correct conf.d folder
# This will be included in the main nginx.conf http block
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy startup script
COPY start.sh ./
# Fix Windows line endings (CRLF -> LF) to ensure it runs in Linux
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Run the startup script
CMD ["./start.sh"]
