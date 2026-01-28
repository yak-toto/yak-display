#!/bin/bash

# Build the Docker image for the Vue.js frontend

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Get the frontend version from package.json
FRONTEND_VERSION=$(jq -r .version "$PROJECT_ROOT/package.json" 2>/dev/null)

if [ -z "$FRONTEND_VERSION" ] || [ "$FRONTEND_VERSION" = "null" ] || [ "$FRONTEND_VERSION" = "unknown" ]; then
    echo "Error: Unable to determine frontend version from package.json. Aborting build."
    exit 1
fi

# Build the Docker image
IMAGE_NAME="yak-display:$FRONTEND_VERSION"
echo "Building Docker image: $IMAGE_NAME"

docker buildx build \
    --load \
    -t "$IMAGE_NAME" \
    "$PROJECT_ROOT"

# Check if docker build was successful
if [ $? -eq 0 ]; then
    echo "Successfully built image: $IMAGE_NAME"
else
    echo "Error: Docker build failed"
    exit 1
fi
