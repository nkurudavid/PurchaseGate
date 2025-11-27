# Frontend Dockerfile (React Router v7)
# React Router v7 requires Node 20+
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production=false

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]