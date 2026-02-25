# Use a modern Node.js image
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm@9

# Set the working directory for the monorepo root
WORKDIR /app

# Copy all necessary package manager files first to leverage Docker cache
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY listpkgs.nuros.front-end/package.json ./listpkgs.nuros.front-end/
COPY blog/package.json ./blog/

# Install all dependencies across the workspace
RUN pnpm install --frozen-lockfile

# Copy the rest of the frontend source code
# This will be the base if not using volumes
COPY listpkgs.nuros.front-end/ ./listpkgs.nuros.front-end/

# Set the final working directory to the frontend app
WORKDIR /app/listpkgs.nuros.front-end

# Expose the Vite development server port
EXPOSE 5173

# The command to run the dev server, allowing access from outside the container
CMD ["pnpm", "dev", "--host"]
