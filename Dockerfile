# Use Nginx to serve static files
FROM nginx:alpine

# Copy project files to Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
