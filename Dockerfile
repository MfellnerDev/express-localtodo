FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies
RUN npm install

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]