# Krenzer Design – Studio

Das Redaktions-Backend der Website. Hier werden alle Texte, Links und Kennzahlen
gepflegt; die Website lädt sie zur Laufzeit direkt aus Sanity.

```bash
npm run dev             # http://localhost:3333
npm run deploy          # https://krenzer-design.sanity.studio
npm run schema:deploy   # Schema für Sanity-Tools veröffentlichen
npm run seed            # Erstbefüllung (überschreibt! siehe unten)
```

## Aufbau

```
schemaTypes/
  index.ts        alle Typen an einer Stelle gebündelt
  shared.ts       Bausteine für mehrere Abschnitte (Link, Code-Ausschnitt)
  siteSettings.ts Marke, Navigation, Footer, SEO
  sections.ts     ein Dokument je Abschnitt der Startseite
  project.ts      Referenzprojekte (mehrere Dokumente)
structure.ts      die linke Navigation im Studio
scripts/seed.mjs  Erstbefüllung des Datasets
```

Die Abschnitte der Startseite sind **Einzelstücke**: die Dokument-ID entspricht
dem Typnamen (`hero`, `sectionLogos`, …), festgelegt in `structure.ts`. Dadurch
lässt sich kein zweiter Kopfbereich anlegen, und das Frontend fragt direkt über
die ID ab (`*[_id == "hero"][0]`) statt über den Typ.

## Seed-Script

`scripts/seed.mjs` schreibt den im Code stehenden Stand mit `createOrReplace` in
das Dataset — gedacht als Erstbefüllung oder um ein neues Dataset aufzusetzen.

**Es überschreibt.** Wer im Studio gepflegt hat und das Script erneut laufen
lässt, verliert diese Änderungen.

Das Script braucht einen Schreib-Token in `.env` (siehe `.env.example`). Diese
Datei liegt bewusst nicht im Repo — das Studio selbst braucht sie nicht, nur das
Script.

## Schema ändern

Nach Änderungen in `schemaTypes/` einmal `npm run schema:deploy`. Ändert sich
etwas an den Feldern, die die Website liest, müssen `../cms/query.js` und
`../cms/render.js` mitgezogen werden.

Felder mit Inhalt nie ersatzlos löschen — erst `deprecated` + `readOnly` setzen,
Inhalte migrieren, dann entfernen.
