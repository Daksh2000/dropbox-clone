# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Build the React app
RUN npm run build

# Serve the build files with a lightweight server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
