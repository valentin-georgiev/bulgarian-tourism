# Bulgarian Tourism

Open-source portfolio project showcasing tourist destinations in Bulgaria — lakes, mountains, caves, cities, fishing spots, and eco-trails.

Built with Next.js 16 App Router, TypeScript, Supabase/PostGIS, react-leaflet, and next-intl (BG + EN).

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + SCSS
- **Database**: Supabase (PostgreSQL + PostGIS)
- **i18n**: next-intl — Bulgarian (`/bg/`) and English (`/en/`)
- **Map**: react-leaflet + OpenStreetMap
- **Icons**: lucide-react

## Getting Started

```bash
cp .env.example .env
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

npm install
npm run dev
```

## Seed the database

```bash
npx tsx scripts/seed.ts
```

## License

MIT
