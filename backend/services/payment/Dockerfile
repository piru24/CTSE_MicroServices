FROM node:18-alpine

WORKDIR /app

# Production image: no devDependencies (nodemon), smaller & stable in Azure
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8500

# Run Node directly — do not use "npm start" (that uses nodemon)
CMD ["node", "payment-server.js"]
