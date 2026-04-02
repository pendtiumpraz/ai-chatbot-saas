# Privasimu Configuration Reference

The Privasimu application is controlled using the `.env` file for all backend and frontend settings. This document describes the environment variables required to run the dockerized environment successfully.

### System Control Commands

The `COMPOSE_PROJECT_NAME` specifies the prefix for all docker networks and containers created.
```bash
COMPOSE_PROJECT_NAME=privasimu
```

---

## 1. Database Variables

The database is built using MySQL 8.0. Set strong passwords for both variables to prevent database injection.

| Variable Name | Default Value | Description |
|-----------|---------|---------|
| `DB_DATABASE` | `privasimu` | Name of the default application database context. |
| `DB_USERNAME` | `privasimu_user` | General application connection username. |
| `DB_PASSWORD` | `secret` | Application connection password. |
| `DB_ROOT_PASSWORD` | `secret_root` | Database admin root password. Required once for volume creation phase. |

## 2. Platform Core Variables

| Variable Name | Default Value | Description |
|-----------|---------|---------|
| `APP_NAME` | `Privasimu` | The string naming root structure |
| `APP_ENV` | `production` | Ensures features, debugging tools and exception traces are hidden from public. |
| `APP_DEBUG` | `false` | Must be explicitly false in production bounds. |
| `APP_URL` | `http://localhost:8000` | Important for generating absolute URLs (password resets, notifications). |

## 3. JWT and Authentication

| Variable Name | Command Generator | Description |
|-----------|---------|---------|
| `JWT_SECRET` | `artisan jwt:secret` | A 64-character signing secret. Essential for API tokens. |
| `APP_KEY` | `artisan key:generate` | Encryption key for securing sessions, cookies, and models. |

## 4. Cache & Queue Services

Redis operates the Queue (for AI data extraction, mass mailing, and large DB background scan tasks).

```bash
REDIS_HOST=redis
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

## 5. API Connectivity

#### Target Endpoints
The frontend environment will be mapped differently based on Docker networking. Ensure the trailing slash logic remains strict:
```bash
NEXT_PUBLIC_API_URL=/api
```
This forces all React requests to traverse via Node container → Nginx Router Proxy → Laravel backend container on port 8000 safely.

## 6. Integrations & Third Party
If you want to use the AI Generation tools, PII Auto-Tagger AI, or Context Extractors, supply an OpenAI and/or Anthropic API key here.

```bash
ENABLE_AI_FEATURES=true
OPENAI_API_KEY=sk-xxxxxx...
ANTHROPIC_API_KEY=sk-ant-xxxxxx...
```
