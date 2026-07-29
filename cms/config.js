/* Krenzer Design — Verbindung zum Sanity-Backend.
   Alles, was man beim Umzug auf ein anderes Projekt/Dataset ändern muss, steht hier. */

export const SANITY = {
  projectId: 'fohvltfb',
  dataset: 'production',

  /** API-Version. Fixes Datum, damit ein Sanity-Update die Antwort nicht still verändert. */
  apiVersion: '2026-07-01',

  /** Nur veröffentlichte Inhalte — Entwürfe aus dem Studio bleiben unsichtbar. */
  perspective: 'published',

  /**
   * Live-API statt CDN.
   *
   * `api.sanity.io`     → immer der aktuelle Stand, keine Zwischenspeicherung bei Sanity.
   * `apicdn.sanity.io`  → schneller, liefert aber bis zu ~60 s alte Daten.
   *
   * Bewusst auf `false`: die Wartezeit steuert der Speicher unten (60 s), nicht ein
   * fremder Cache. Sonst könnten sich beide addieren und eine Änderung bräuchte
   * im schlechtesten Fall zwei Minuten, bis sie sichtbar wird.
   */
  useCdn: false,
}

export const CACHE = {
  /** Schlüssel im sessionStorage. Version hochzählen, wenn sich die Abfrage ändert. */
  key: 'krenzer:content:v2',

  /** Wie lange eine Antwort im Browser wiederverwendet wird. */
  ttlMs: 60_000,
}
