FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port (IMPORTANT)
EXPOSE 5000

# Start app
CMD ["npm", "start"]