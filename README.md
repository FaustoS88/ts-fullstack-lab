ts-fullstack-lab

This repository is a full-stack TypeScript development scaffold using modern tools and frameworks. It combines a backend built with NestJS, a frontend built with React and Vite, and OpenSearch for data storage and querying.

The setup is designed with modular TypeScript configuration, development tooling, and clear structure to support building and testing scalable applications.

🔧 Stack Overview

Backend: NestJS (TypeScript, Node.js)

Frontend: React + Vite (TypeScript)

Search Engine: OpenSearch (local via Docker)

TypeScript Config: NodeNext module system

Linting & Formatting: ESLint with Flat Config + Prettier

📁 Project Structure

ts-fullstack-lab/
├── backend/             # NestJS app with TypeScript
├── frontend/            # React + Vite app with TypeScript
├── tsconfig.base.json   # Shared TypeScript config
├── docker-compose.yml   # OpenSearch dev setup
└── days/                # Day-by-day progress documentation

📚 Documentation by Day

Each day of work is documented in the days/ folder with its own README file.

days/day0/README.md: Project initialization, backend/frontend scaffolding, and OpenSearch setup.

📦 Getting Started

Clone the repository and install dependencies in both frontend and backend folders:
```bash
git clone <your-repo-url>
cd ts-fullstack-lab
cd backend && npm install
cd ../frontend && npm install
```
To run the OpenSearch service:
```bash
docker compose up -d
```
To start development servers:
```bash
# In backend
npm run start:dev

# In frontend
npm run start:dev
```
🔐 Notes

OpenSearch is configured with security enabled and basic auth (dev-only).

rejectUnauthorized: false is used to allow self-signed certs in local development.

ESLint rules are relaxed in specific files to accommodate integration edge cases.

📌 Goals

This project provides a clean environment to:

Learn TypeScript in both backend and frontend contexts.

Practice building and connecting REST APIs.

Understand tooling like Vite, NestJS, Docker, and OpenSearch.

Each day I can build on what I learn.

📬 Feedback & Iteration

This repository is a work in progress. Future improvements may include:

Unit and integration testing setup

Advanced API design

OpenSearch queries and mappings

See individual progression/dayX.md files for detailed task documentation.