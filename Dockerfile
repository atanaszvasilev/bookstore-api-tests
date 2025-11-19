# Use Node.js Alpine
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy everything else
COPY . .

# Set default command
CMD ["npm", "run", "test:stage"]
