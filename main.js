/* Einstiegspunkt.

   Reihenfolge ist wichtig:
   1. Inhalte aus Sanity holen (aus dem 60-Sekunden-Speicher oder frisch über die Live-API)
   2. in das Markup schreiben
   3. erst danach die Interaktionen anhängen — sonst hängen Listener an ersetzten Elementen

   Schlägt der Abruf fehl (offline, Sanity nicht erreichbar, CORS), bleibt die Seite so
   stehen, wie sie in index.html steht. Das ist der zuletzt veröffentlichte Stand, also
   nie eine leere Seite. */

import {loadContent} from './cms/client.js'
import {applyContent} from './cms/render.js'
import {initInteractions} from './script.js'

try {
  const {data, source} = await loadContent()
  applyContent(data)
  if (source === 'cache') {
    // Hinweis für die Konsole: warum diesmal kein Request zu sehen ist.
    console.debug('[cms] Inhalt aus dem Browser-Speicher (jünger als 60 s).')
  }
} catch (error) {
  console.warn('[cms] Inhalt konnte nicht geladen werden — zeige die eingebaute Fassung.', error)
}

initInteractions()
