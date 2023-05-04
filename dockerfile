# Use Node 16 alpine as parent image
FROM node:18-alpine

# Change the working directory on the Docker image to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the /app directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 8080

RUN yarn build

# Start the application
CMD ["yarn", "dev"]