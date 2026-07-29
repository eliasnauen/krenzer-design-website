import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Alles, was auf jeder Seite gleich ist: Marke, Navigation, Footer, Suchmaschinen-Text.
 * Singleton — es gibt genau ein Dokument davon (siehe structure.ts).
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Marke', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'Suchmaschinen & Teilen'},
  ],

  fields: [
    // --- Marke ---------------------------------------------------------------
    defineField({
      name: 'brandInitial',
      title: 'Logo-Buchstabe',
      type: 'string',
      group: 'brand',
      description: 'Das Kürzel im schwarzen Quadrat. Ein einzelner Buchstabe.',
      validation: (rule) => rule.required().max(2),
    }),
    defineField({
      name: 'brandName',
      title: 'Name',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),

    // --- Navigation ----------------------------------------------------------
    defineField({
      name: 'mainNav',
      title: 'Hauptnavigation',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'link'})],
      description:
        'Die Punkte oben in der Kopfzeile. Zeigt ein Punkt auf eine Sprungmarke ' +
        '(#leistungen, #arbeiten, #stack, #prozess), wird er beim Scrollen automatisch aktiv.',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'headerSecondaryLink',
      title: 'Textlink rechts',
      type: 'link',
      group: 'navigation',
      description: 'Der unauffällige Link neben dem Button (aktuell „Kundenlogin“).',
    }),
    defineField({
      name: 'headerCta',
      title: 'Button rechts',
      type: 'link',
      group: 'navigation',
    }),

    // --- Footer --------------------------------------------------------------
    defineField({
      name: 'footerAbout',
      title: 'Kurztext',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Spalten',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'footerColumn'})],
      validation: (rule) => rule.max(3).warning('Mehr als drei Spalten sprengen das Raster.'),
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Copyright-Zeile',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerNote',
      title: 'Notiz rechts unten',
      type: 'string',
      group: 'footer',
      description: 'Aktuell „Gebaut in Würzburg“.',
    }),

    // --- SEO -----------------------------------------------------------------
    defineField({
      name: 'seoTitle',
      title: 'Seitentitel',
      type: 'string',
      group: 'seo',
      description: 'Steht im Browser-Tab und als Überschrift in den Suchergebnissen.',
      validation: (rule) =>
        rule.max(65).warning('Über 65 Zeichen kürzt Google die Anzeige ab.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Beschreibung',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Über 160 Zeichen kürzt Google die Anzeige ab.'),
    }),
    defineField({
      name: 'shareTitle',
      title: 'Titel beim Teilen',
      type: 'string',
      group: 'seo',
      description: 'Was in WhatsApp, LinkedIn & Co. als Überschrift erscheint.',
    }),
    defineField({
      name: 'shareDescription',
      title: 'Text beim Teilen',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return {title: 'Website-Einstellungen'}
    },
  },
})
