# Product Catalogue: Angular and Next.js

Product catalogue built with two front-end stacks, using the public API https://dummyjson.com/products.

| App | Stack | Local port | Docker image |
|-----|-------|------------|--------------|
| `ngapp/` | Angular + Bootstrap | 4200 | `yasminethabet/ngapp:1.0` |
| `nxapp/` | Next.js + Tailwind CSS | 3000 | `yasminethabet/nxapp:1.0` |

## Run locally

### Angular
```bash
cd ngapp
npm install
npx ng serve
```
Open http://localhost:4200

### Next.js
```bash
cd nxapp
npm install
npm run dev
```
Open http://localhost:3000

## Run with Docker

### Angular
```bash
cd ngapp
docker build -t yasminethabet/ngapp:1.0 .
docker run -p 8080:80 yasminethabet/ngapp:1.0
```
Open http://localhost:8080

### Next.js
```bash
cd nxapp
docker build -t yasminethabet/nxapp:1.0 .
docker run -p 3001:3000 yasminethabet/nxapp:1.0
```
Open http://localhost:3001

## Docker Hub images
- https://hub.docker.com/r/yasminethabet/ngapp
- https://hub.docker.com/r/yasminethabet/nxapp

## Screenshots
See the `screenshots/` folder.