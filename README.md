# STEP 1: Create a workspace
mkdir ts-fullstack-lab && cd ts-fullstack-lab
git init

# STEP 2: Add backend
npx @nestjs/cli new backend --strict
cd backend && npm i -D ts-node-dev && cd ..

# STEP 3: Add frontend
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install && cd ..

# STEP 4: Add OpenSearch (Docker)
touch docker-compose.yml

You are in: ts-fullstack-lab/

Run:

bash
Copy
Edit
touch tsconfig.base.json
Open the file and paste this content:

jsonc
Copy
Edit
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "strictNullChecks": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
Now edit backend/tsconfig.json and at the top, add this line:

js
Copy
Edit
{
  "extends": "../tsconfig.base.json",
Do the same inside frontend/tsconfig.json — also at the top.

✅ STEP 2 — Test Backend Compile (Nest)
Run this inside ts-fullstack-lab/backend/:

bash
Copy
Edit
npx tsc --noEmit
You should see no errors. That means everything is compiling correctly under strict rules.

Also try:

bash
Copy
Edit
npm run start:dev
You should see:

csharp
Copy
Edit
[Nest] ... App is running on: http://localhost:3000
Visit that in the browser or run:

bash
Copy
Edit
curl http://localhost:3000
✅ STEP 3 — Set Up Docker for OpenSearch
You’ve already done touch docker-compose.yml — now open that file and paste:

yaml
Copy
Edit
version: "3.9"
services:
  opensearch:
    image: opensearchproject/opensearch:2.13.0
    container_name: opensearch
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - plugins.security.disabled=true
Now spin it up:

bash
Copy
Edit
docker compose up -d
Then test it:

bash
Copy
Edit
curl http://localhost:9200
You should see JSON with "cluster_name" and "opensearch_version".

✅ STEP 4 — Install OpenSearch client in backend
From your root, run:

bash
Copy
Edit
cd backend
npm i @opensearch-project/opensearch
Now create this file: backend/src/opensearch.client.ts

ts
Copy
Edit
import { Client } from '@opensearch-project/opensearch';

export const osClient = new Client({
  node: 'http://localhost:9200'
});

// Try a live request:
osClient.info().then((res) => {
  console.log('OpenSearch connected:', res.body);
});
Then run:

bash
Copy
Edit
npx ts-node src/opensearch.client.ts
You should see something like:

bash
Copy
Edit
OpenSearch connected: { name: '...', version: { number: '2.13.0' }, ... }
✅ STEP 5 — Set Up ESLint + Prettier (optional but recommended)
At repo root:

bash
Copy
Edit
npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier
npx eslint --init
When prompted, choose:

TypeScript

ESM modules

Browser + Node

Format code with Prettier

Then run a check:

bash
Copy
Edit
npx eslint backend/src --ext .ts
🧾 Recap: Your Day 0 Folder Tree Now Looks Like
bash
Copy
Edit
ts-fullstack-lab/
├─ backend/
│  ├─ src/
│  │  ├─ main.ts
│  │  ├─ app.module.ts
│  │  └─ opensearch.client.ts   ← just added
│  ├─ tsconfig.json              ← now extends base
│  └─ package.json
├─ frontend/
│  ├─ tsconfig.json              ← now extends base
│  └─ ...
├─ docker-compose.yml            ← OpenSearch ready
├─ tsconfig.base.json            ← strict setup
└─ .git/
✅ Final Step for Day 0 — Make First Commit
bash
Copy
Edit
git add .
git commit -m "Day 0 complete: backend/frontend scaffold, OpenSearch ready"