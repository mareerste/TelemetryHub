# Use Node.js base image
FROM node:18-alpine

# Install bash and netcat (needed for wait-for-it.sh)
RUN apk add --no-cache bash netcat-openbsd

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the wait-for-it.sh script from current directory into the container
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Copy the rest of the app's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the application with wait-for-it.sh
CMD ["/bin/sh", "-c", "wait-for-it mqtt 5672 60 && node index.js"]


