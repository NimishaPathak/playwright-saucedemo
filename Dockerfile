# ─── BASE IMAGE ────────────────────────────────────────────────────
FROM mcr.microsoft.com/playwright:v1.44.0-jammy
# Think of this like:
# "Start with a pre-built computer that already has
#  Playwright + all browsers + Linux pre-installed"
#
# mcr.microsoft.com = Microsoft's container registry
# playwright:v1.44.0-jammy = official Playwright image
#   - jammy = Ubuntu 22.04 LTS (codename Jammy Jellyfish)
#   - already has Chromium, Firefox, WebKit installed
#   - already has all browser OS dependencies
# Without this image you'd need to install everything manually

# ─── WORKING DIRECTORY ─────────────────────────────────────────────
WORKDIR /app
# Creates a folder called /app inside the container
# All subsequent commands run from this folder
# Like doing: mkdir /app && cd /app

# ─── COPY PACKAGE FILES FIRST ──────────────────────────────────────
COPY package*.json ./
# Copies package.json AND package-lock.json into /app
# We copy these BEFORE the source code intentionally
# WHY? Docker caches each step (layer)
# If source code changes but package.json doesn't,
# Docker reuses the cached npm install step → much faster builds

# ─── INSTALL DEPENDENCIES ──────────────────────────────────────────
RUN npm ci
# Installs node_modules inside the container
# Same as running npm ci on your local machine

# ─── COPY REST OF PROJECT ──────────────────────────────────────────
COPY . .
# Copies everything else:
# src/, tests/, playwright.config.js, .env, etc.
# into the container's /app folder

# ─── INSTALL BROWSERS ──────────────────────────────────────────────
RUN npx playwright install --with-deps chromium
# Installs Chromium browser inside the container
# Even though the base image has browsers, this ensures
# the version matches exactly what's in your package.json

# ─── DEFAULT COMMAND ───────────────────────────────────────────────
CMD ["npx", "playwright", "test", "--project=chromium"]
# This runs when you start the container
# Equivalent to: npx playwright test --project=chromium --reporter=html
# CMD can be overridden when running the container