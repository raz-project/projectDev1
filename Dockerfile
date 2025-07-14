# Use the official Node.js 16 slim image as the base image
# 'slim' variant is smaller, containing fewer packages, so it's lightweight
FROM node:16-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy only the package.json file to the working directory
# This helps leverage Docker cache for npm install if dependencies don't change
COPY package.json /app/

# Install npm dependencies defined in package.json
RUN npm install

# Copy the main application file into the container
COPY app.js /app/

# Copy the entire 'web' directory into the container (for static files, etc.)
COPY web /app/web

# Inform Docker that the container listens on port 80 at runtime
EXPOSE 80

# Specify the default command to run when the container starts
# Here, it runs the Node.js application 'app.js'
CMD ["node", "app.js"]

