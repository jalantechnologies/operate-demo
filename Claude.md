# Claude.md — AI Agent Guide for operate-demo

This file provides Claude (and other AI coding agents) with the context, conventions, and constraints needed to work effectively inside this repository. Read it before writing any code, proposing any change, or answering any question about the codebase.

---

## Project Overview

**operate-demo** is a full-stack application that pairs a modular Flask backend with a React + TypeScript frontend.

| Layer | Technology |
|---|---|
| Backend | Python 3.12 · Flask 3 · PyMongo · Pydantic · Celery |
| Frontend | React 18 · TypeScript · Tailwind CSS · Axios |
| Infrastructure | MongoDB · Redis |
| Build Tooling | Webpack 5 · Pipenv · npm scripts |
| Testing | Pytest + pytest-cov |
| Deployment | Docker · Kubernetes |

---

## Key Directories

```
src/apps/backend/   – Flask application and domain modules
src/apps/frontend/  – React single-page application
tests/              – Backend test suite (pytest)
docs/               – Architecture and operational documentation
config/             – Shared configuration and environment settings
```

---

## How to Run Things

```bash
npm run serve           # Start everything (backend + workers + frontend)
npm run serve:backend   # Flask API only (Gunicorn + reload)
npm run serve:worker    # Celery workers only
npm run serve:beat      # Celery beat scheduler (cron jobs)
npm run serve:flower    # Flower worker dashboard (localhost:5555)
npm run serve:frontend  # React dev server with hot reload

npm run build           # Production build (backend assets + frontend)
npm run test            # Backend test suite with coverage
npm run lint:py         # mypy + pylint
npm run lint:ts         # ESLint
npm run lint:md         # Markdown linting (remark)
```

Bootstrap: `pipenv install --dev` (from `src/apps/backend`) and `npm install`.

---

## Architecture Principles

### Backend

- **Modular design:** every domain (account, task, notification, etc.) lives under `src/apps/backend/modules/` and owns its own REST layer, service, and persistence.
- **Strict layering:** HTTP (Flask blueprint) → View → Service → Reader/Writer → Repository → MongoDB. Never skip or bypass a layer.
- **Encapsulation:** expose only `*_service.py`, `types.py`, and module-level exceptions. Everything under `internal/` is private — never import from another module's `internal/`.
- **Data validation at boundaries:** use Pydantic models for all request/response payloads; trust types internally after validation.

### Frontend

- **Layer-based:** Pages → Components → Contexts → Services.
- **State management:** React Context + hooks. Do not introduce Redux or similar without team approval.
- **Service layer:** all API calls go through typed service modules under `services/` that convert JSON into typed domain models.

---

## Best Practices

### General

1. **Write intentional comments.** Capture *why*, not *what*. Never narrate what the code already says.
2. **Name things clearly.** PEP 8 for Python (`snake_case` functions/variables, `PascalCase` classes). Idiomatic TypeScript elsewhere. Avoid verb-based class names; functions and hooks *should* be verbs (`load_account`, `fetchUserData`).
3. **Keep functions small and focused.** Single responsibility. Break anything past ~50 lines or that mixes concerns.
4. **Validate at boundaries, trust inside.** Use Pydantic models or request schemas at the module edge; avoid defensive `None`-checks deep inside business logic.
5. **Reuse before you create.** Search existing modules, services, and hooks before writing new ones. Extract shared logic; never copy-paste it.
6. **Encapsulate over generalise.** Put behavior in the module that owns the data, not in a broad `utils/` catch-all.

### Backend

7. **Module independence.** Never import from `internal/` of another module. Use the public `*_service.py` API.
8. **Index every query.** Every `find`, `find_one`, `$match`, or `sort` must be covered by a MongoDB index declared in the repository layer (`internal/store/*_repository.py`).
9. **RESTful API design.** CRUD on resource nouns with `GET`, `POST`, `PATCH`, `DELETE`. One `update` method per resource accepting a well-defined DTO.
10. **Business logic belongs in services.** Never embed domain rules inside Flask views or CLI scripts.
11. **Background jobs via Celery.** Async work goes in workers under `modules/application/workers/`. Use `cron_schedule` for recurring tasks.
12. **Eliminate N+1 queries.** Batch lookups or use aggregation pipelines. Push filtering into Mongo; avoid in-memory post-processing of large result sets.

### Frontend

13. **No inline styles.** Use Tailwind utility classes or shared CSS modules exclusively.
14. **Component variants over per-page overrides.** Add props/variants to shared components; don't scatter page-specific style hacks.
15. **Fetch through services.** Data fetching lives in `services/` or `api/`. Normalise API responses into typed models before storing in state.
16. **No N network calls inside a render loop.** Batch API requests when rendering collections.
17. **No side effects outside hooks.** Never perform async data fetching directly inside a component's render body.

---

## Security Requirements

- **Never log or expose PII.**
- **Protect all routes** with authentication/authorisation middleware (Flask decorators or blueprints).
- **Sanitise all inputs.** Use Pydantic for request bodies and query params.
- **Parameterise all Mongo queries.** Never build query strings from raw user input.
- **Secrets in environment variables or Doppler.** Never commit credentials or secret values.

---

## Testing Requirements

- Add or update pytest tests for every new or modified backend endpoint and service under `tests/modules/<module>/`.
- Target ≥ 60% coverage; 80% preferred.
- Run with `npm run test` (pytest with coverage reporting).

---

## Commit & PR Guidelines

### Commit message format

```
<type>(<scope>): <subject>
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `build` · `ci` · `perf` · `revert`

**Rules:**
- Subject ≤ 50 characters, imperative present tense ("add", not "added").
- Optional scope = component or module affected.
- Breaking changes: append `!` after the type (e.g. `feat(api)!: remove deprecated endpoint`).

### PR checklist

- [ ] All lint checks pass (`npm run lint`).
- [ ] All tests pass and coverage thresholds are met (`npm run test`).
- [ ] New endpoints/services have corresponding tests.
- [ ] No secrets, credentials, or PII in the diff.
- [ ] Commit messages follow the format above.
- [ ] PR description explains *what* changed and *why*.

---

## What Claude Should Never Do

- **Do not skip layers.** Never let a Flask view talk directly to the database.
- **Do not import across module internals.** `internal/` is private to its owning module.
- **Do not invent dependencies.** Check `Pipfile` and `package.json` before assuming a library is available.
- **Do not guess behaviour.** Use `cat`, `grep`, and `git log` to verify actual code before drawing conclusions.
- **Do not commit secrets** or environment-specific values.
- **Do not modify `Claude.md` itself** unless explicitly asked to by a human engineer.
