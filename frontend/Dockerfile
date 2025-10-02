# Use official Node.js LTS image
FROM node:22.11.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 8081
EXPOSE 8081

# Start the app
CMD ["npm", "start"]
