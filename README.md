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

### 1. Set up operate-demo's environment

The fastest way is to pull values from the preview environment in Doppler:

```bash
doppler secrets download --project operate-demo --config preview --no-file --format env \
  | grep -v "^OPERATE_" > .env
```

> **Need Doppler access?** Ping the `#platform` channel to get added to the `operate-demo` project.

This gives you the Datadog keys needed for local log shipping. You also need to add one additional var:

```bash
# URI of the Operate MongoDB database. operate-demo uses this to check whether Operate
# has detected a case after a scenario is triggered, so the UI can show live feedback.
# In local dev, Operate's DB runs on port 27017 inside Docker and is exposed via host.docker.internal.
OPERATE_DB_URI=mongodb://host.docker.internal:27017/operate-dev
```

> In preview and production this is already set via Doppler (`OPERATE_DB_URI`) — no additional setup needed there.

### 2. Set up Operate's environment

Follow the [Operate Getting Started guide](https://github.com/jalantechnologies/operate#getting-started) to create `jalantechnologies/operate/.env`.

The Operate README covers all required vars. The operate-demo-specific overrides to add:

```bash
OPERATE_HOST_APP_GITHUB_OWNER=jalantechnologies
OPERATE_HOST_APP_GITHUB_REPO=operate-demo
OPERATE_HOST_APP_DB_PROVIDER=mongodb
OPERATE_HOST_APP_DB_READONLY_URI=mongodb://host.docker.internal:27018
OPERATE_HOST_APP_DB_NAME=operate-demo-dev

# Required for Operate to register its Datadog webhook.
# Datadog must reach this URL, so localhost won't work.
# Run: ngrok http 3000 (or use pinggy.io) → set the public URL here.
OPERATE_HOST_APP_PUBLIC_URI=<your-tunnel-url>
```

### 3. Start both stacks

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

## Best Practices

Head over to the [Engineering Handbook](https://github.com/jalantechnologies/handbook/blob/main/engineering/index.md) for the best practices we follow at Better Software.

PS: Before you start working on the application, these [three git settings](https://spin.atomicobject.com/git-configurations-default/) are a must-have!
