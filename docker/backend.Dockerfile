# Use a modern Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy the entire .ci directory
COPY .ci/ .ci/

# Install the Python package and its dependencies defined in pyproject.toml
# This makes the `listpkgs-aggregate` command available in the container's PATH
RUN pip install ./ci

# Keep the container alive for development purposes
# This allows us to `exec` into it and run commands manually
CMD ["tail", "-f", "/dev/null"]
