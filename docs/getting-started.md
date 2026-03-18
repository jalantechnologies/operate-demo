# Getting Started

## Prerequisites

| Dependency  | Version | Notes                                                                   |
| ----------- | ------- | ----------------------------------------------------------------------- |
| **Python**  | 3.11    | —                                                                       |
| **Node**    | 22.13.1 | [Download](https://nodejs.org/download/release/v22.13.1/)               |
| **MongoDB** | 8.x     | [Installation guide](https://www.mongodb.com/docs/manual/installation/) |
| **Redis**   | 7.x     | [Installation guide](https://redis.io/docs/install/install-redis/)      |

## Environment Setup

operate-demo itself requires no additional environment variables for local development — docker-compose wires up MongoDB and Redis automatically.

The [operate](https://github.com/jalantechnologies/operate) stack running alongside it does require its own `.env`. Before starting, set up operate's `.env` as described in the [operate Getting Started guide](https://github.com/jalantechnologies/operate/blob/main/docs/getting-started.md#environment-setup). Those variables go in `jalantechnologies/operate/.env`, not here.

---

## Quickstart

This project can run either in **Docker** or **locally with Node**. Choose whichever fits your workflow.

---

# Running the App

### 1. With Docker Compose

operate-demo runs alongside [operate](https://github.com/jalantechnologies/operate) — nginx sits in front and routes:

- `http://localhost:3000/` → operate-demo
- `http://localhost:3000/operate` → operate

Both stacks run independently. Start them in two separate terminals:

```bash
# Terminal 1 — start operate first
cd jalantechnologies/operate
docker compose -f docker-compose.dev.yml up --build

# Terminal 2 — start operate-demo
cd jalantechnologies/operate-demo
docker compose -f docker-compose.dev.yml up --build
```

Visit **http://localhost:3000** — operate-demo is at `/` and operate is at `/operate`. Hot reload works independently on both.

### 2. Locally (npm run serve)

```bash
# Install JS deps
npm install

# Install Python deps
pipenv install --dev

# Start Redis (in separate terminal)
redis-server

# Start dev servers (frontend + backend + workers)
npm run serve
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **MongoDB:** `mongodb://localhost:27017`
- **Redis:** `localhost:6379`
- Disable the auto‑opening browser tab by exporting `WEBPACK_DEV_DISABLE_OPEN=true`.
- **Windows users:** run inside WSL or Git Bash for best results.
- **Note:** `npm run serve` starts frontend, backend, Celery worker, Celery beat scheduler, and Flower dashboard.

---

# Scripts

| Script                 | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm install`          | Install JavaScript/TypeScript dependencies.                            |
| `pipenv install --dev` | Install Python dependencies.                                           |
| `npm run build`        | Production build (no hot reload).                                      |
| `npm start`            | Start the built app.                                                   |
| `npm run serve`        | Dev mode with hot reload (frontend, backend, workers, beat scheduler). |
| `npm run serve:worker` | Start Celery worker only.                                              |
| `npm run serve:beat`   | Start Celery beat scheduler only.                                      |
| `npm run serve:flower` | Start Flower dashboard (worker monitoring UI at `localhost:5555`).     |
| `npm run lint`         | Lint all code.                                                         |
| `npm run fmt`          | Auto‑format code.                                                      |

---

# Bonus Tips

- **Hot Reload:** Both frontend and backend restart automatically on code changes.
- **Mongo CLI access:** connect with `mongodb://localhost:27017`.
- **Redis CLI access:** run `redis-cli` to connect to Redis.
- **Background Jobs:** Workers process async jobs automatically. See [Workers documentation](workers.md) for details.
- **Worker Monitoring:** Use Flower dashboard (`npm run serve:flower`) to monitor workers, tasks, and queues at `http://localhost:5555`.
