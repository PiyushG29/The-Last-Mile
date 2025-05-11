FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies for build
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to keep the image small
RUN npm prune --production

# Expose the port
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Start the application using the deployment script
CMD ["node", "deploy.js"]
