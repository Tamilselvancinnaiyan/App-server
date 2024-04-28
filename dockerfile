# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on (if applicable)
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
