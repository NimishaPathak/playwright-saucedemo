# 🐳 Playwright Docker Implementation Guide

This guide explains how Docker is implemented in this project and serves as a "frequent watch" reference for maintaining and running your containerized tests.

---

## 🏗️ The 3 Pillars of Our Docker Setup

Our implementation consists of three files working together:
1.  **Dockerfile**: The blueprint for the environment.
2.  **docker-compose.yml**: The "remote control" for running the container.
3.  **.dockerignore**: The filter that keeps the environment clean.

---

## 🛠️ 1. The Dockerfile (The Blueprint)
The `Dockerfile` builds an image that contains everything needed to run your tests, including Node.js, Playwright, and the actual browsers.

### Key Sections:
*   **`FROM mcr.microsoft.com/playwright:v1.44.0-jammy`**: We start with an official Microsoft image. It already has the Linux OS and browser dependencies pre-installed.
*   **`COPY package*.json ./` + `RUN npm ci`**: We copy these files and install dependencies **before** copying your source code. 
    *   *Why?* This is called **Layer Caching**. If you change a test file but don't change your dependencies, Docker skips the slow `npm install` step!
*   **`RUN npx playwright install --with-deps chromium`**: This ensures the Chromium browser is downloaded and ready inside the container.
*   **`CMD ["npx", "playwright", "test"]`**: The default instruction given to the container when it starts.

---

## 🚦 2. Docker Compose (The Orchestrator)
Instead of typing long `docker run` commands, we use `docker-compose.yml` to manage configurations.

### Essential Features:
*   **`env_file: .env`**: Automatically injects your local environment variables (`BASE_URL`, `STANDARD_USER`, etc.) into the container.
*   **Volumes (The Magic Bridge)**:
    ```yaml
    - ./playwright-report:/app/playwright-report
    ```
    This links your computer's folder to the container's folder. When the container finishes a test and creates a report, it "teleports" that report directly onto your hard drive!
*   **`command: npx playwright test --project=chromium`**: Overrides the default command so you can quickly switch projects or run specific tests without rebuilding the image.

---

## 🛡️ 3. .dockerignore (The Filter)
Think of this like a `.gitignore` specifically for Docker.
*   It prevents your local `node_modules/` (which are built for Windows) from being copied into the Linux container.
*   It keeps your image small and fast by ignoring local logs and old reports.

---

## 📋 Frequently Used Commands (Save These!)

| Task | Command |
| :--- | :--- |
| **First-time setup / Build** | `docker-compose build` |
| **Run all tests** | `docker-compose up` |
| **Run and rebuild (Safe choice)** | `docker-compose up --build` |
| **Stop and clean up** | `docker-compose down` |
| **Run a specific test file** | `docker compose run playwright npx playwright test tests/auth/login.spec.js` |

---

> [!TIP]
> **Pro Tip**: Use `docker-compose up --build` if you have added new dependencies to `package.json` or changed your `.env` file to ensure the container is fully updated.
