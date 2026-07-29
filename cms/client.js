/* Datenabruf aus Sanity.

   Zwischenspeicherung — bewusst nur an genau einer Stelle:

   1. Sanity-Cache  : aus. Der Request geht an `api.sanity.io`, nicht an `apicdn.sanity.io`.
   2. HTTP-Cache    : aus. `cache: 'no-store'` — der Browser legt die Antwort nicht ab.
   3. Browser-Cache : an, selbst gebaut. Die Antwort liegt im sessionStorage und wird
                      wiederverwendet, solange sie jünger als 60 s ist. Jeder Reload
                      (auch ein Hard Reload) übergeht den Speicher und holt frisch. */

import {CACHE, SANITY} from './config.js'
import {CONTENT_QUERY} from './query.js'

const host = SANITY.useCdn ? 'apicdn.sanity.io' : 'api.sanity.io'

function endpoint() {
  const url = new URL(
    `/v${SANITY.apiVersion}/data/query/${SANITY.dataset}`,
    `https://${SANITY.projectId}.${host}`,
  )
  // Zeilenumbrüche der Abfrage einsparen — die URL bleibt so deutlich kürzer.
  url.searchParams.set('query', CONTENT_QUERY.replace(/\s+/g, ' ').trim())
  url.searchParams.set('perspective', SANITY.perspective)
  return url.toString()
}

/** 'navigate' | 'reload' | 'back_forward' | 'prerender' */
function navigationType() {
  const [entry] = performance.getEntriesByType('navigation')
  return entry?.type ?? 'navigate'
}

function readCache() {
  // Reload — auch Hard Reload (Cmd/Strg + Shift + R) — soll immer frische Daten liefern.
  if (navigationType() === 'reload') return null

  try {
    const raw = sessionStorage.getItem(CACHE.key)
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (!entry || typeof entry.fetchedAt !== 'number') return null
    if (Date.now() - entry.fetchedAt > CACHE.ttlMs) return null

    return entry.data
  } catch {
    // Kaputter Eintrag oder sessionStorage gesperrt (Privatmodus) — dann eben ohne Cache.
    return null
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE.key, JSON.stringify({fetchedAt: Date.now(), data}))
  } catch {
    /* Speicher voll oder gesperrt — kein Grund, die Seite scheitern zu lassen. */
  }
}

/**
 * Holt den Seiteninhalt.
 * @returns {Promise<{data: unknown, source: 'cache' | 'network'}>}
 */
export async function loadContent() {
  const cached = readCache()
  if (cached) return {data: cached, source: 'cache'}

  const response = await fetch(endpoint(), {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    headers: {Accept: 'application/json'},
  })

  if (!response.ok) {
    throw new Error(`Sanity antwortete mit ${response.status} ${response.statusText}`)
  }

  const body = await response.json()
  writeCache(body.result)
  return {data: body.result, source: 'network'}
}
