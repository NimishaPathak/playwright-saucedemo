# Use the official Microsoft Playwright image as the base
# The version here should match the version in package.json
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Ensure browsers are installed (matches project requirements)
RUN npx playwright install --with-deps chromium

# Default command to run tests
# This can be overridden in docker-compose.yml or at runtime
CMD ["npx", "playwright", "test", "--project=chromium"]