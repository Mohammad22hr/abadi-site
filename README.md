# Abadi Website

Frontend (React + Vite) and backend (Express + PostgreSQL) for `al-abbadi.com`.

## Local Development

1. Install root dependencies:
   - `npm install`
2. Install server dependencies:
   - `cd server && npm install && cd ..`
3. Copy and configure env:
   - copy `server/.env.example` to `server/.env`
   - set correct DB and admin values
4. Run frontend + backend:
   - `npm run dev:all`

## Production Hosting

This project is ready for single-host deployment:
- backend serves API routes under `/api/*`
- backend also serves built frontend (`dist`) at `/`

### Steps

1. Install dependencies:
   - `npm install`
   - `cd server && npm install && cd ..`
2. Configure `server/.env` (use `server/.env.example` as template).
3. Build frontend:
   - `npm run build:prod`
4. Start server:
   - `npm start`

## Required Environment Variables (`server/.env`)

- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`
- `ALLOWED_ORIGINS` (comma-separated domains)
- `NODE_ENV=production` in production

## Security Notes

- Never commit real `.env` credentials.
- Use a long random `ADMIN_JWT_SECRET`.
- Use strong admin password.
- Keep `ALLOW_INSECURE_DEFAULTS=false` in production.
