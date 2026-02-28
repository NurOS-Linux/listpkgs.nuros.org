# Use a modern Node.js image with build tools
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm@9

# Set the working directory
WORKDIR /app

# Expose the Vite development server port
EXPOSE 5173

# The default command is to start the Vite dev server.
# The `devcontainer.json` will override this to keep the container alive
# and allow for manual command execution.
CMD ["pnpm", "--dir", "/app/listpkgs.nuros.front-end", "dev", "--host"]
