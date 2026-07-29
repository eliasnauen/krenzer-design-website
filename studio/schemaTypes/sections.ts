import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {BookIcon} from '@sanity/icons/Book'
import {BlockElementIcon} from '@sanity/icons/BlockElement'
import {SplitVerticalIcon} from '@sanity/icons/SplitVertical'
import {RocketIcon} from '@sanity/icons/Rocket'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {CommentIcon} from '@sanity/icons/Comment'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/**
 * Jeder Abschnitt der Startseite ist ein eigenes Dokument. In der Seitenleiste
 * des Studios liest sich die Liste wie der Aufbau der Seite von oben nach unten.
 * Jedes Dokument ist ein Einzelstück (Singleton) – es gibt genau eine Startseite.
 */

/* 1 — KOPFBEREICH ---------------------------------------------------------- */
export const hero = defineType({
  name: 'hero',
  title: 'Startseite – Kopfbereich',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'badge',
      title: 'Hinweis über der Überschrift',
      type: 'string',
      description: 'Die Zeile mit dem pulsierenden Punkt, z. B. „Zwei Projektslots frei · Q4 2026“.',
    }),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      description: 'Zeilenumbrüche werden übernommen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lead',
      title: 'Einleitungstext',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'primaryCta', title: 'Button (hell)', type: 'link'}),
    defineField({name: 'secondaryCta', title: 'Button (dezent)', type: 'link'}),
    defineField({
      name: 'showcase',
      title: 'Code-Fenster',
      type: 'object',
      description: 'Das Fenster unter dem Einstieg – Code links, Messwerte rechts.',
      fields: [
        defineField({
          name: 'title',
          title: 'Fenstertitel',
          type: 'string',
          description: 'In der Kopfzeile, z. B. „krenzer.studio — Hero.tsx“.',
        }),
        defineField({
          name: 'status',
          title: 'Status-Pille',
          type: 'string',
          description: 'Das kleine grüne Label rechts. Leer lassen, um es auszublenden.',
        }),
        defineField({name: 'snippet', title: 'Code', type: 'codeSnippet'}),
        defineField({name: 'metricsLabel', title: 'Überschrift der Messwerte', type: 'string'}),
        defineField({
          name: 'metrics',
          title: 'Messwerte',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'metric',
              title: 'Messwert',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Beschriftung',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'value',
                  title: 'Wert (angezeigt)',
                  type: 'string',
                  description: 'Frei formulierbar, z. B. „99“ oder „78 / 120 kB“.',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'fill',
                  title: 'Balkenfüllung (%)',
                  type: 'number',
                  description: 'Wie weit der Balken läuft – 0 bis 100.',
                  initialValue: 100,
                  validation: (rule) => rule.required().min(0).max(100),
                }),
              ],
              preview: {
                select: {title: 'label', value: 'value', fill: 'fill'},
                prepare: ({title, value, fill}) => ({title, subtitle: `${value} · ${fill}%`}),
              },
            }),
          ],
          validation: (rule) => rule.max(4).warning('Mehr als vier Balken wirken unruhig.'),
        }),
        defineField({
          name: 'metricsFootnote',
          title: 'Fußnote unter den Messwerten',
          type: 'text',
          rows: 2,
          description: 'Zeilenumbrüche werden übernommen.',
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Startseite – Kopfbereich'})},
})

/* 2 — KUNDENLOGOS ---------------------------------------------------------- */
export const sectionLogos = defineType({
  name: 'sectionLogos',
  title: 'Kundenlogos',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Beschriftung',
      type: 'string',
      description: 'Steht über dem Laufband, z. B. „Marken, die uns vertrauen“.',
    }),
    defineField({
      name: 'logos',
      title: 'Wortmarken',
      type: 'array',
      description: 'Das Laufband wiederholt die Liste automatisch – einmal eintragen genügt.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'logo',
          title: 'Wortmarke',
          options: {columns: 2},
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'style',
              title: 'Schriftbild',
              type: 'string',
              description: 'Nur Optik – damit das Laufband nicht nach einer Schrift aussieht.',
              options: {
                list: [
                  {title: 'Kompakt (eng gesetzt)', value: 'a'},
                  {title: 'Normal', value: 'b'},
                  {title: 'Versalien (gesperrt)', value: 'c'},
                  {title: 'Monospace', value: 'd'},
                  {title: 'Leicht', value: 'e'},
                ],
              },
              initialValue: 'a',
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'style'}},
        }),
      ],
      validation: (rule) => rule.min(4).warning('Unter vier Namen entsteht eine sichtbare Lücke.'),
    }),
  ],
  preview: {prepare: () => ({title: 'Kundenlogos'})},
})

/* 3 — LEISTUNGEN ----------------------------------------------------------- */
export const sectionLeistungen = defineType({
  name: 'sectionLeistungen',
  title: 'Leistungen',
  type: 'document',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine Überschrift', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'lead', title: 'Einleitungstext', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Leistungen',
      type: 'array',
      description: 'Die Nummern 01, 02 … vergibt die Website automatisch nach dieser Reihenfolge.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceCard',
          title: 'Leistung',
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Beschreibung',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'tags',
              title: 'Schlagworte',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              options: {layout: 'tags'},
              description: 'Die kleinen Chips unter dem Text. Zwei bis vier wirken am besten.',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'Leistungen'})},
})

/* 4 — UNTER DER HAUBE ------------------------------------------------------ */
export const sectionStack = defineType({
  name: 'sectionStack',
  title: 'Unter der Haube',
  type: 'document',
  icon: SplitVerticalIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine Überschrift', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tabs',
      title: 'Reiter',
      type: 'array',
      description: 'Der erste Reiter ist beim Laden der Seite geöffnet.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stackTab',
          title: 'Reiter',
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'summary',
              title: 'Kurzbeschreibung',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'fileName',
              title: 'Dateiname',
              type: 'string',
              description: 'Kopfzeile der Ansicht rechts, z. B. „styles/tokens.css“.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'fileMeta',
              title: 'Zusatz in der Kopfzeile',
              type: 'string',
              description: 'Rechts neben dem Dateinamen, z. B. „auto-generiert · 04:12“.',
            }),
            defineField({
              name: 'snippet',
              title: 'Code',
              type: 'codeSnippet',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'tags',
              title: 'Schlagworte',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              options: {layout: 'tags'},
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'fileName'}},
        }),
      ],
      validation: (rule) =>
        rule.min(1).max(4).warning('Mehr als vier Reiter passen nicht untereinander.'),
    }),
    defineField({
      name: 'meta',
      title: 'Technik-Notiz',
      type: 'text',
      rows: 2,
      description: 'Der kleine Text unter den Reitern. Zeilenumbrüche werden übernommen.',
    }),
  ],
  preview: {prepare: () => ({title: 'Unter der Haube'})},
})

/* 5 — ARBEITEN ------------------------------------------------------------- */
export const sectionArbeiten = defineType({
  name: 'sectionArbeiten',
  title: 'Arbeiten',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine Überschrift', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      description: 'Zeilenumbrüche werden übernommen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link rechts oben',
      type: 'link',
      description: 'Aktuell „Alle 140 Projekte →“.',
    }),
    defineField({
      name: 'projects',
      title: 'Projekte auf der Startseite',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
      description:
        'Auswahl aus der Projektliste im linken Menü. Reihenfolge per Ziehen; ' +
        'die Nummerierung 01, 02 … entsteht daraus automatisch.',
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {prepare: () => ({title: 'Arbeiten'})},
})

/* 6 — PROZESS -------------------------------------------------------------- */
export const sectionProzess = defineType({
  name: 'sectionProzess',
  title: 'Prozess',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine Überschrift', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'Schritte',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          title: 'Schritt',
          fields: [
            defineField({
              name: 'label',
              title: 'Zeitraum',
              type: 'string',
              description: 'z. B. „WOCHE 1“ oder „WOCHE 2–3“.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Beschreibung',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'highlighted',
              title: 'Hervorheben',
              type: 'boolean',
              description: 'Setzt die helle Linie über dem Schritt. Üblich nur beim ersten.',
              initialValue: false,
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.max(4).warning('Mehr als vier Schritte passen nicht in eine Reihe.'),
    }),
  ],
  preview: {prepare: () => ({title: 'Prozess'})},
})

/* 7 — STIMMEN -------------------------------------------------------------- */
export const sectionStimmen = defineType({
  name: 'sectionStimmen',
  title: 'Stimmen',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Zitat',
      type: 'text',
      rows: 4,
      description: 'Anführungszeichen bitte mit eintippen.',
    }),
    defineField({
      name: 'accent',
      title: 'Hervorgehobene Textstelle',
      type: 'string',
      description:
        'Dieser Ausschnitt wird im Zitat farbig gesetzt. Muss exakt so im Zitat vorkommen – ' +
        'leer lassen, wenn nichts hervorgehoben werden soll.',
      validation: (rule) =>
        rule.custom((accent, context) => {
          if (!accent) return true
          const quote = (context.document as {quote?: string} | undefined)?.quote
          if (typeof quote === 'string' && quote.includes(accent)) return true
          return 'Diese Textstelle kommt im Zitat nicht vor.'
        }),
    }),
    defineField({
      name: 'initials',
      title: 'Initialen',
      type: 'string',
      description: 'Der Kreis vor dem Namen, z. B. „MB“.',
      validation: (rule) => rule.max(3),
    }),
    defineField({name: 'author', title: 'Name', type: 'string'}),
    defineField({name: 'role', title: 'Position & Unternehmen', type: 'string'}),
    defineField({
      name: 'kpis',
      title: 'Kennzahlen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'kpi',
          title: 'Kennzahl',
          options: {columns: 2},
          fields: [
            defineField({
              name: 'value',
              title: 'Zahl',
              type: 'string',
              description: 'z. B. „+118%“, „0,8 s“, „6 Wo.“',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Beschriftung',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.max(4).warning('Das Raster ist auf vier Kennzahlen ausgelegt.'),
    }),
  ],
  preview: {prepare: () => ({title: 'Stimmen'})},
})

/* 8 — KONTAKT -------------------------------------------------------------- */
export const sectionKontakt = defineType({
  name: 'sectionKontakt',
  title: 'Kontakt',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine Überschrift', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'lead', title: 'Einleitungstext', type: 'text', rows: 3}),
    defineField({name: 'primaryCta', title: 'Button (hell)', type: 'link'}),
    defineField({
      name: 'secondaryCta',
      title: 'Button (dezent)',
      type: 'link',
      description: 'Wird in Schreibmaschinenschrift gesetzt – gedacht für die E-Mail-Adresse.',
    }),
  ],
  preview: {prepare: () => ({title: 'Kontakt'})},
})
