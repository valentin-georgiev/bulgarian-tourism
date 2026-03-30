import type { Category } from '@/types/place';

// Bulgaria bounding box: (south, west, north, east)
const BG_BBOX = '41.235,22.357,44.215,28.612';

// Public Overpass endpoints — tried in order on failure
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

// Seconds to wait between category fetches — keeps us under rate limits
const INTER_REQUEST_DELAY_MS = 10_000;

// Unified element shape used throughout the seed pipeline.
// For nodes: lat/lon come directly from the element.
// For relations (trails): lat/lon are normalised from the `center` field.
export interface OsmNode {
  type: 'node' | 'relation';
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

// Raw relation shape returned by Overpass when using `out center;`
interface OsmRelationRaw {
  type: 'relation';
  id: number;
  center: { lat: number; lon: number };
  tags: Record<string, string>;
}

interface OverpassNodeResponse {
  elements: OsmNode[];
}

interface OverpassRelationResponse {
  elements: OsmRelationRaw[];
}

// Node queries — use `out body;` which includes lat/lon directly
const NODE_CATEGORY_QUERIES: Record<Exclude<Category, 'trail'>, string> = {
  mountain: `[out:json][timeout:60];node["natural"="peak"](${BG_BBOX});out body;`,
  cave:     `[out:json][timeout:60];node["natural"="cave_entrance"](${BG_BBOX});out body;`,
  lake:     `[out:json][timeout:60];(node["natural"="water"]["water"="lake"](${BG_BBOX});node["natural"="water"]["water"="reservoir"](${BG_BBOX}););out body;`,
  fishing:  `[out:json][timeout:60];(node["leisure"="fishing"](${BG_BBOX});node["sport"="fishing"](${BG_BBOX}););out body;`,
  city:     `[out:json][timeout:60];(node["place"="city"](${BG_BBOX});node["place"="town"](${BG_BBOX}););out body;`,
};

// Trail query — relations only, `out center;` returns a representative centre point
const TRAIL_QUERY = `[out:json][timeout:90];(relation["route"="hiking"](${BG_BBOX});relation["route"="foot"](${BG_BBOX}););out center;`;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function doFetch(url: string, query: string): Promise<Response> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '30', 10);
    console.log(`    ⏳ Rate limited by ${new URL(url).hostname}, waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });
  }

  return res;
}

async function queryNodes(url: string, query: string): Promise<OsmNode[]> {
  const res = await doFetch(url, query);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const contentType = res.headers.get('Content-Type') ?? '';
  if (!contentType.includes('json')) throw new Error(`Expected JSON but got "${contentType}"`);

  const data: OverpassNodeResponse = await res.json();
  return data.elements;
}

async function queryTrailRelations(url: string, query: string): Promise<OsmNode[]> {
  const res = await doFetch(url, query);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const contentType = res.headers.get('Content-Type') ?? '';
  if (!contentType.includes('json')) throw new Error(`Expected JSON but got "${contentType}"`);

  const data: OverpassRelationResponse = await res.json();

  // Normalise: lift center.lat/lon up to top level so the rest of the
  // pipeline treats trails identically to point-based nodes
  return data.elements
    .filter((r) => r.center != null)
    .map((r) => ({
      type: 'relation' as const,
      id: r.id,
      lat: r.center.lat,
      lon: r.center.lon,
      tags: r.tags ?? {},
    }));
}

async function fetchCategoryNodes(category: Category): Promise<OsmNode[]> {
  const isTrail = category === 'trail';
  const query = isTrail ? TRAIL_QUERY : NODE_CATEGORY_QUERIES[category as Exclude<Category, 'trail'>];
  const queryFn = isTrail ? queryTrailRelations : queryNodes;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await queryFn(endpoint, query);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`    ✗ ${new URL(endpoint).hostname} — ${msg}`);
    }
  }

  console.warn(`    ⚠ All endpoints failed for "${category}", skipping.`);
  return [];
}

export async function fetchOsmNodes(): Promise<OsmNode[]> {
  const categories = Object.keys({ ...NODE_CATEGORY_QUERIES, trail: '' }) as Category[];
  const allNodes: OsmNode[] = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`  Fetching ${category}...`);
    const nodes = await fetchCategoryNodes(category);
    console.log(`    → ${nodes.length} elements`);
    allNodes.push(...nodes);

    if (i < categories.length - 1) {
      console.log(`    Waiting ${INTER_REQUEST_DELAY_MS / 1000}s before next request...`);
      await sleep(INTER_REQUEST_DELAY_MS);
    }
  }

  return allNodes;
}

export function classifyNode(tags: Record<string, string>): Category | null {
  if (tags['natural'] === 'peak') return 'mountain';
  if (tags['natural'] === 'cave_entrance') return 'cave';
  if (tags['natural'] === 'water' && (tags['water'] === 'lake' || tags['water'] === 'reservoir')) return 'lake';
  if (tags['leisure'] === 'fishing' || tags['sport'] === 'fishing') return 'fishing';
  if (tags['place'] === 'city' || tags['place'] === 'town') return 'city';
  if (tags['route'] === 'hiking' || tags['route'] === 'foot') return 'trail';
  return null;
}
