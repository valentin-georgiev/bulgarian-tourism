/**
 * One-time data seed script.
 * Fetches Bulgarian places from Overpass API, enriches with Wikidata, and upserts into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requirements:
 *   - .env must contain NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *   - PostGIS extension and places table must already exist (run supabase/migrations/001_init.sql first)
 */

import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { slugify } from 'transliteration';
import type { Category } from '../types/place';
import { fetchOsmNodes, classifyNode, type OsmNode } from './overpass';
import { fetchWikidataEnrichment } from './wikidata';

// Load .env
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Track skip reasons for the end-of-run audit log
const skipLog: { osm_id: number; category: Category; reason: string }[] = [];

function pickName(tags: Record<string, string>): { name: string; name_bg: string | null } {
  const nameEn = tags['name:en'] ?? null;
  const nameBg = tags['name'] ?? tags['name:bg'] ?? null;

  // Prefer English name for display; fall back to Bulgarian
  const name = nameEn ?? nameBg ?? 'unknown';
  return { name, name_bg: nameBg };
}

async function processNode(node: OsmNode, category: Category): Promise<boolean> {
  const { name, name_bg } = pickName(node.tags);

  if (!name || name === 'unknown') {
    skipLog.push({ osm_id: node.id, category, reason: 'no name tag' });
    return false;
  }

  // Transliterate Cyrillic → Latin, then append osm_id to guarantee uniqueness
  const slug = `${slugify(name)}-${node.id}`;
  const wikidataQid = node.tags['wikidata'] ?? null;

  let enrichment = {
    description_en: null as string | null,
    description_bg: null as string | null,
    wikipedia_en: null as string | null,
    image_url: null as string | null,
  };

  if (wikidataQid) {
    try {
      enrichment = await fetchWikidataEnrichment(wikidataQid);
    } catch {
      // Enrichment is best-effort; don't fail the whole node
    }
  }

  const record = {
    osm_id: node.id,
    name,
    name_bg,
    slug,
    category,
    region: node.tags['addr:region'] ?? node.tags['is_in:region'] ?? null,
    description: enrichment.description_en,
    description_bg: enrichment.description_bg,
    image_url: enrichment.image_url,
    wikipedia: enrichment.wikipedia_en,
    location: `POINT(${node.lon} ${node.lat})`,
    elevation_m: node.tags['ele'] ? parseInt(node.tags['ele'], 10) : null,
    tags: node.tags,
  };

  const { error } = await supabase
    .from('places')
    .upsert(record, { onConflict: 'osm_id' });

  if (error) {
    skipLog.push({ osm_id: node.id, category, reason: `db error: ${error.message}` });
    return false;
  }

  return true;
}

async function seed() {
  console.log('Fetching nodes from Overpass API...');
  const nodes = await fetchOsmNodes();
  console.log(`Fetched ${nodes.length} OSM nodes.\n`);

  const counts: Record<Category, { ok: number; skip: number }> = {
    lake: { ok: 0, skip: 0 },
    mountain: { ok: 0, skip: 0 },
    cave: { ok: 0, skip: 0 },
    city: { ok: 0, skip: 0 },
    fishing: { ok: 0, skip: 0 },
    trail: { ok: 0, skip: 0 },
  };

  let i = 0;
  for (const node of nodes) {
    i++;
    const category = classifyNode(node.tags);
    if (!category) continue;

    // Throttle slightly to be kind to Wikidata API
    if (i % 50 === 0) {
      process.stdout.write(`\r  Progress: ${i}/${nodes.length}...`);
      await new Promise((r) => setTimeout(r, 200));
    }

    const ok = await processNode(node, category);
    counts[category][ok ? 'ok' : 'skip']++;
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n\nSeed complete. Summary:');
  console.log('─'.repeat(52));
  for (const [cat, { ok, skip }] of Object.entries(counts)) {
    const total = ok + skip;
    const pct = total > 0 ? Math.round((skip / total) * 100) : 0;
    console.log(
      `  ${cat.padEnd(10)}  inserted/updated: ${String(ok).padStart(5)}  skipped: ${String(skip).padStart(5)}  (${pct}%)`
    );
  }

  // ── Skip breakdown ────────────────────────────────────────────────────────
  if (skipLog.length > 0) {
    console.log('\nSkip breakdown by reason:');
    console.log('─'.repeat(52));
    const byReason: Record<string, number> = {};
    for (const { reason } of skipLog) {
      byReason[reason] = (byReason[reason] ?? 0) + 1;
    }
    for (const [reason, count] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(5)}  ${reason}`);
    }

    console.log('\nSkip breakdown by category:');
    console.log('─'.repeat(52));
    const byCat: Record<string, number> = {};
    for (const { category } of skipLog) {
      byCat[category] = (byCat[category] ?? 0) + 1;
    }
    for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(5)}  ${cat}`);
    }
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
