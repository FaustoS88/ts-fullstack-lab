# ts-fullstack-lab

This repository provides a full-stack TypeScript development scaffold utilizing modern tools and frameworks. It integrates a backend built with NestJS, a frontend developed with React and Vite, and OpenSearch for data storage and querying.

The setup emphasizes modular TypeScript configuration, robust development tooling, and a clear project structure to facilitate the building and testing of scalable applications.

---

## 🔧 Stack Overview

-   **Backend**: NestJS (TypeScript, Node.js)
-   **Frontend**: React + Vite (TypeScript)
-   **Search Engine**: OpenSearch (local via Docker)
-   **TypeScript Config**: NodeNext module system
-   **Linting & Formatting**: ESLint with Flat Config + Prettier

---

## 📁 Project Structure

```
ts-fullstack-lab/
├── backend/             # NestJS app with TypeScript
├── frontend/            # React + Vite app with TypeScript
├── tsconfig.base.json   # Shared TypeScript config
├── docker-compose.yml   # OpenSearch dev setup
└── days/                # Day-by-day progress documentation
```

---

## 📚 Documentation by Day

Each day of work is documented in the `days/` folder with its own README file.

-   [`days/day0.md`](ts-fullstack-lab/days/DAY0.md): Project initialization, backend/frontend scaffolding, and OpenSearch setup.
-   [`days/day1.md`](ts-fullstack-lab/days/DAY1.md): Everyday types practice and a simple CLI calculator.
-   [`days/day2.md`](ts-fullstack-lab/days/DAY2.md): Generics, utility types, and `fetch` demonstrations.
-   [`days/day3.md`](ts-fullstack-lab/days/DAY3.md): Basic Nest search endpoint consumed from React.

---

## 📦 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/FaustoS88/ts-fullstack-lab.git
    cd ts-fullstack-lab
    ```

2.  **Install dependencies:**
    Navigate to both `backend` and `frontend` directories and install their respective dependencies:
    ```bash
    cd backend  
    npm install
    cd ../frontend
    npm install
    cd .. # Return to project root
    ```

3.  **Run OpenSearch service:**
    ```bash
    docker compose up -d
    ```

4.  **Start development servers:**
    -   In the `backend` directory:
        ```bash
        npm run start:dev
        ```
    -   In the `frontend` directory:
        ```bash
        npm run start:dev
        ```

---

## 🔐 Notes

-   OpenSearch is configured with security enabled and basic authentication (intended for development environments only).
-   `rejectUnauthorized: false` is used to allow self-signed certificates during local development.
-   ESLint rules are relaxed in specific files to accommodate integration edge cases.

---

## 📌 Goals

This project serves as a clean environment to:

-   Learn and apply TypeScript in both backend and frontend contexts.
-   Practice building and connecting REST APIs.
-   Gain familiarity with tools such as Vite, NestJS, Docker, and OpenSearch.
-   Incrementally build upon knowledge gained each day.

---

## 📬 Feedback & Iteration

This repository is an ongoing work in progress. Future improvements may include:

-   Comprehensive unit and integration testing setup.
-   Advanced API design patterns.
-   Detailed OpenSearch queries and mappings.

For detailed task documentation, please refer to the individual `days/dayX.md` files.