# CLAUDE.md — Best Practices for AI Coding Agents

This file guides AI coding assistants (Claude, Copilot, Cursor, etc.) working inside
**operate-demo**. Read it before writing or reviewing any code.

---

## Project Overview

`operate-demo` is a full-stack reference application that pairs a modular **Flask**
backend with a **React + TypeScript** frontend. It also serves as the host app for the
**Operate** incident-investigation tool, which is proxied at `/operate`.

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Backend        | Python 3.12 · Flask 3 · PyMongo · Pydantic      |
| Async workers  | Celery 5 · Redis · Celery Beat · Flower          |
| Frontend       | React 18 · TypeScript · Tailwind CSS · Axios    |
| Data store     | MongoDB                                         |
| Build tooling  | Webpack 5 · Pipenv · npm scripts                |
| Testing        | pytest + pytest-cov                             |
| Deployment     | Docker · Kubernetes · GitHub Actions            |
| Secrets        | Doppler                                         |

---

## Essential Commands

```bash
# Install all dependencies
npm install                         # JS/TS
pipenv install --dev                # Python (run from src/apps/backend)

# Development
npm run serve                       # Full stack (backend + frontend + workers)
npm run serve:backend               # Flask API only
npm run serve:frontend              # React dev server with HMR
npm run serve:worker                # Celery workers
npm run serve:beat                  # Celery Beat scheduler
npm run serve:flower                # Flower worker dashboard (localhost:5555)

# Build
npm run build                       # Production bundles

# Testing
npm run test                        # pytest with coverage (recommended)
docker compose -f docker-compose.test.yml up --build   # Isolated container run

# Formatting
npm run fmt                         # Format everything
npm run fmt:py                      # black + isort + autoflake (Python)
npm run fmt:ts                      # Prettier (JS/TS)

# Linting
npm run lint                        # All linters
npm run lint:py                     # mypy + pylint
npm run lint:ts                     # ESLint
npm run lint:md                     # Markdown (remark)
```

---

## Repository Layout

```
operate-demo/
├── src/
│   └── apps/
│       ├── backend/               # Flask application
│       │   └── modules/           # Domain modules (account, task, …)
│       └── frontend/              # React SPA
│           ├── components/
│           ├── contexts/
│           ├── pages/
│           ├── services/
│           └── types/
├── tests/
│   └── modules/                   # pytest suites mirroring backend modules
├── config/                        # Shared environment config (YAML)
├── docs/                          # Architecture & operational docs
└── markdown-templates/            # PR / issue templates
```

---

## Architecture Principles

### Backend

Each domain lives in its own **module** under `src/apps/backend/modules/`:

```
<module>/
├── <module>_service.py     # Public API — the only entry point for other modules
├── types.py                # Pydantic / dataclass DTOs
├── errors.py               # Module-specific exceptions
├── internal/
│   ├── store/
│   │   ├── *_model.py      # MongoDB document model
│   │   └── *_repository.py # Index definitions + collection access
│   ├── *_reader.py         # Read operations
│   ├── *_writer.py         # Write operations
│   └── *_util.py           # Pure helpers (hashing, conversion, …)
└── rest_api/
    ├── *_rest_api_server.py
    ├── *_router.py
    └── *_view.py
```

Request flow: `HTTP → View → Service → Reader/Writer → Repository → MongoDB`

**Rules:**
- **Never** import from another module's `internal/` package. Use `*_service.py` instead.
- **All** business logic belongs in the service layer — not in views or CLI scripts.
- Declare every MongoDB index in `*_repository.py` inside `on_init_collection()`.
- Use Pydantic models / dataclasses for all request/response boundaries; do not pass raw
  `dict` objects across layers.
- Validate at module boundaries; rely on the declared types inside the module.

### Frontend

Request flow: `Page → Component → Context / Hook → Service → API`

**Rules:**
- All API calls go through typed service modules under `services/`.
- Normalize API responses into typed domain models before storing them in state.
- Use React Context + hooks for state; do not introduce Redux without team approval.
- Use Tailwind utility classes only — no inline styles, no ad-hoc `style={{…}}`.
- Build reusable component variants; avoid per-page style overrides.
- Never fire N network calls inside a render loop — batch requests.

---

## Code Quality Rules

### General

1. **Comments capture intent** — explain *why*, not *what*.
2. **Names communicate purpose** — `load_account()` beats `do_thing()`.
   - Python: `snake_case` functions/variables, `PascalCase` classes (PEP 8).
   - TypeScript: `camelCase` functions/variables, `PascalCase` components/types.
3. **Single responsibility** — keep functions under ~50 lines; extract helpers.
4. **No defensive `None` checks without reason** — understand nullability; validate at
   boundaries and trust types inside.
5. **Reuse before writing** — audit existing modules and hooks first.
6. **Encapsulation over utilities** — put behavior in the module it belongs to, not in a
   shared `utils.py` dumping ground.

### Backend-Specific

7. **N+1 prevention** — batch lookups or use aggregation pipelines; never query inside a
   loop over a result set.
8. **RESTful API design** — `GET / POST / PATCH / DELETE` on resource nouns; one `update`
   method per resource accepting a DTO.
9. **Background jobs** — use Celery workers in `modules/application/workers/`; inherit
   from `Worker`; use `cron_schedule` for recurring tasks.
10. **Index every query** — every `find`, `find_one`, `$match`, or `sort` must be backed
    by an index declared in the repository.

### Frontend-Specific

11. **No inline styles** — use Tailwind classes or CSS modules.
12. **Typed API responses** — convert JSON to domain types in the service layer before
    any component touches the data.
13. **Hook-based side effects** — never perform data fetching outside of `useEffect` or
    custom hooks.

---

## Security

- **Never** log, return, or echo PII.
- **Never** commit secrets — use Doppler; reference values via `custom-environment-variables.yml`.
- Wrap all protected routes with authentication/authorization middleware (Flask decorators
  or blueprint guards).
- Use parameterized MongoDB queries — never interpolate user input into query strings.
- Validate and sanitize every incoming payload with Pydantic models.

---

## Testing

- Add or update pytest tests for every new endpoint or service change.
- Tests live under `tests/modules/<module>/` mirroring the backend structure.
- Each test gets a fresh collection — no mocking of DB operations.
- Target **≥ 60 % coverage** (80 % preferred).
- Name test methods in `snake_case`; test classes inherit from the relevant base fixture.

---

## Commit & PR Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>
```

`<scope>` is optional. Subject is imperative, present tense, max 50 characters.

| Type         | When to use                              |
| ------------ | ---------------------------------------- |
| `feat`       | New feature                              |
| `fix`        | Bug fix                                  |
| `docs`       | Documentation only                       |
| `style`      | Formatting, no logic change              |
| `refactor`   | Code restructuring, no behaviour change  |
| `test`       | Adding or updating tests                 |
| `chore`      | Maintenance / housekeeping               |
| `build`      | Build system or dependency changes       |
| `ci`         | CI/CD configuration                      |
| `perf`       | Performance improvement                  |
| `revert`     | Reverts a previous commit                |

Breaking changes: append `!` after type — e.g. `feat(api)!: remove deprecated endpoint`.

### Pull Requests

- One logical change per PR.
- PR title follows the same `<type>(<scope>): <subject>` convention (drives auto-labelling
  and semver bumps).
- Include test coverage for every changed code path.
- Ensure `npm run lint` and `npm run test` pass locally before pushing.

---

## Adding a New Backend Module

1. Create `src/apps/backend/modules/<name>/` following the folder template above.
2. Implement `<name>_service.py` (public API), `types.py`, and `errors.py` first.
3. Add the repository with all required indexes in `internal/store/<name>_repository.py`.
4. Wire up the blueprint in the application bootstrap.
5. Add tests under `tests/modules/<name>/`.
6. Do **not** import from `internal/` outside the module itself.

---

## Adding a New Frontend Feature

1. Define the API contract in a typed service module under `services/`.
2. Build components under `components/` (shared) or `pages/` (page-specific).
3. Manage state with a Context or hook; keep components presentational where possible.
4. Style exclusively with Tailwind utility classes.
5. Export domain types from `types/`.

---

## Further Reading

- [Backend Architecture](docs/backend-architecture.md)
- [Frontend Architecture](docs/frontend-architecture.md)
- [Testing](docs/testing.md)
- [Secrets / Doppler](docs/secrets.md)
- [Workers](docs/workers.md)
- [Deployment / CI-CD](docs/deployment.md)
- [Code Formatting](docs/code-formatting.md)
- [Engineering Handbook](https://github.com/jalantechnologies/handbook/blob/main/engineering/index.md)
