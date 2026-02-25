# Use a modern Python image
FROM python:3.12-slim

# Install uv, the fast Python package installer
RUN pip install uv

# Set the working directory
WORKDIR /app

# Copy only the necessary files for dependency installation
COPY .ci/requirements.in .ci/

# Install dependencies using uv for speed
RUN uv pip install --system -r .ci/requirements.in

# Copy the rest of the application code
COPY . .

# The command to generate the repodata.json file
# The output path will be mounted via a volume in docker-compose
CMD ["listpkgs-aggregate", "--output", "/app/listpkgs.nuros.front-end/public/repodata.json"]
