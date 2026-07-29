# Krenzer Design

Statische Website mit **Sanity** als Backend. Der komplette Text der Seite —
Überschriften, Buttons, Navigation, Projekte, Footer — wird im Studio gepflegt.

```
index.html          die Seite (enthält den zuletzt veröffentlichten Stand als Fallback)
styles.css
main.js             Einstiegspunkt: Inhalt laden → einsetzen → Interaktionen starten
script.js           Interaktionen (Scroll, Tabs, Hover, Reveal)
cms/
  config.js         Projekt-ID, Dataset, API-Version, Cache-Dauer
  query.js          eine GROQ-Abfrage für die ganze Seite
  client.js         Abruf + Browser-Zwischenspeicher
  render.js         schreibt die Inhalte ins Markup
  highlight.js      Code-Ausschnitte einfärben und tippen lassen
  html.js           Escaping
studio/             Sanity Studio (eigenständig, eigene Abhängigkeiten)
```

## Loslegen

```bash
npm run studio     # Studio auf http://localhost:3333
npm run dev        # Website auf http://localhost:5173
```

Beim ersten Mal im Studio-Ordner einmal `npm install` — das ist schon geschehen.

## Sanity-Projekt

| | |
|---|---|
| Projekt-ID | `fohvltfb` |
| Dataset | `production` (öffentlich lesbar) |
| Manage | https://www.sanity.io/manage/project/fohvltfb |

Das Dataset ist öffentlich lesbar, deshalb braucht die Website **keinen API-Token**
— im ausgelieferten JavaScript steht kein Geheimnis.

## Inhalte pflegen

Das Studio hat drei Einträge:

**Startseite** — ein Reiter pro Abschnitt, in der Reihenfolge der Seite:
Einstieg · Kundenlogos · Leistungen · Unter der Haube · Arbeiten · Prozess · Stimmen · Kontakt.

**Projekte** — die Referenzprojekte. Welche davon auf der Startseite erscheinen und in
welcher Reihenfolge, steht unter *Startseite → Arbeiten*.

**Website-Einstellungen** — Marke, Navigation, Footer, Suchmaschinen- und Teilen-Texte.

Was gut zu wissen ist:

- Nummerierungen (`01`, `02`, …) vergibt die Website selbst aus der Reihenfolge der Liste.
- Zeilenumbrüche in Überschriften und mehrzeiligen Feldern werden übernommen.
- Die Code-Ausschnitte werden als reiner Text gepflegt; Einfärbung und Tipp-Animation
  entstehen automatisch aus der gewählten Sprache.
- Erst **Publish** macht eine Änderung sichtbar — Entwürfe bleiben unsichtbar.

## Zwischenspeicherung

Die Anforderung: immer der aktuelle Stand von Sanity, aber der Browser soll nicht bei
jedem Klick neu laden. Umgesetzt an genau drei Stellen (`cms/client.js`):

| Ebene | Zustand | Warum |
|---|---|---|
| Sanity-CDN | **aus** | Abruf über `api.sanity.io`, nicht `apicdn.sanity.io` — nie veraltet |
| HTTP-Cache | **aus** | `fetch(…, {cache: 'no-store'})` — der Browser legt die Antwort nicht ab |
| Browser-Speicher | **60 s** | eigene Ablage im `sessionStorage` mit Zeitstempel |

Der `sessionStorage`-Eintrag wird verworfen, wenn er älter als 60 Sekunden ist **oder**
wenn die Seite neu geladen wurde (`PerformanceNavigationTiming.type === 'reload'` — das
gilt für den normalen wie für den harten Reload). In beiden Fällen geht ein frischer
Request an die Live-API.

Ein Framework-Cache existiert nicht — die Seite ist reines HTML/CSS/JS ohne Build-Schritt.

Zum Nachstellen in der Konsole:

```js
sessionStorage.getItem('krenzer:content:v1')   // {"fetchedAt": …, "data": …}
sessionStorage.clear()                          // erzwingt beim nächsten Aufruf einen Abruf
```

## index.html als Fallback

`index.html` enthält den zuletzt veröffentlichten Stand vollständig ausgeschrieben.
Zwei Gründe:

1. Ist Sanity nicht erreichbar (offline, Ausfall), steht trotzdem die richtige Seite da.
2. Der Renderer schreibt nur, was sich unterscheidet. Stimmt das Markup mit dem
   CMS-Stand überein, wird nichts angefasst — kein Aufblitzen, keine Animation, die neu
   startet.

Der Fallback altert mit: er wird ungenau, sobald jemand im Studio publiziert. Für
Besucher ändert das nichts — sie sehen nach dem Abruf den aktuellen Stand. Wer ihn
nachziehen will, kopiert das gerenderte Markup aus dem Browser (DevTools → Elements)
zurück nach `index.html`. Nötig ist das nicht.

## Deployment (Netlify)

Es gibt **keinen Build-Schritt**. Die Seite besteht aus fertigen Dateien; der Inhalt
kommt zur Laufzeit im Browser dazu.

| Einstellung | Wert |
|---|---|
| Build command | leer lassen |
| Publish directory | `.` (Repo-Wurzel) |

Neuer Stand im Studio → sofort live, ohne Deploy. Ein Deploy ist nur nötig, wenn sich
Code oder Design ändern. Ein Sanity-Webhook auf einen Netlify-Build-Hook wird also
nicht gebraucht.

`studio/` liegt beim Deploy mit im Publish-Verzeichnis. Das ist unkritisch — dort steht
nichts Geheimes (die Projekt-ID ist ohnehin öffentlich), und es ist keine aufrufbare
Seite. Wer es sauber trennen will, verschiebt die Website-Dateien in einen eigenen
Ordner und setzt den auf `Publish directory`.

### Domain freischalten

Damit der Browser von der Produktionsdomain aus lesen darf, muss diese in der
CORS-Liste stehen — das gilt auch für die `*.netlify.app`-Vorschau:

```bash
npm --prefix studio exec -- sanity cors add https://krenzer.design
npm --prefix studio exec -- sanity cors add https://<name>.netlify.app
```

Bereits eingetragen: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:8000`.

## Schema ändern

Nach Änderungen in `studio/schemaTypes/`:

```bash
npm run schema:deploy    # macht das Schema für Sanity-Tools sichtbar
```

Felder mit Inhalt nie ersatzlos löschen — erst `deprecated` + `readOnly` setzen,
Inhalte migrieren, dann entfernen.
