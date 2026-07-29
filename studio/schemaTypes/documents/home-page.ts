import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/**
 * Die Startseite. Ein Reiter pro Abschnitt — in derselben Reihenfolge,
 * in der die Abschnitte auf der Website untereinander stehen.
 *
 * Singleton: es gibt genau ein Dokument davon (siehe structure.ts).
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Startseite',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: '1 · Einstieg', default: true},
    {name: 'logos', title: '2 · Kundenlogos'},
    {name: 'services', title: '3 · Leistungen'},
    {name: 'stack', title: '4 · Unter der Haube'},
    {name: 'work', title: '5 · Arbeiten'},
    {name: 'process', title: '6 · Prozess'},
    {name: 'testimonial', title: '7 · Stimmen'},
    {name: 'contact', title: '8 · Kontakt'},
  ],

  fields: [
    // === 1 · Einstieg ========================================================
    defineField({
      name: 'heroBadge',
      title: 'Hinweis über der Überschrift',
      type: 'string',
      group: 'hero',
      description: 'Die Zeile mit dem pulsierenden Punkt, z. B. „Zwei Projektslots frei · Q4 2026“.',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Zeilenumbrüche werden übernommen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroLead',
      title: 'Einleitungstext',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Button (hell)',
      type: 'link',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Button (dezent)',
      type: 'link',
      group: 'hero',
    }),
    defineField({
      name: 'showcaseTitle',
      title: 'Fenstertitel',
      type: 'string',
      group: 'hero',
      description: 'In der Kopfzeile des Code-Fensters, z. B. „krenzer.studio — Hero.tsx“.',
      fieldset: 'showcase',
    }),
    defineField({
      name: 'showcaseStatus',
      title: 'Status-Pille',
      type: 'string',
      group: 'hero',
      description: 'Das kleine grüne Label rechts. Leer lassen, um es auszublenden.',
      fieldset: 'showcase',
    }),
    defineField({
      name: 'showcaseSnippet',
      title: 'Code im Fenster',
      type: 'codeSnippet',
      group: 'hero',
      fieldset: 'showcase',
    }),
    defineField({
      name: 'metricsLabel',
      title: 'Überschrift der Messwerte',
      type: 'string',
      group: 'hero',
      fieldset: 'showcase',
    }),
    defineField({
      name: 'metrics',
      title: 'Messwerte',
      type: 'array',
      group: 'hero',
      fieldset: 'showcase',
      of: [defineArrayMember({type: 'metric'})],
      validation: (rule) => rule.max(4).warning('Mehr als vier Balken wirken unruhig.'),
    }),
    defineField({
      name: 'metricsFootnote',
      title: 'Fußnote unter den Messwerten',
      type: 'text',
      rows: 2,
      group: 'hero',
      fieldset: 'showcase',
      description: 'Zeilenumbrüche werden übernommen.',
    }),

    // === 2 · Kundenlogos =====================================================
    defineField({
      name: 'logosLabel',
      title: 'Beschriftung',
      type: 'string',
      group: 'logos',
      description: 'Steht über dem Laufband, z. B. „Marken, die uns vertrauen“.',
    }),
    defineField({
      name: 'logos',
      title: 'Wortmarken',
      type: 'array',
      group: 'logos',
      of: [defineArrayMember({type: 'logo'})],
      description: 'Das Laufband wiederholt die Liste automatisch — einmal eintragen genügt.',
      validation: (rule) => rule.min(4).warning('Unter vier Namen entsteht eine sichtbare Lücke.'),
    }),

    // === 3 · Leistungen ======================================================
    defineField({
      name: 'servicesEyebrow',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'services',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'servicesLead',
      title: 'Einleitungstext',
      type: 'text',
      rows: 3,
      group: 'services',
    }),
    defineField({
      name: 'services',
      title: 'Leistungen',
      type: 'array',
      group: 'services',
      of: [defineArrayMember({type: 'serviceCard'})],
      description: 'Die Nummern 01, 02 … vergibt die Website automatisch nach dieser Reihenfolge.',
      validation: (rule) => rule.min(1),
    }),

    // === 4 · Unter der Haube =================================================
    defineField({
      name: 'stackEyebrow',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'stack',
    }),
    defineField({
      name: 'stackHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'stack',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stackTabs',
      title: 'Reiter',
      type: 'array',
      group: 'stack',
      of: [defineArrayMember({type: 'stackTab'})],
      description: 'Der erste Reiter ist beim Laden der Seite geöffnet.',
      validation: (rule) => rule.min(1).max(4).warning('Mehr als vier Reiter passen nicht nebeneinander.'),
    }),
    defineField({
      name: 'stackMeta',
      title: 'Technik-Notiz',
      type: 'text',
      rows: 2,
      group: 'stack',
      description: 'Der kleine Text unter den Reitern. Zeilenumbrüche werden übernommen.',
    }),

    // === 5 · Arbeiten ========================================================
    defineField({
      name: 'workEyebrow',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'work',
    }),
    defineField({
      name: 'workHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'work',
      description: 'Zeilenumbrüche werden übernommen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workLink',
      title: 'Link rechts oben',
      type: 'link',
      group: 'work',
      description: 'Aktuell „Alle 140 Projekte →“.',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Projekte auf der Startseite',
      type: 'array',
      group: 'work',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
      description:
        'Auswahl aus der Projektliste im linken Menü. Reihenfolge per Drag & Drop; ' +
        'die Nummerierung 01, 02 … entsteht daraus automatisch.',
      validation: (rule) => rule.unique(),
    }),

    // === 6 · Prozess =========================================================
    defineField({
      name: 'processEyebrow',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'process',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'processSteps',
      title: 'Schritte',
      type: 'array',
      group: 'process',
      of: [defineArrayMember({type: 'processStep'})],
      validation: (rule) => rule.max(4).warning('Mehr als vier Schritte passen nicht in eine Reihe.'),
    }),

    // === 7 · Stimmen =========================================================
    defineField({
      name: 'quote',
      title: 'Zitat',
      type: 'text',
      rows: 4,
      group: 'testimonial',
      description: 'Anführungszeichen bitte mit eintippen.',
    }),
    defineField({
      name: 'quoteAccent',
      title: 'Hervorgehobene Textstelle',
      type: 'string',
      group: 'testimonial',
      description:
        'Dieser Ausschnitt wird im Zitat farbig gesetzt. Muss exakt so im Zitat vorkommen — ' +
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
      name: 'quoteInitials',
      title: 'Initialen',
      type: 'string',
      group: 'testimonial',
      description: 'Der Kreis vor dem Namen, z. B. „MB“.',
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Name',
      type: 'string',
      group: 'testimonial',
    }),
    defineField({
      name: 'quoteRole',
      title: 'Position & Unternehmen',
      type: 'string',
      group: 'testimonial',
    }),
    defineField({
      name: 'kpis',
      title: 'Kennzahlen',
      type: 'array',
      group: 'testimonial',
      of: [defineArrayMember({type: 'kpi'})],
      validation: (rule) => rule.max(4).warning('Das Raster ist auf vier Kennzahlen ausgelegt.'),
    }),

    // === 8 · Kontakt =========================================================
    defineField({
      name: 'ctaEyebrow',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Überschrift',
      type: 'text',
      rows: 2,
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaLead',
      title: 'Einleitungstext',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Button (hell)',
      type: 'link',
      group: 'contact',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Button (dezent)',
      type: 'link',
      group: 'contact',
      description: 'Wird in Schreibmaschinenschrift gesetzt — gedacht für die E-Mail-Adresse.',
    }),
  ],

  fieldsets: [
    {
      name: 'showcase',
      title: 'Code-Fenster',
      description: 'Das Fenster unter dem Einstieg — Code links, Messwerte rechts.',
      options: {collapsible: true, collapsed: false},
    },
  ],

  preview: {
    select: {title: 'heroHeading'},
    prepare({title}) {
      return {title: 'Startseite', subtitle: title}
    },
  },
})
