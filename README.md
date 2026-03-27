# Operate Demo

A sample web application that runs alongside [Operate](https://github.com/jalantechnologies/operate) — an AI agent that automatically investigates engineering incidents (errors, regressions, support tickets) and surfaces findings for engineer review.

operate-demo exists to demonstrate and test the Operate integration. Think of it as a real app you'd deploy Operate next to.

| Build Status                                                                                                                                                                                                         | Code Coverage                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Production Deploy](https://github.com/jalantechnologies/operate-demo/actions/workflows/production.yml/badge.svg?branch=main)](https://github.com/jalantechnologies/operate-demo/actions/workflows/production.yml) | [![Code Coverage](https://sonarqube.platform.bettrhq.com/api/project_badges/measure?project=jalantechnologies_operate-demo&metric=coverage&token=a4dd71c68afbb8da4b7ed1026329bf0933298f79)](https://sonarqube.platform.bettrhq.com/dashboard?id=jalantechnologies_operate-demo) |

## Environments

| Environment       | URL                                                                            | Description            |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------- |
| Production        | [operate-demo.bettrsw.com](https://operate-demo.bettrsw.com)                   | Live app               |
| Permanent Preview | [preview--operate-demo.bettrsw.com](https://preview--operate-demo.bettrsw.com) | Always reflects `main` |
| PR Preview        | `https://<hash>.preview--operate-demo.bettrsw.com`                             | Per-PR environment     |

## Getting started

Both repos must be cloned as siblings inside the same parent folder:

```
jalantechnologies/
  operate/        ← git clone https://github.com/jalantechnologies/operate
  operate-demo/   ← this repo
```

### 1. Set up Operate's environment

operate-demo itself needs no extra env vars. Operate does — follow the [Operate Getting Started guide](https://github.com/jalantechnologies/operate#getting-started) to create `jalantechnologies/operate/.env`.

When configuring Operate to point at operate-demo, use these values:

```bash
OPERATE_HOST_APP_GITHUB_OWNER=jalantechnologies
OPERATE_HOST_APP_GITHUB_REPO=operate-demo
OPERATE_HOST_APP_DB_PROVIDER=mongodb
OPERATE_HOST_APP_DB_READONLY_URI=mongodb://host.docker.internal:27018  # operate-demo exposes MongoDB on 27018
OPERATE_HOST_APP_DB_NAME=operate-demo-dev
```

### 2. Start both stacks

```bash
# Terminal 1 — start Operate first
cd jalantechnologies/operate
docker compose -f docker-compose.dev.yml up --build

# Terminal 2 — start operate-demo
cd jalantechnologies/operate-demo
docker compose -f docker-compose.dev.yml up --build
```

Once both are running:

- **operate-demo:** http://localhost:3000
- **Operate (AI agent UI):** http://localhost:3000/operate

Changes to either codebase are reflected immediately via hot reload.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Backend Architecture](docs/backend-architecture.md)
- [Frontend Architecture](docs/frontend-architecture.md)
- [Configuration](docs/configuration.md)
- [Secrets](docs/secrets.md)
- [Workers](docs/workers.md)
- [Logging](docs/logging.md)
- [Scripts](docs/scripts.md)
- [Code Formatting](docs/code-formatting.md)
- [CI/CD](docs/deployment.md)
- [Bootstrapping](docs/bootstrapping.md)
- [Running Scripts in Production](docs/running-scripts-in-production.md)

## Cloud log monitoring scenario

operate-demo includes a `SimulateTaskFailureWorker` that runs every 5 minutes and logs a realistic task processing error via `Logger.error()`. This gives Operate's Datadog log monitor real errors to detect so you can verify the full end-to-end pipeline:

```
operate-demo logs error → Datadog ingests it → Datadog log monitor fires
  → POST /operate/api/webhooks/datadog → Operate creates a Case (status: pending)
```

To enable this scenario, configure the Datadog integration and public URI in Operate's `.env`:

```bash
OPERATE_HOST_APP_DATADOG_API_KEY=...
OPERATE_HOST_APP_DATADOG_APP_KEY=...
OPERATE_HOST_APP_DATADOG_SITE=us5.datadoghq.com   # match your Datadog site
OPERATE_HOST_APP_DATADOG_SERVICE=operate-demo
OPERATE_HOST_APP_PUBLIC_URI=http://localhost:3000  # root URL of the host app
```

Once both stacks are running, the worker will fire within 5 minutes and you should see a new case appear in the Operate Cases page at http://localhost:3000/operate.

## Best Practices

Head over to the [Engineering Handbook](https://github.com/jalantechnologies/handbook/blob/main/engineering/index.md) for the best practices we follow at Better Software.

PS: Before you start working on the application, these [three git settings](https://spin.atomicobject.com/git-configurations-default/) are a must-have!
