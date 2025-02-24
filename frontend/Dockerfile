FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the default Vite port
EXPOSE 5174

# Start Vite in development mode
CMD ["npm", "run", "dev", "--", "--host"]
