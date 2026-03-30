const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';
const WIKIPEDIA_REST_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const WIKIMEDIA_COMMONS_URL = 'https://commons.wikimedia.org/w/api.php';

export interface WikidataEnrichment {
  description_en: string | null;
  description_bg: string | null;
  wikipedia_en: string | null;
  image_url: string | null;
}

// Fetch label, description, and sitelinks for a Wikidata Q-ID
export async function fetchWikidataEnrichment(qid: string): Promise<WikidataEnrichment> {
  const query = `
    SELECT ?labelEn ?labelBg ?descEn ?descBg ?articleEn ?image WHERE {
      BIND(wd:${qid} AS ?item)
      OPTIONAL { ?item rdfs:label ?labelEn . FILTER(LANG(?labelEn) = "en") }
      OPTIONAL { ?item rdfs:label ?labelBg . FILTER(LANG(?labelBg) = "bg") }
      OPTIONAL { ?item schema:description ?descEn . FILTER(LANG(?descEn) = "en") }
      OPTIONAL { ?item schema:description ?descBg . FILTER(LANG(?descBg) = "bg") }
      OPTIONAL {
        ?articleEn schema:about ?item ;
          schema:isPartOf <https://en.wikipedia.org/> ;
          schema:name ?articleName .
      }
      OPTIONAL { ?item wdt:P18 ?image }
    }
    LIMIT 1
  `;

  try {
    const response = await fetch(
      `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(query)}&format=json`,
      { headers: { Accept: 'application/json', 'User-Agent': 'BulgarianTourismBot/1.0' } }
    );

    if (!response.ok) return emptyEnrichment();

    const data = await response.json();
    const binding = data.results?.bindings?.[0];
    if (!binding) return emptyEnrichment();

    const articleEn: string | null = binding.articleEn?.value ?? null;
    const imageFile: string | null = binding.image?.value ?? null;

    const [wikiSummary, imageUrl] = await Promise.all([
      articleEn ? fetchWikipediaSummary(articleEn) : Promise.resolve(null),
      imageFile ? fetchCommonsImageUrl(imageFile) : Promise.resolve(null),
    ]);

    return {
      description_en: wikiSummary ?? binding.descEn?.value ?? null,
      description_bg: binding.descBg?.value ?? null,
      wikipedia_en: articleEn,
      image_url: imageUrl,
    };
  } catch {
    return emptyEnrichment();
  }
}

async function fetchWikipediaSummary(articleUrl: string): Promise<string | null> {
  try {
    // Extract article title from URL like https://en.wikipedia.org/wiki/Rila
    const title = articleUrl.split('/wiki/').pop();
    if (!title) return null;

    const response = await fetch(`${WIKIPEDIA_REST_URL}/${encodeURIComponent(title)}`, {
      headers: { 'User-Agent': 'BulgarianTourismBot/1.0' },
    });
    if (!response.ok) return null;

    const data = await response.json();
    return data.extract ?? null;
  } catch {
    return null;
  }
}

async function fetchCommonsImageUrl(wikimediaFileUrl: string): Promise<string | null> {
  try {
    // Wikimedia file URL looks like: http://commons.wikimedia.org/wiki/Special:FilePath/Filename.jpg
    const fileName = wikimediaFileUrl.split('/').pop();
    if (!fileName) return null;

    const params = new URLSearchParams({
      action: 'query',
      titles: `File:${decodeURIComponent(fileName)}`,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '800',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${WIKIMEDIA_COMMONS_URL}?${params}`, {
      headers: { 'User-Agent': 'BulgarianTourismBot/1.0' },
    });
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages ?? {};
    const page = Object.values(pages)[0] as { imageinfo?: { thumburl?: string }[] };
    return page?.imageinfo?.[0]?.thumburl ?? null;
  } catch {
    return null;
  }
}

function emptyEnrichment(): WikidataEnrichment {
  return { description_en: null, description_bg: null, wikipedia_en: null, image_url: null };
}
