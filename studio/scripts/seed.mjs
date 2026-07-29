/**
 * Seed-Script: legt alle Inhalte der Krenzer-Design-Website als veröffentlichte
 * Dokumente in Sanity an. Idempotent – erneutes Ausführen überschreibt die
 * Einzelstücke (createOrReplace), ohne Duplikate zu erzeugen.
 *
 * Ausführen:
 *   SANITY_WRITE_TOKEN=xxxxx node scripts/seed.mjs
 * oder Token in eine .env-Datei legen (siehe .env.example) und:
 *   npm run seed
 *
 * Achtung: das Script setzt den Stand zurück, der hier im Code steht. Wer im
 * Studio gepflegt hat und das Script erneut laufen lässt, verliert diese
 * Änderungen. Es ist als Erstbefüllung gedacht, nicht als Backup.
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

// --- .env (optional) einlesen, ohne Zusatzpaket ---
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const env = readFileSync(join(__dirname, '..', '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
} catch {
  /* keine .env – dann muss der Token als Umgebungsvariable gesetzt sein */
}

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error(
    '\n  Fehler: kein Schreib-Token gefunden.\n' +
      '  Lege .env mit SANITY_WRITE_TOKEN an (siehe .env.example) oder setze\n' +
      '  SANITY_WRITE_TOKEN=... als Umgebungsvariable.\n',
  )
  process.exit(1)
}

const client = createClient({
  projectId: 'fohvltfb',
  dataset: 'production',
  apiVersion: '2026-07-01',
  token,
  useCdn: false,
})

/* ---------- Helfer ---------- */
let n = 0
const key = () => `k${(n++).toString(36)}`

/** Array-Einträge brauchen einen stabilen Schlüssel. */
const keyed = (items) => items.map((item) => ({_key: key(), ...item}))

const link = (label, href) => ({_type: 'link', label, href})
const ref = (id) => ({_type: 'reference', _ref: id})

/* ================= INHALTE ================= */

const PROJECTS = [
  {
    _id: 'project-voltmark',
    client: 'Voltmark',
    description: 'B2B-Plattform · Relaunch & Design-System',
    kpi: '+118% Traffic',
    year: '2026',
  },
  {
    _id: 'project-halden-studio',
    client: 'Halden Studio',
    description: 'Portfolio · Editorial & Motion',
    kpi: 'Awwwards Honorable',
    year: '2025',
  },
  {
    _id: 'project-nordkap-bank',
    client: 'Nordkap Bank',
    description: 'Finanzportal · Barrierefreiheit AA',
    kpi: '0,6 s LCP',
    year: '2025',
  },
  {
    _id: 'project-ferrum',
    client: 'Ferrum GmbH',
    description: 'Industrie · Headless-Migration',
    kpi: '−72% Pflegeaufwand',
    year: '2024',
  },
].map((p) => ({_type: 'project', href: '#arbeiten', ...p}))

const docs = [
  /* ---------- Stammdaten ---------- */
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandInitial: 'K',
    brandName: 'Krenzer Design',
    mainNav: keyed([
      link('Leistungen', '#leistungen'),
      link('Arbeiten', '#arbeiten'),
      link('Stack', '#stack'),
      link('Prozess', '#prozess'),
    ]),
    headerSecondaryLink: link('Kundenlogin', '#kontakt'),
    headerCta: link('Projekt starten', '#kontakt'),
    footerAbout: 'Studio für Markenauftritte und Web-Interfaces. Würzburg & remote.',
    footerColumns: keyed([
      {
        _type: 'footerColumn',
        title: 'Studio',
        links: keyed([
          link('Leistungen', '#leistungen'),
          link('Arbeiten', '#arbeiten'),
          link('Prozess', '#prozess'),
        ]),
      },
      {
        _type: 'footerColumn',
        title: 'Kontakt',
        links: keyed([
          link('hallo@krenzer.design', 'mailto:hallo@krenzer.design'),
          link('+49 931 123 45', 'tel:+4993112345'),
          link('LinkedIn', '#kontakt'),
        ]),
      },
      {
        _type: 'footerColumn',
        title: 'Rechtliches',
        links: keyed([
          link('Impressum', '#kontakt'),
          link('Datenschutz', '#kontakt'),
          link('Barrierefreiheit', '#kontakt'),
        ]),
      },
    ]),
    footerCopyright: '© 2026 Krenzer Design GmbH',
    footerNote: 'Gebaut in Würzburg',
    seoTitle: 'Krenzer Design — Studio für Markenauftritte und Web-Interfaces',
    seoDescription:
      'Krenzer Design ist ein Studio für Markenauftritte und Web-Interfaces. ' +
      'Redaktionelles Design, präzise gebaut — headless, schnell, messbar.',
    shareTitle: 'Krenzer Design',
    shareDescription: 'Websites, die sich anfühlen wie gute Software.',
  },

  /* ---------- 1 · Kopfbereich ---------- */
  {
    _id: 'hero',
    _type: 'hero',
    badge: 'Zwei Projektslots frei · Q4 2026',
    heading: 'Websites, die sich anfühlen wie gute Software.',
    lead:
      'Krenzer Design ist ein Studio für Markenauftritte und Web-Interfaces. ' +
      'Redaktionelles Design, präzise gebaut — headless, schnell, messbar.',
    primaryCta: link('Projekt anfragen', '#kontakt'),
    secondaryCta: link('Arbeiten ansehen', '#arbeiten'),
    showcase: {
      title: 'krenzer.studio — Hero.tsx',
      status: 'live',
      snippet: {
        _type: 'codeSnippet',
        language: 'js',
        caret: true,
        code: [
          '// eine Komponente, drei Breakpoints, kein Layout-Shift',
          'export default function Hero({ claim, cta }) {',
          '  return (',
          '    <Section tone="quiet" rhythm="editorial">',
          '      <Display balance>{claim}</Display>',
          '      <Button intent="primary">{cta}</Button>',
          '    </Section>',
          '  )',
          '}',
        ].join('\n'),
      },
      metricsLabel: 'Messung nach Launch',
      metrics: keyed([
        {_type: 'metric', label: 'Lighthouse Performance', value: '99', fill: 99},
        {_type: 'metric', label: 'Accessibility', value: '100', fill: 100},
        {_type: 'metric', label: 'Bundle-Budget', value: '78 / 120 kB', fill: 65},
      ]),
      metricsFootnote: 'LCP 0.8s · CLS 0.00\nEdge FRA1 · Vercel',
    },
  },

  /* ---------- 2 · Kundenlogos ---------- */
  {
    _id: 'sectionLogos',
    _type: 'sectionLogos',
    label: 'Marken, die uns vertrauen',
    logos: keyed([
      {_type: 'logo', name: 'Voltmark', style: 'a'},
      {_type: 'logo', name: 'Halden Studio', style: 'b'},
      {_type: 'logo', name: 'Nordkap', style: 'c'},
      {_type: 'logo', name: 'ferrum', style: 'd'},
      {_type: 'logo', name: 'Aurelis Bau', style: 'a'},
      {_type: 'logo', name: 'Klarwerk', style: 'e'},
    ]),
  },

  /* ---------- 3 · Leistungen ---------- */
  {
    _id: 'sectionLeistungen',
    _type: 'sectionLeistungen',
    eyebrow: 'Leistungen',
    heading: 'Vier Disziplinen, ein Team.',
    lead:
      'Kein Handoff zwischen Agenturen. Strategie, Design und Entwicklung sitzen im selben ' +
      'Raum — was im Design steht, landet genau so im Browser.',
    items: keyed([
      {
        _type: 'serviceCard',
        title: 'Brand & Art Direction',
        text:
          'Wortmarke, Typo-System, Bildsprache, Motion-Prinzipien. ' +
          'Als lebendiges Design-System, nicht als PDF.',
        tags: ['Logo', 'Type Scale', 'Guidelines'],
      },
      {
        _type: 'serviceCard',
        title: 'Web & Product Design',
        text:
          'Von der Sitemap bis zum letzten Hover-State. ' +
          'Prototypen, die man klicken kann, bevor gebaut wird.',
        tags: ['UX', 'UI Kit', 'Prototyping'],
      },
      {
        _type: 'serviceCard',
        title: 'Headless Development',
        text:
          'Next.js, TypeScript, Headless CMS. ' +
          'Die Redaktion pflegt Inhalte selbst — ohne Ticket, ohne Wartezeit.',
        tags: ['Next.js', 'CMS', 'Edge'],
      },
      {
        _type: 'serviceCard',
        title: 'Performance & Growth',
        text:
          'Core Web Vitals, technisches SEO, A/B-Tests. ' +
          'Wir betreuen weiter, wenn andere die Rechnung stellen.',
        tags: ['Web Vitals', 'SEO', 'Analytics'],
      },
    ]),
  },

  /* ---------- 4 · Unter der Haube ---------- */
  {
    _id: 'sectionStack',
    _type: 'sectionStack',
    eyebrow: 'Unter der Haube',
    heading: 'Design endet nicht im Entwurf. Es wird ausgeliefert.',
    meta: 'TypeScript · Next.js 15\nHeadless CMS · Vercel · Playwright',
    tabs: keyed([
      {
        _type: 'stackTab',
        title: 'Design Tokens',
        summary: 'Eine Quelle für Farbe, Typo und Spacing — Entwurf und Code bleiben synchron.',
        fileName: 'styles/tokens.css',
        fileMeta: 'auto-generiert · 04:12',
        tags: ['Design-Variablen', 'CSS Custom Properties'],
        snippet: {
          _type: 'codeSnippet',
          language: 'css',
          caret: false,
          code: [
            '/* tokens.css — generiert aus den Design-Variablen */',
            ':root {',
            '  --surface-0: #000000;',
            '  --surface-1: #141418;',
            '  --text-1:    #F5F5F7;',
            '  --text-2:    #98989D;',
            '  /* fluide Typo, 320 → 1440px */',
            '  --step-6: clamp(2.6rem, 1.2rem + 5vw, 5.1rem);',
            '  --gutter: clamp(1rem, 3vw, 2rem);',
            '}',
          ].join('\n'),
        },
      },
      {
        _type: 'stackTab',
        title: 'Content-Modell',
        summary:
          'Strukturierte Inhalte statt Textwüsten im Editor. Redaktionsfreundlich per Definition.',
        fileName: 'schemas/caseStudy.ts',
        fileMeta: 'Headless CMS',
        tags: ['Portable Text', 'Live Preview'],
        snippet: {
          _type: 'codeSnippet',
          language: 'js',
          caret: false,
          code: [
            '// schemas/caseStudy.ts',
            'export const caseStudy = defineType({',
            "  name: 'caseStudy',",
            '  fields: [',
            "    defineField({ name: 'kunde',   type: 'string' }),",
            "    defineField({ name: 'wirkung', type: 'kpiList' }),",
            "    defineField({ name: 'module',  type: 'array',",
            "      of: [{ type: 'bildText' }, { type: 'zitat' }] }),",
            '  ],',
            '})',
          ].join('\n'),
        },
      },
      {
        _type: 'stackTab',
        title: 'Performance-Budget',
        summary: 'Budgets laufen im CI. Wird eine Grenze gerissen, geht der Build nicht live.',
        fileName: '.github/workflows/budget.yml',
        fileMeta: 'CI · 14 Checks',
        tags: ['Lighthouse CI', 'Playwright'],
        snippet: {
          _type: 'codeSnippet',
          language: 'yaml',
          caret: false,
          code: [
            '# .github/workflows/budget.yml',
            'budgets:',
            '  - resourceSizes:',
            '      - { resourceType: script, budget: 120 }',
            '      - { resourceType: image,  budget: 300 }',
            '  - timings:',
            '      - { metric: largest-contentful-paint, budget: 1200 }',
            '',
            '✓ 14 Checks passed — Deploy freigegeben',
          ].join('\n'),
        },
      },
    ]),
  },

  /* ---------- 5 · Arbeiten ---------- */
  {
    _id: 'sectionArbeiten',
    _type: 'sectionArbeiten',
    eyebrow: 'Ausgewählte Arbeiten',
    heading: 'Sechs Wochen später\nist es online.',
    link: link('Alle 140 Projekte →', '#kontakt'),
    projects: keyed(PROJECTS.map((p) => ref(p._id))),
  },

  /* ---------- 6 · Prozess ---------- */
  {
    _id: 'sectionProzess',
    _type: 'sectionProzess',
    eyebrow: 'Prozess',
    heading: 'Transparent von Kickoff bis Launch.',
    steps: keyed([
      {
        _type: 'processStep',
        label: 'WOCHE 1',
        title: 'Discovery',
        text:
          'Workshop, Wettbewerb, Analytics-Audit. ' +
          'Am Ende steht eine Positionierung, kein Moodboard.',
        highlighted: true,
      },
      {
        _type: 'processStep',
        label: 'WOCHE 2–3',
        title: 'Design-System',
        text: 'Art Direction plus Komponenten-Bibliothek. Zwei Richtungen, eine Entscheidung.',
        highlighted: false,
      },
      {
        _type: 'processStep',
        label: 'WOCHE 4–5',
        title: 'Build',
        text: 'Preview-Deploy ab Tag eins. Sie sehen jeden Stand, nicht nur das Ergebnis.',
        highlighted: false,
      },
      {
        _type: 'processStep',
        label: 'WOCHE 6',
        title: 'Launch & Care',
        text: 'Redaktions-Schulung, Monitoring, Quartals-Review. Wir bleiben erreichbar.',
        highlighted: false,
      },
    ]),
  },

  /* ---------- 7 · Stimmen ---------- */
  {
    _id: 'sectionStimmen',
    _type: 'sectionStimmen',
    quote:
      '„Die erste Agentur, bei der Design und Technik nicht gegeneinander gearbeitet haben. ' +
      'Unsere Anfragen haben sich im ersten Quartal verdoppelt.“',
    accent: 'verdoppelt.',
    initials: 'MB',
    author: 'Marlene Böhm',
    role: 'Head of Marketing, Voltmark GmbH',
    kpis: keyed([
      {_type: 'kpi', value: '+118%', label: 'Organischer Traffic'},
      {_type: 'kpi', value: '0,8 s', label: 'LCP mobil'},
      {_type: 'kpi', value: '−64%', label: 'Absprungrate'},
      {_type: 'kpi', value: '6 Wo.', label: 'Bis Livegang'},
    ]),
  },

  /* ---------- 8 · Kontakt ---------- */
  {
    _id: 'sectionKontakt',
    _type: 'sectionKontakt',
    eyebrow: 'Nächster Slot: Oktober 2026',
    heading: 'Reden wir über Ihr nächstes Projekt.',
    lead:
      '30 Minuten, unverbindlich. Danach wissen Sie, was Ihr Vorhaben kostet ' +
      'und wie lange es dauert.',
    primaryCta: link('Termin buchen', 'mailto:hallo@krenzer.design'),
    secondaryCta: link('hallo@krenzer.design', 'mailto:hallo@krenzer.design'),
  },

  /* ---------- Projekte ---------- */
  ...PROJECTS,
]

/* ================= AUSFÜHREN ================= */
async function run() {
  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc)
  const res = await tx.commit()
  console.log(`\n  ✓ ${docs.length} Dokumente veröffentlicht in production:`)
  for (const doc of docs) console.log(`    · ${doc._type.padEnd(20)} ${doc._id}`)
  console.log(`\n  Studio:  https://krenzer-design.sanity.studio  (nach npm run deploy)\n`)
  return res
}

// Für gezielte Teil-Aktualisierungen importierbar (import {docs, client} …).
export {docs, client}

// Vollständiges Seeding nur beim direkten Aufruf (node scripts/seed.mjs).
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((err) => {
    console.error('\n  Fehler beim Seeding:', err.message, '\n')
    process.exit(1)
  })
}
