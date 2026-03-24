# Operate Demo

Demo application for [Operate](https://github.com/jalantechnologies/operate) — the staff-facing tool that automates engineering operations investigation. operate-demo is a sample client app showing how Operate integrates alongside a real application.

| Build Status                                                                                                                                                                                                         | Code Coverage                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Production Deploy](https://github.com/jalantechnologies/operate-demo/actions/workflows/production.yml/badge.svg?branch=main)](https://github.com/jalantechnologies/operate-demo/actions/workflows/production.yml) | [![Code Coverage](https://sonarqube.platform.bettrhq.com/api/project_badges/measure?project=jalantechnologies_operate-demo&metric=coverage&token=a4dd71c68afbb8da4b7ed1026329bf0933298f79)](https://sonarqube.platform.bettrhq.com/dashboard?id=jalantechnologies_operate-demo) |

## What it does

- Demonstrates operate running alongside a client app, accessible at `/operate` via nginx
- operate runs as its own standalone stack — operate-demo proxies `/operate` traffic to it
- Local dev: two independent stacks in two terminals; prod/preview: ingress routes `/operate` to the operate Kubernetes service

## Environments

| Environment       | URL                                                                            | Description            |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------- |
| Production        | [operate-demo.bettrsw.com](https://operate-demo.bettrsw.com)                   | Live app               |
| Permanent Preview | [preview--operate-demo.bettrsw.com](https://preview--operate-demo.bettrsw.com) | Always reflects `main` |
| PR Preview        | `https://<hash>.preview--operate-demo.bettrsw.com`                             | Per-PR environment     |

## Local development

Both repos must be cloned as siblings:

```
jalantechnologies/
  operate/        ← clone from https://github.com/jalantechnologies/operate
  operate-demo/   ← this repo
```

```bash
docker compose -f docker-compose.dev.yml up --build
```

- **operate-demo + operate:** http://localhost:3000
- **operate at:** http://localhost:3000/operate
- Changes to either codebase are reflected immediately via hot reload.

See [Getting Started](docs/getting-started.md) for full setup instructions including worktree support.

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

## Operate configuration

Operate is deployed alongside this application to investigate production incidents.

### Core

| Variable | Description |
| -------- | ----------- |
| `OPERATE_JWT_SECRET` | Secret key for signing Operate JWTs |
| `OPERATE_MONGODB_URI` | MongoDB connection URI for Operate's own database |
| `OPERATE_CLAUDE_CODE_CREDENTIALS` | Claude AI OAuth credentials JSON |
| `OPERATE_CLAUDE_CODE_MODEL` | Claude model ID to use (e.g. `claude-sonnet-4-6`) |

### Source control (GitHub)

| Variable | Description |
| -------- | ----------- |
| `OPERATE_HOST_APP_GITHUB_TOKEN` | GitHub personal access token with repo read access |
| `OPERATE_HOST_APP_GITHUB_OWNER` | GitHub organisation or user owning the repo (e.g. `jalantechnologies`) |
| `OPERATE_HOST_APP_GITHUB_REPO` | GitHub repository name (e.g. `operate-demo`) |

### Database provider (MongoDB)

| Variable | Description |
| -------- | ----------- |
| `OPERATE_HOST_APP_DB_PROVIDER` | Database provider type (e.g. `mongodb`) |
| `OPERATE_HOST_APP_DB_READONLY_URI` | Read-only connection URI for the host app's database |
| `OPERATE_HOST_APP_DB_NAME` | Database name (e.g. `operate-demo-production`) |

### Log provider (Datadog)

| Variable | Description |
| -------- | ----------- |
| `OPERATE_HOST_APP_DATADOG_API_KEY` | Datadog API key with `logs_read_data` and `logs_read_index_data` scopes |
| `OPERATE_HOST_APP_DATADOG_APP_KEY` | Datadog Application key with `logs_read_data` and `logs_read_index_data` scopes |
| `OPERATE_HOST_APP_DATADOG_SITE` | Datadog site (e.g. `us5.datadoghq.com`) |
| `OPERATE_HOST_APP_DATADOG_SERVICE` | Service name as it appears in Datadog logs (e.g. `operate-demo-production`) |

Use a dedicated restricted key for Operate rather than reusing the existing Datadog key, so permissions stay minimal.

## Best Practices

Head over to the [Engineering Handbook](https://github.com/jalantechnologies/handbook/blob/main/engineering/index.md) for the best practices we follow at Better Software.

PS: Before you start working on the application, these [three git settings](https://spin.atomicobject.com/git-configurations-default/) are a must-have!
