# NexCart Frontend (Customer)

Next.js storefront for browsing, cart, checkout, orders, wishlist, and vendor applications (“Sell on NexCart”).

## Stack

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **TanStack Query** + axios
- **Zustand**, React Hook Form

## Prerequisites

- Node.js **≥ 20** (recommended; matches monorepo apps)
- [NexCart API](../../backend/nexCart-backend/README.md) running (default `http://localhost:4000`)

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

### Environment (optional)

Create `.env.local` if you need overrides:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
# Optional: canonical site URL for metadata and links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

If unset, the app defaults to `http://localhost:4000/api`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |

## Main routes

| Area | Routes |
|------|--------|
| Home & catalog | `/`, `/products`, `/products/[slug]`, `/categories`, `/deals`, `/new-arrivals` |
| Stores | `/stores`, `/stores/[slug]` |
| Cart & checkout | `/cart`, `/checkout`, `/checkout/result` |
| Account | `/login`, `/register`, `/account`, `/orders`, `/orders/[orderId]`, `/track-order` |
| Lists | `/wishlist`, `/recently-viewed` |
| Sell | `/sell`, `/sell/guide`, `/sell/fees` |
| Trust & help | `/help`, `/contact`, `/returns`, `/privacy`, `/terms`, `/cookies` |
| Moderation (signed-in) | `/reports` |

## Project layout

```
src/
  app/              App Router pages and layouts
  components/       Shared UI
  features/         Domain modules (auth, cart, checkout, …)
  lib/              API client, auth helpers, site config
```

Server components use `src/lib/api/server.ts` for API calls; client code uses `src/lib/api/client.ts`.

## Related apps

- **Admin:** [nexCart-admin](../nexCart-admin/README.md) — http://localhost:5174
- **Vendor:** [nexCart-vendor](../nexCart-vendor/README.md) — http://localhost:5175

## Add UI components

```bash
npx shadcn@latest add button
```