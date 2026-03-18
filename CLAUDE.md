# CLAUDE.md — Contributor Guide for operate-demo

This file is the single reference for AI agents (Claude, Codex, Copilot, etc.) and human contributors working on **operate-demo**. Read it before making any change.

---

## Project Overview

**operate-demo** is a full-stack demo application that runs alongside [Operate](https://github.com/jalantechnologies/operate). It shows how Operate integrates as a sidecar — nginx proxies `/operate` traffic to the Operate service while the app itself is served at `/`.

| Layer          | Technology                                                |
| -------------- | --------------------------------------------------------- |
| Backend        | Python 3.12 · Flask 3 · PyMongo · Pydantic v2 · Celery 5 |
| Frontend       | React 18 · TypeScript · Tailwind CSS 3 · Webpack 5        |
| Data / Broker  | MongoDB 5 · Redis 7                                       |
| Infrastructure | Docker · Kubernetes · Nginx                               |

Key directories:

```
src/apps/backend/       # Flask API + domain modules
src/apps/frontend/      # React SPA
tests/                  # Backend pytest suite
config/                 # Environment-specific YAML configs
docs/                   # Architecture and operational docs
```

---

## Quick-Start Commands

```bash
# Docker (recommended — runs operate-demo + operate together)
docker compose -f docker-compose.dev.yml up --build

# Locally without Docker
npm install
pipenv install --dev          # run from repo root
redis-server &                # Redis must be running
npm run serve                 # starts backend + frontend + workers + beat + flower
```

Individual services:

```bash
npm run serve:backend         # Flask/Gunicorn only (hot reload)
npm run serve:worker          # Celery worker only
npm run serve:beat            # Celery beat scheduler only
npm run serve:flower          # Flower monitoring UI at localhost:5555
npm run serve:frontend        # Webpack dev server only
```

Default ports (local, no Docker):

| Service | URL                       |
| ------- | ------------------------- |
| App     | http://localhost:3000     |
| Backend | http://localhost:8080     |
| Flower  | http://localhost:5555     |
| MongoDB | mongodb://localhost:27017 |
| Redis   | localhost:6379            |

---

## Build, Lint, Test, Format

```bash
npm run build          # Production build
npm run lint           # Lint everything (Python + TypeScript + Markdown)
npm run lint:py        # mypy + pylint (cyclic-import check)
npm run lint:ts        # ESLint + Prettier check
npm run lint:md        # Remark markdown lint
npm run fmt            # Auto-format everything
npm run fmt:py         # autoflake → isort → black (src/ + tests/)
npm run fmt:ts         # Prettier (JS/TS/JSON)
npm run test           # pytest with coverage (requires MongoDB + Redis)
```

Run tests in Docker to avoid environment issues:

```bash
docker compose -f docker-compose.test.yml up --build
```

Coverage target: **≥ 60 %** (80 % preferred). Coverage is reported to SonarQube on every CI run.

---

## Architecture Principles

### Backend

The backend follows a strict **layered, modular** structure. Every domain lives under `src/apps/backend/modules/<module_name>/`.

```
<module>/
├── <module>_service.py         # Public API — the ONLY file other modules may import
├── types.py                    # Pydantic / dataclass DTOs
├── errors.py                   # AppError subclasses with HTTP status + error code
├── internal/                   # Private implementation — never import from outside
│   ├── store/
│   │   ├── *_model.py          # @dataclass extending BaseModel; from_bson(), get_collection_name()
│   │   └── *_repository.py     # ApplicationRepository subclass; indexes declared here
│   ├── *_reader.py             # High-level read operations (find_one, aggregations)
│   ├── *_writer.py             # High-level write operations (insert, update)
│   └── *_util.py               # Conversion, hashing, validation helpers
└── rest_api/
    ├── *_rest_api_server.py    # Creates Flask Blueprint
    ├── *_router.py             # Registers URL rules
    └── *_view.py               # Request/response handling; delegates to service
```

Runtime flow: **HTTP → View → Service → Reader/Writer → Repository → MongoDB**

Rules:
- **Never skip or bypass a layer.** Flask views must not talk directly to the database.
- **Never import from another module's `internal/`** — call its `*_service.py` instead.
- Business logic belongs in the service layer, not in views or CLI scripts.
- Validate inputs at module boundaries using Pydantic models; trust types after that.
- Declare all MongoDB indexes in `*_repository.py → on_init_collection()`. Every `find`, `find_one`, `$match`, and `sort` must be covered.
- Guard against N+1 queries — batch lookups or use aggregation pipelines.
- Use parameterized Mongo queries. Never build raw query strings from user input.
- Favor RESTful CRUD semantics: `GET / POST / PATCH / DELETE` on resource nouns.
- Provide a single `update` method per resource accepting a well-defined DTO.

### Frontend

Layer flow: **Pages → Components → Contexts → Services → HTTP**

```
src/apps/frontend/
├── components/     # Reusable, stateless UI primitives and layouts
├── pages/          # Thin orchestration layers — compose components, call contexts
├── contexts/       # Global state providers (auth, account, etc.)
├── services/       # All HTTP calls; converts JSON → typed domain models
├── routes/         # Public + protected route definitions
├── constants/      # Canonical route paths, endpoints, shared constants
└── types/          # Shared DTOs and type helpers
```

Rules:
- All API calls go through `services/` — no raw `fetch`/`axios` calls in pages or components.
- Normalize API responses into typed models before storing in state.
- Use React Context + hooks for state. Do not introduce Redux-like solutions without team approval.
- Do not use inline styles — use Tailwind utility classes.
- Create component variants/props instead of per-page style overrides.
- Never fire N network calls for N items in a render loop — batch requests.
- Never perform side-effectful data fetching directly inside a render body — use hooks.
- Shared primitives live in `components/` or `layouts/`, not in page folders.

---

## Tech-Stack Best Practices

### Pydantic v2

- Use `model_validate(data)` — not the v1 `.parse_obj(data)`.
- Use `model_dump()` — not the v1 `.dict()`.
- Use `model_validate_json(raw_json)` when deserializing raw JSON strings.
- Define `model_config = ConfigDict(populate_by_name=True)` when accepting both camelCase and snake_case fields.
- Use `Field(alias="camelCaseName")` to bridge frontend camelCase payloads to Python snake_case models.

### Flask 3

- Flask 3 supports async view functions natively — prefer sync unless the route is truly I/O-bound and benchmarked.
- Register per-Blueprint error handlers for domain-specific HTTP errors; register global handlers on the app for unhandled exceptions.
- Use `flask.g` for request-scoped state (e.g., authenticated user). Do not store request state in module-level globals.
- Always return a typed `Response` or a `(body, status_code)` tuple from views — never return a bare dict without an explicit status code.

### React 18

- Use `createRoot` from `react-dom/client` — `ReactDOM.render` is removed in React 18.
- Use `useId()` to generate stable, SSR-safe IDs for form elements and ARIA attributes.
- Wrap non-urgent state updates in `startTransition()` to keep the UI responsive during heavy re-renders.
- Do not suppress React Strict Mode in development — it intentionally double-invokes effects to surface bugs.

### React Router v6

- Use `useNavigate()` for imperative navigation — `useHistory()` does not exist in v6.
- Use `<Navigate>` (component) instead of `<Redirect>` for declarative redirects.
- Use `<Outlet>` for nested route layouts.
- Define routes in the central `routes/` directory — do not scatter `<Route>` declarations across pages.

### Axios

- Create a single configured Axios instance (base URL, timeout, default headers) in `services/` — do not call `axios.create()` more than once.
- Use request interceptors to inject the auth token; do not pass headers manually on each call.
- Use response interceptors to handle 401 (token expiry) centrally — redirect to login or trigger a token refresh.
- Always set a reasonable `timeout` on the Axios instance to avoid hanging requests.

### Formik + Yup

- Define Yup validation schemas in a separate `*_schema.ts` file, not inline in the component.
- Pass the schema via `validationSchema` on `<Formik>` — do not use `validate` callbacks for rules already expressible in Yup.
- Inject server-side validation errors using `setFieldError` inside the `onSubmit` handler.
- Use `<FastField>` instead of `<Field>` for forms with many fields to avoid unnecessary re-renders.

### TypeScript

- `tsconfig.json` must have `"strict": true` — never weaken compiler strictness.
- Prefer `unknown` over `any` for untyped external data; narrow with type guards before use.
- Use `as const` for enum-like string literals instead of TypeScript `enum` (avoids runtime overhead and module-augmentation pitfalls).
- Avoid non-null assertions (`!`) — handle `null` / `undefined` explicitly.

### Celery 5

- **Tasks must be idempotent.** Celery may re-execute a task after a transient failure; ensure repeated execution produces the same result.
- Raise exceptions (or call `self.retry()`) to signal transient failures — do not silently swallow errors.
- Do not share mutable state between tasks via module-level globals or class attributes — each worker process is independent.
- Use `acks_late = True` on tasks that must not be lost mid-execution (pair with `reject_on_worker_lost = True`).

### Datadog Observability

- Use structured, key=value log entries — prefer `Logger.info(message="...", key=value)` over string interpolation.
- Never log PII (user IDs are acceptable; names, emails, and phone numbers are not).
- Include a correlation or request ID in log records so traces can be linked across services.
- Frontend Datadog RUM is initialised once at app startup — do not re-initialise on route changes.

---

## Background Workers (Celery)

Workers live in `src/apps/backend/modules/application/workers/` and inherit from `Worker`.

```python
from modules.application.worker import Worker
from modules.logger.logger import Logger

class MyWorker(Worker):
    queue = "default"           # "critical" | "default" | "low"
    max_retries = 3
    retry_backoff = True
    cron_schedule = "0 2 * * *" # optional — omit for on-demand workers

    @classmethod
    def perform(cls, **kwargs) -> None:
        Logger.info(message="Starting job")
        # ... logic ...
```

Workers are auto-discovered by `WorkerRegistry` on startup — no manual registration needed. Dispatch jobs with:

```python
MyWorker.perform_async(**kwargs)               # immediate
MyWorker.perform_at(run_time, **kwargs)        # at a specific datetime
MyWorker.perform_in(delay_seconds, **kwargs)   # after a delay
```

---

## Configuration

Config files live in `config/` and are loaded by priority:

1. `custom-environment-variables.yml` — maps env vars / Doppler secrets to config keys (highest priority)
2. `<APP_ENV>.yml` — e.g., `development.yml`, `production.yml`
3. `default.yml` — constants shared across all environments (lowest priority)

Rules:
- If a value varies per deployment → set it to `null` in `default.yml` and define it in the env-specific file.
- If a value is constant everywhere → define it directly in `default.yml`.
- For new secrets, add the mapping to `custom-environment-variables.yml` **and** create the matching key in Doppler for every active environment (preview + production).
- **Never commit secrets** to the repository. Use Doppler or a `.env` file (git-ignored).

---

## Testing

```
tests/
└── modules/
    ├── account/
    ├── application/
    └── …   (mirrors src/apps/backend/modules/)
```

- Use standard pytest discovery (`test_*.py` / `*_test.py`).
- Each test spins up fresh test collections — no DB mocking.
- Test classes inherit from the appropriate `base_test_*.py` fixture.
- Add or update tests for every new endpoint or service method.
- Place integration tests under `tests/modules/<module>/`.

---

## Code Style

### Python

- **PEP 8**: `snake_case` functions/variables, `PascalCase` classes.
- **Formatting**: `autoflake` → `isort` → `black` (run `npm run fmt:py`).
- **Linting**: `mypy` + `pylint` cyclic-import check (run `npm run lint:py`).
- Functions/methods must be verbs (`load_account`, `hash_password`). Class names must be nouns.
- Keep functions ≤ ~50 lines and single-responsibility.
- Never log PII.

### TypeScript / React

- **Naming**: idiomatic TypeScript — `camelCase` variables/functions, `PascalCase` components/classes, `UPPER_SNAKE_CASE` constants.
- **Formatting**: Prettier (run `npm run fmt:ts`).
- **Linting**: ESLint with Airbnb config (run `npm run lint:ts`).
- Hooks must be verbs (`useAccountDetails`). Components must be nouns.

### General

- Write comments that capture **intent or non-obvious decisions** — not what the code already says.
- Audit existing modules before writing new ones. Extract shared logic rather than duplicating.
- Place behavior inside the module that owns it — avoid creating broad utility modules.
- Check `Pipfile` and `package.json` before assuming a library is available. Do not invent dependencies.

---

## Commit Messages

Format: `<type>(<scope>): <subject>` (scope is optional)

```
feat(auth): add OTP retry limit
fix(account): handle missing phone number on update
docs: update worker configuration guide
```

| Type       | When to use                            |
| ---------- | -------------------------------------- |
| `feat`     | New feature for users                  |
| `fix`      | Bug fix for users                      |
| `docs`     | Documentation only                     |
| `style`    | Formatting, no logic change            |
| `refactor` | Code restructuring, no behavior change |
| `test`     | Adding or updating tests               |
| `chore`    | Maintenance tasks                      |
| `build`    | Build system or dependency changes     |
| `ci`       | CI configuration                       |
| `perf`     | Performance improvements               |
| `revert`   | Reverts a previous commit              |

Breaking changes: append `!` after type — `feat(api)!: remove deprecated endpoint`.

Rules:
- Subject line: ≤ 50 characters, present tense, imperative mood, no trailing period.
- Body (optional): wrapped at 72 characters, explains *why* not *what*.
- Reference issues in the footer: `Closes #42`.

---

## Pull Request Guidelines

1. Branch from `main`. Use descriptive branch names: `feat/otp-retry-limit`, `fix/account-update-crash`.
2. Fill in the PR template — include business context and link to the relevant issue/ticket.
3. Self-review your diff before requesting a review.
4. Ensure all CI checks pass (lint, test, build, Trivy security scan, SonarQube).
5. Keep PRs focused — one concern per PR. Split large changes into stacked PRs.
6. Respond to reviewer comments before merging; do not force-push after review begins.

Pre-merge checklist:
- [ ] All lint checks pass (`npm run lint`)
- [ ] All tests pass and coverage thresholds are met (`npm run test`)
- [ ] New endpoints/services have corresponding tests
- [ ] No secrets, credentials, or PII in the diff
- [ ] Commit messages follow the format above
- [ ] PR description explains *what* changed and *why*

---

## Security

- Never log or expose PII.
- Wrap all protected routes in authentication middleware (Flask decorators / blueprints).
- Validate and sanitize all incoming data with Pydantic models at every boundary.
- Use parameterized MongoDB queries — never build raw query strings from user input.
- Keep secrets in Doppler or `.env` (git-ignored). Never commit credentials.
- Security scans run automatically via Trivy on every build. Review `.trivyignore` before suppressing findings.

---

## What AI Agents Must Never Do

- **Do not skip layers.** A Flask view must never talk directly to the database.
- **Do not import across module internals.** `internal/` is private to its owning module.
- **Do not invent dependencies.** Check `Pipfile` and `package.json` before assuming a library is available.
- **Do not guess behaviour.** Use `cat`, `grep`, and `git log` to verify actual code before drawing conclusions.
- **Do not commit secrets** or environment-specific values.
- **Do not modify `CLAUDE.md` itself** unless explicitly asked to by a human engineer.

---

## Further Reading

| Topic                | Document                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Getting started      | `docs/getting-started.md`                                                                            |
| Backend architecture | `docs/backend-architecture.md`                                                                       |
| Frontend architecture| `docs/frontend-architecture.md`                                                                      |
| Configuration        | `docs/configuration.md`                                                                              |
| Secrets (Doppler)    | `docs/secrets.md`                                                                                    |
| Background workers   | `docs/workers.md`                                                                                    |
| Logging              | `docs/logging.md`                                                                                    |
| Scripts              | `docs/scripts.md`                                                                                    |
| Code formatting      | `docs/code-formatting.md`                                                                            |
| CI / CD & deployment | `docs/deployment.md`                                                                                 |
| Bootstrapping        | `docs/bootstrapping.md`                                                                              |
| Running prod scripts | `docs/running-scripts-in-production.md`                                                              |
| Engineering handbook | https://github.com/jalantechnologies/handbook/blob/main/engineering/index.md                        |
