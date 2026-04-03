/**
 * Parse a WKB hex-encoded Point (SRID 4326) into { lat, lng }.
 * WKB Point layout (little-endian):
 *   byte 0     : endianness (01 = LE)
 *   bytes 1-4  : geometry type (01000020 = Point with SRID)
 *   bytes 5-8  : SRID (E6100000 = 4326 LE)
 *   bytes 9-16 : X (longitude) as float64
 *   bytes 17-24: Y (latitude) as float64
 */
export function parseWkbPoint(hex: string): { lat: number; lng: number } | null {
  if (!hex || hex.length < 50) return null;

  try {
    // Skip endianness (2), type (8), SRID (8) = 18 hex chars
    const xHex = hex.slice(18, 34);
    const yHex = hex.slice(34, 50);

    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);

    // Parse longitude (X)
    const xBytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) xBytes[i] = parseInt(xHex.slice(i * 2, i * 2 + 2), 16);
    new Uint8Array(buf).set(xBytes);
    const lng = view.getFloat64(0, true); // little-endian

    // Parse latitude (Y)
    const yBytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) yBytes[i] = parseInt(yHex.slice(i * 2, i * 2 + 2), 16);
    new Uint8Array(buf).set(yBytes);
    const lat = view.getFloat64(0, true);

    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
