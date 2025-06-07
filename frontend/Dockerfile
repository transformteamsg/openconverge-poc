# frontend/Dockerfile

# Builder stage for installing Node.js dependencies and building the frontend
FROM node:22.11.0-slim as builder

# Set the working directory in the container
WORKDIR /app

# Copy necessary files
COPY \
    package.json \
    package-lock.json \
    components.json \
    index.html \
    postcss.config.js \
    tailwind.config.js \
    tsconfig.json \
    tsconfig.node.json \
    vite.config.ts \
    ./

# Copy source code directories
COPY public public
COPY src src

# Install frontend dependencies
RUN npm install

# Runtime stage: Use the same Node.js environment to run the frontend
FROM node:22.11.0-slim as runtime

# Set the working directory in the container
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app .

# Copy the launch script into the container
COPY launch.sh .
RUN chmod +x launch.sh

# Expose port for the frontend application
EXPOSE 5173

# Run launch.sh when the container launches
ENTRYPOINT ["bash", "launch.sh"]
