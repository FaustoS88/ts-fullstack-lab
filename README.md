# TS-Fullstack-Lab

Mono-repo playground built with:

| Layer | Tech |
|-------|------|
| **Backend** | NestJS + TypeScript (`ts-node-dev`) |
| **Search**  | OpenSearch 2.13 (Docker) |
| **Frontend**| Vite 6 + React 19 (TypeScript) |
| **Tooling** | Strict TS 5.8 • ESLint + Prettier |

---

## 5-Day Roadmap

| Day | Focus | Deliverables |
|-----|-------|--------------|
| **0** | Environment & Scaffolding | Running API, UI, OpenSearch |
| **1** | TypeScript Fundamentals | CLI utils, unit tests |
| **2** | Advanced Types | Generic helpers, error handling |
| **3** | Full-stack Integration | Shared DTOs, search endpoint, typed React hook |
| **4** | Final Polish | Build scripts, container images, docs |

(Directories for Days 1-4 start empty and will be filled as work progresses.)

---

## Quick Start (Day 0)

```bash
git clone https://github.com/<you>/ts-fullstack-lab.git
cd ts-fullstack-lab
npm install --workspaces          # installs backend & frontend

# OpenSearch
docker compose up -d
docker compose logs -f opensearch | grep -m1 "Node started"

# Dev servers
npm --workspace backend  run start:dev   # http://localhost:3000
npm --workspace frontend run start:dev   # http://localhost:5173

# Verify search node
curl -k -u admin:Str0ngP@ssw0rd! https://localhost:9200
Credentials (development)
user	password
admin	Str0ngP@ssw0rd!

(Self-signed TLS; client uses rejectUnauthorized: false.)

Directory Layout
arduino
Copy
Edit
.
├─ backend/        NestJS service
│  └─ src/
│     └─ opensearch.client.ts
├─ frontend/       React + Vite app
├─ docker-compose.yml
├─ tsconfig.base.json
└─ eslint.config.mjs
Common Scripts
Script (root)	Purpose
npm run lint	ESLint + Prettier
npm --workspace backend run start:dev	API dev server
npm --workspace frontend run start:dev	UI dev server

License
MIT