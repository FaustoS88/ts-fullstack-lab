# ts-fullstack-lab

This is a learning scaffold to practice full-stack TypeScript development using:

- **NestJS** for backend (Node + TypeScript)
- **React + Vite** for frontend (TypeScript)
- **OpenSearch** as the data source
- Configured using **NodeNext modules**, with ESLint and Prettier

---

## 📁 Project Structure

ts-fullstack-lab/
├── backend/ # NestJS app
├── frontend/ # React + Vite app
├── tsconfig.base.json
├── docker-compose.yml

---

## ✅ Day 0 Setup Guide

This is what was done step by step to get the stack working.

---

### 1 · Repo & Shared TypeScript Config

```bash
mkdir ts-fullstack-lab && cd ts-fullstack-lab
git init
```

tsconfig.base.json:

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

2 · Backend: NestJS with NodeNext
```bash

npx @nestjs/cli new backend --strict
cd backend
npm i -D ts-node-dev
```
Edit backend/tsconfig.json:

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

Add to backend/package.json:

```json

"scripts": {
  "start:dev": "ts-node-dev --respawn --notify=false src/main.ts"
}
```
Run NestJS:

```bash
npm run start:dev
```

3 · Frontend: React + Vite (TypeScript)
```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install
```
Add to frontend/package.json:

```json

"scripts": {
  "dev": "vite",
  "start:dev": "npm run dev",
  "build": "vite build",
  "preview": "vite preview"
}
```

Edit frontend/tsconfig.json:

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx"
  }
}
```
Run Vite Dev Server:

```bash
npm run start:dev
```
4 · OpenSearch (Dev Only)
Create docker-compose.yml:

```bash
services:
  opensearch:
    image: opensearchproject/opensearch:2.13.0
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=Str0ngP@ssw0rd!
    ports:
      - "9200:9200"
```
Start OpenSearch:

```bash
docker compose up -d
curl -k -u admin:Str0ngP@ssw0rd! https://localhost:9200
```
Install client and test:

```bash
cd backend
npm i @opensearch-project/opensearch
Create src/opensearch.client.ts:
```
```ts
/* eslint-disable @typescript-eslint/no-unsafe-* */

import { Client } from '@opensearch-project/opensearch';

export const osClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'admin',
    password: 'Str0ngP@ssw0rd!',
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

async function ping() {
  const { body } = await osClient.info();
  console.log('OpenSearch OK', (body as any).version.number);
}

void ping();
```

```bash
npx ts-node src/opensearch.client.ts
```
5 · Linting & Formatting
```bash
npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier
```
Configured using Flat Config with TypeScript + Prettier integration in eslint.config.mjs.

6 · Final Checks

```bash
# Type check
cd backend && npx tsc --noEmit
cd ../frontend && npx tsc --noEmit
```
🧠 Notes
ESLint rules were temporarily disabled inside opensearch.client.ts to work around safety warnings from OpenSearch’s any-typed client.

TLS self-signed cert is accepted with rejectUnauthorized: false – do not use this in production.

This project is used for hands-on TypeScript learning and simulating full-stack environments.

🛠️ Next Steps
Day 1: practice TypeScript language features inside backend/src/ and frontend/src/.

Day 2: build REST APIs and connect them from React.