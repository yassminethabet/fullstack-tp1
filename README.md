# Full Stack Product Catalogue

Product catalogue with a REST API (Express + Prisma + PostgreSQL) and two front-ends (Angular + Bootstrap, Next.js + Tailwind CSS).

| Part | Stack | Port |
|------|-------|------|
| `api/` | Node.js, Express 5, Prisma 7, PostgreSQL 17, Zod | 4000 |
| `ngapp/` | Angular + Bootstrap | 4200 |
| `nxapp/` | Next.js + Tailwind CSS | 3000 |
| `db` | PostgreSQL (Docker) | 5432 |

## Features
- Product list with pagination, search (`q`) and category filter
- Product detail page
- Admin page: create, edit, delete products
- Reviews per product (`Review` model)
- Validation (Zod) and central error handling

## Prerequisites
- Node.js 24 LTS
- Docker Desktop

## Run with Docker (everything)
```bash
docker compose up --build
```
- Angular: http://localhost:4200
- Next.js: http://localhost:3000
- API: http://localhost:4000/api/health

Stop (keeps the data): `docker compose down`
Stop and delete the database: `docker compose down -v`

## Run without Docker (development)

1. Start the database:
   ```bash
   docker compose up -d db
   ```
2. API:
   ```bash
   cd api
   copy .env.example .env
   npm install
   npx prisma migrate deploy
   npx prisma generate
   npx prisma db seed
   npm run dev
   ```
3. Angular:
   ```bash
   cd ngapp
   npm install
   npx ng serve
   ```
4. Next.js:
   ```bash
   cd nxapp
   copy .env.example .env.local
   npm install
   npm run dev
   ```

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `api/.env` | PostgreSQL connection string |
| `PORT` | `api/.env` | API port (default 4000) |
| `API_URL` | `nxapp/.env.local` | API URL used by Next.js server components |
| `NEXT_PUBLIC_API_URL` | `nxapp/.env.local` | API URL used by the browser |

Angular reads the API URL from `ngapp/src/environments/environment.ts`.

## API endpoints

| Method | URL | Description | Success |
|--------|-----|-------------|---------|
| GET | `/api/health` | Health check | 200 |
| GET | `/api/products?limit=12&skip=0&q=&category=` | List with pagination, search, filter | 200 |
| GET | `/api/products/:id` | One product | 200 |
| POST | `/api/products` | Create a product | 201 |
| PATCH | `/api/products/:id` | Update a product | 200 |
| DELETE | `/api/products/:id` | Delete a product | 204 |
| GET | `/api/products/:id/reviews` | List reviews of a product | 200 |
| POST | `/api/products/:id/reviews` | Add a review | 201 |
| GET | `/api/categories` | Categories with product count | 200 |

Errors: `400` validation failed, `404` not found, `500` server error.
Example requests: `api/requests.http` (VS Code REST Client extension).

## Docker Hub images
- `yasminethabet/ngapp:2.0`
- `yasminethabet/nxapp:2.0`
- `yasminethabet/api:1.0`