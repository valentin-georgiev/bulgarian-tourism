# Bulgarian Tourism

Open-source portfolio project showcasing 5,000+ tourist destinations in Bulgaria. Built with Next.js 16, TypeScript, Supabase/PostGIS, and interactive maps.

## Features

- **9 categories** — Mountains, Lakes, Caves, Cities, Fishing, Trails, Beaches, Museums, Hiking
- **Bilingual** — English (`/en/`) and Bulgarian (`/bg/`) with next-intl
- **Interactive map** — Leaflet with clustered markers, category filters, slide-in detail panel
- **REST API** — `/api/places`, `/api/places/:id`, `/api/search` with pagination, filtering, bbox
- **Full-text search** — PostGIS-powered English stemming + Bulgarian ILIKE
- **Nearby places** — PostGIS `ST_DWithin` queries (50 km radius)
- **Dark mode** — Toggle with localStorage persistence, no flash on reload
- **Mobile responsive** — Hamburger menu, glassmorphism cards, staggered animations
- **SEO** — Dynamic metadata, sitemap.xml, robots.txt, Open Graph images
- **Security** — Row Level Security, server-only DB access, no client-side keys

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16 App Router                 |
| Language  | TypeScript (strict)                   |
| Styling   | Tailwind CSS v4 + SCSS                |
| Database  | Supabase (PostgreSQL + PostGIS)       |
| i18n      | next-intl                             |
| Map       | react-leaflet + leaflet.markercluster |
| Icons     | lucide-react                          |
| Linting   | ESLint + Prettier                     |

## Architecture

```
app/
  layout.tsx                    Root layout (dark mode script)
  robots.ts                     Crawler directives
  sitemap.ts                    Dynamic XML sitemap
  [locale]/
    layout.tsx                  Locale layout (Navbar + Footer)
    page.tsx                    Home (hero + category grid)
    places/
      page.tsx                  Browse list (filters, pagination)
      [slug]/page.tsx           Place detail (SSG, nearby places)
    map/
      page.tsx                  Server data fetch
      MapClient.tsx             Interactive map (client)
  api/
    places/route.ts             GET /api/places
    places/[id]/route.ts        GET /api/places/:id
    search/route.ts             GET /api/search

components/
  layout/   Navbar, Footer, MobileMenu
  places/   PlaceCard, PlaceGrid, PlaceFilters, NearbyPlaces
  map/      MapView, MapFilters, PlacePanel
  ui/       Badge, Skeleton, ThemeToggle

constants/  categories.ts, categoryStyles.ts
types/      place.ts, map.ts, components.ts
lib/        supabase/server.ts, api.ts, parseWkb.ts
```

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project with PostGIS enabled

### Setup

```bash
git clone https://github.com/your-username/bulgarian-tourism.git
cd bulgarian-tourism
cp .env.example .env
```

Fill in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Install & Run

```bash
npm install
npm run dev
```

### Seed the Database

Run all migrations in `supabase/migrations/` via the Supabase SQL Editor, then:

```bash
npx tsx scripts/seed.ts
```

### Build

```bash
npm run build
npm run start
```

## API

### `GET /api/places`

Query params: `category`, `region`, `bbox` (south,west,north,east), `page`, `limit`

```bash
curl /api/places?category=cave&limit=5
```

### `GET /api/places/:id`

Accepts UUID or slug. Returns place + nearby suggestions.

```bash
curl /api/places/vladaya-cherni-vrh-531793
```

### `GET /api/search?q=...`

Full-text search with optional `category` and `limit` params.

```bash
curl /api/search?q=rila
```

## Database

PostgreSQL + PostGIS on Supabase. Key table: `places`.

| Column                       | Type             | Notes                      |
| ---------------------------- | ---------------- | -------------------------- |
| id                           | uuid             | Primary key                |
| name / name_bg               | text             | Bilingual names            |
| slug                         | text             | URL-friendly identifier    |
| category                     | text             | 9 categories (constrained) |
| region / region_bg           | text             | Bulgarian oblast           |
| description / description_bg | text             | Bilingual descriptions     |
| image_url                    | text             | Wikimedia Commons          |
| location                     | geography(Point) | PostGIS for geo queries    |
| elevation_m                  | int              | For peaks                  |

**Migrations** (in `supabase/migrations/`):

1. `001` — Initial schema + PostGIS indexes
2. `002-005` — Category expansions, region_bg, schema refinement
3. `006` — `nearby_places()` RPC
4. `007` — `get_map_places()` RPC
5. `008` — `search_places()` RPC (full-text)
6. `009` — Row Level Security (read-only for anon)

## Data Sources

All data is sourced from open, free APIs:

- **OpenStreetMap** via Overpass API — place coordinates, names, categories
- **Wikidata** SPARQL — descriptions, images, elevation, regions
- **Wikimedia Commons** — CC-licensed photos

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import in Vercel
3. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy

## License

MIT
