# Nexora storefront — engineering notes

Premium laptop & technology e-commerce storefront. React + Vite client, Express + SQLite API,
shipped as a development environment through `docker-compose.base44.yml`.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d
docker compose -f docker-compose.base44.yml ps
curl -s http://localhost:3000/api/health      # {"ok":true,"products":34}
```

The storefront is served on host port **3000**; the API listens on port 5000 inside the
Compose network only. The browser always talks to port 3000 and Vite proxies `/api` to
`http://api:5000`, which keeps auth cookies first-party (single-origin wiring — no CORS).

### Services

| Service | Role |
| --- | --- |
| `deps` | One-shot installer. Runs `npm install` into the `node_modules` volume when `package.json`/`package-lock.json` change (hash marker in `node_modules/.deps-hash`). |
| `web` | `vite --host 0.0.0.0 --port 5173`, source bind-mounted, polling watcher on. |
| `api` | `node --experimental-sqlite --watch server/index.js`, restarts on server file changes. |

Volumes: `node_modules` (installed deps, never inside the source tree) and `dbdata`
(SQLite database at `/data/nexora.db`).

## Stack notes

- **SQLite** uses Node 22's built-in `node:sqlite` (hence the `--experimental-sqlite` flag).
  No native module compilation, no build tools in the image.
- **Schema + seed** live in `server/db.js` / `server/seed.js`. The seed is idempotent and only
  runs when the `products` table is empty, so editing code never duplicates data.
- **Auth** is a signed JWT in an httpOnly, same-site cookie (`nexora_session`); passwords are
  bcrypt-hashed. `JWT_SECRET` comes from `.env.base44-defaults` and is overridden by
  `/run/base44/app.env` when the platform supplies one.
- **Cart / wishlist / comparison** are client state persisted in `localStorage`
  (`nexora.cart`, `nexora.wishlist`, `nexora.compare`). Orders, reviews, newsletter sign-ups,
  contact messages, products and users are persisted server-side.
- **Currency switcher** converts display only (base prices are USD); switching remounts the
  route tree so every formatted price updates.

## Seeded accounts

- Administrator: `admin@nexora.pk` / `Admin@1234`
- Customer: `demo@nexora.pk` / `Demo@1234` (has one delivered demo order)

Coupons: `SAVE10` (10%), `NEXORA15` (15%).

## Verifying changes

```bash
curl -s http://localhost:3000/api/products?limit=1          # catalog
curl -s -c /tmp/cj -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@nexora.pk","password":"Admin@1234"}'  # auth
curl -s -b /tmp/cj http://localhost:3000/api/admin/stats    # admin-only (403 for customers)
```

Reset the catalogue by removing the data volume:
`docker compose -f docker-compose.base44.yml down -v` (destroys orders too).

## Preview-environment overrides

Only one, in `vite.config.js`: when `BASE44_PREVIEW_MODE === "1"`, the Vite dev server's
`allowedHosts` gains the `.$BASE44_SANDBOX_HOST_DOMAIN` wildcard because the preview proxy
forwards `Host: <port>-<sandbox id>.e2b.app` and the sandbox id rotates. With the flag unset,
`allowedHosts` stays `undefined` and Vite behaves as usual. `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`
is passed through from the platform as well. No auth, CSRF or cookie behaviour is altered
for the preview.

## Imagery

`public/images/*.jpg` are openly licensed Unsplash photographs downloaded locally so the
storefront does not depend on a third-party image host at runtime.
