# FarmConnect API

The API follows `routes -> middleware -> controllers -> services -> models -> MongoDB`.

## Run

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Run `npm run server`.
3. Run `npm run dev` in a second terminal.

The server exposes `/health` and REST resources under `/api`. Protected routes accept an httpOnly `accessToken` cookie or a Bearer token. Admin routes require the `ADMIN` role; seller routes require `SELLER` or `ADMIN`.
