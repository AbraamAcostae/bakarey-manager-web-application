# BakeryManager Frontend

Frontend web application for bakery operations management, focused on day-to-day workflows for inventory, production, and monitoring.

Maintained by Abraam Acosta.

## Features

- Authentication module (sign in / sign up)
- Production module (batches, branches, equipment)
- Inventory module (items, stock movement, reports)
- Monitoring module (dashboard, incidents, alerts)
- Internationalization (English and Spanish)
- Modular architecture by bounded context (`iam`, `production`, `inventory`, `monitoring`, `shared`)

## Tech Stack

- Angular 21 (standalone components)
- Angular Material
- RxJS
- ngx-translate
- TypeScript 5

## Project Structure

```text
src/app/
	iam/
	production/
	inventory/
	monitoring/
	shared/
```

## Requirements

- Node.js 22+
- npm 11+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

3. Open in browser:

```text
http://localhost:4200
```

## Available Scripts

- `npm run start`: Angular dev server
- `npm run dev`: Angular dev server with development configuration
- `npm run mock`: Starts local mock backend with json-server on port 3000
- `npm run build`: Production build
- `npm run watch`: Build in watch mode
- `npm run test`: Unit tests

## Test Data (Mock)

This repository includes local test data in `server/db.json`.

### Test Credentials

- Username: `admin@bakery.com`
- Password: `12345678`
- Mock token: `fake-jwt-token-bakery-2026`

### Included Mock Collections

- `users` (1)
- `authentication` (1)
- `ingredients` (15)
- `sensors` (8)
- `incidents` (4)
- `alerts` (4)
- `products` (5)
- `productionLines` (5)
- `productionBatches` (5)

### Run Mock Backend

From the project root:

```bash
npm run mock
```

Base URL exposed by the mock server:

```text
http://localhost:3000/api/v1
```

Route mapping is configured in `server/routes.json`.

## Environment

Environment settings are in:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

These files contain API base URLs and endpoint paths used by the app.

## Notes

- This repository is intended as a personal portfolio project.
- If backend services are unavailable, some sections may not return live data.

## License

MIT License. See `LICENSE.md`.
