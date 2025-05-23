# Day 0: Project Setup - `ts-fullstack-lab`

This document outlines the initial setup for the `ts-fullstack-lab` project, a learning scaffold for full-stack TypeScript development.

**Core Technologies:**

-   **Backend**: NestJS (Node.js + TypeScript)
-   **Frontend**: React + Vite (TypeScript)
-   **Data Store**: OpenSearch
-   **Module System**: NodeNext
-   **Tooling**: ESLint, Prettier

---

## 📁 Project Structure

The initial project structure is as follows:

```
ts-fullstack-lab/
├── backend/             # NestJS application
├── frontend/            # React + Vite application
├── tsconfig.base.json   # Shared TypeScript configuration
└── docker-compose.yml   # Docker configuration for OpenSearch
```

---

## ✅ Day 0 Setup Guide

The following steps detail the process undertaken to establish the working development stack.

---

### 1. Repository & Shared TypeScript Configuration

**Initialize Git Repository:**

```bash
mkdir ts-fullstack-lab
cd ts-fullstack-lab
git init
```

**Create Base TypeScript Configuration (`tsconfig.base.json`):**

This file provides common compiler options for both backend and frontend projects.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "strictNullChecks": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### 2. Backend Setup: NestJS with NodeNext

**Scaffold NestJS Application:**

```bash
npx @nestjs/cli new backend --strict
cd backend
npm i -D ts-node-dev # Install ts-node-dev for development
```

**Configure TypeScript for Backend (`backend/tsconfig.json`):**

Extend the base configuration and specify NodeNext module settings.

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

**Add Development Script to `backend/package.json`:**

```json
"scripts": {
  // ... other scripts
  "start:dev": "ts-node-dev --respawn --notify=false src/main.ts"
}
```

**Run NestJS Development Server:**

```bash
npm run start:dev
```

---

### 3. Frontend Setup: React + Vite (TypeScript)

**Scaffold React + Vite Application:**

```bash
cd .. # Navigate back to project root
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

**Add Development Script to `frontend/package.json`:**

```json
"scripts": {
  "dev": "vite",
  "start:dev": "npm run dev", // Alias for consistency
  "build": "vite build",
  "preview": "vite preview"
}
```

**Configure TypeScript for Frontend (`frontend/tsconfig.json`):**

Extend the base configuration and set JSX and module settings.

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx"
    // "noEmit": true, // Vite handles transpilation, tsc is for type checking
  }
}
```

**Run Vite Development Server:**

```bash
npm run start:dev
```

---

### 4. OpenSearch Setup (Development Only)

**Create Docker Compose Configuration (`docker-compose.yml`):**

This sets up a single-node OpenSearch instance for local development.

```yaml
services:
  opensearch:
    image: opensearchproject/opensearch:2.13.0
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=Str0ngP@ssw0rd! # Use a secure password
    ports:
      - "9200:9200" # Maps container port 9200 to host port 9200
    # volumes: # Optional: Persist OpenSearch data
    #   - opensearch-data:/usr/share/opensearch/data
# volumes: # Optional: Define the volume
#   opensearch-data:
```

**Start OpenSearch Service:**

```bash
docker compose up -d
```

**Verify OpenSearch Connection:**

```bash
curl -k -u admin:Str0ngP@ssw0rd! https://localhost:9200
```
*(Note: `-k` allows insecure connections, suitable for local dev with self-signed certs)*

**Install OpenSearch Client and Test Connection from Backend:**

```bash
cd ../backend # Ensure you are in the backend directory
npm i @opensearch-project/opensearch
```

**Create OpenSearch Client (`backend/src/opensearch.client.ts`):**

```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */

import { Client } from '@opensearch-project/opensearch';

export const osClient = new Client({
  node: 'https://localhost:9200', // Ensure this matches your OpenSearch URL
  auth: {
    username: 'admin', // Default admin username
    password: 'Str0ngP@ssw0rd!', // Password set in docker-compose.yml
  },
  ssl: {
    // For local development with self-signed certificates
    rejectUnauthorized: false,
  },
});

async function pingOpenSearch() {
  try {
    const { body } = await osClient.info();
    console.log('OpenSearch connection successful!');
    console.log('OpenSearch version:', (body as any).version.number);
  } catch (error) {
    console.error('Failed to connect to OpenSearch:', error);
  }
}

// Immediately invoke the ping function to test connection on module load
void pingOpenSearch();
```

**Run the OpenSearch Client Test Script:**

```bash
npx ts-node src/opensearch.client.ts
```

---

### 5. Linting & Formatting Setup

**Install ESLint and Prettier Dependencies:**

```bash
cd .. # Navigate back to project root
npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
# (Ensure these are installed at the root or relevant workspaces if using monorepo tools)
```

**Configuration:**

ESLint is configured using a Flat Config file (`eslint.config.mjs` or similar at the project root) integrating TypeScript and Prettier rules. (Details of this file are omitted here but assumed to be set up).

---

### 6. Final Checks

**Perform Type Checking:**

```bash
# In the backend directory
cd backend
npx tsc --noEmit

# In the frontend directory
cd ../frontend
npx tsc --noEmit
```

---

## 🧠 Important Notes

-   **ESLint Rules**: Rules were temporarily disabled (`/* eslint-disable ... */`) in [`opensearch.client.ts`](ts-fullstack-lab/backend/src/opensearch.client.ts:149) to manage type warnings from the OpenSearch client, which uses `any` types in some areas. This should be reviewed for more robust typing if possible.
-   **TLS Self-Signed Certificates**: The OpenSearch client is configured with `rejectUnauthorized: false`. This is **not secure for production environments** and is only used here to allow connections to the local OpenSearch instance which uses self-signed certificates.
-   **Learning Focus**: This project is primarily for hands-on learning of TypeScript within a full-stack context and for simulating real-world development environments.

---

## 🛠️ Next Steps

-   **Day 1**: Focus on practicing TypeScript language features within both the `backend/src/` and `frontend/src/` directories.
-   **Day 2**: Begin building REST APIs in the NestJS backend and learn to connect and consume them from the React frontend.