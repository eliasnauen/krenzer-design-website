import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'
import {CodeBlockIcon} from '@sanity/icons/CodeBlock'

/**
 * Gemeinsame Bausteine, die von mehreren Abschnitten genutzt werden.
 */

/**
 * Ein Link – für Navigation, Buttons und Footer.
 * Das Ziel bleibt bewusst ein freies Textfeld, damit auch Sprungmarken auf
 * dieser Seite (#kontakt), E-Mail (mailto:) und Telefon (tel:) möglich sind.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  options: {columns: 2},
  fields: [
    defineField({
      name: 'label',
      title: 'Beschriftung',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Ziel',
      type: 'string',
      description:
        'Sprungmarke auf dieser Seite (#kontakt), vollständige Adresse (https://…), ' +
        'E-Mail (mailto:hallo@krenzer.design) oder Telefon (tel:+4993112345).',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

/**
 * Ein Code-Ausschnitt, wie er im Kopfbereich und im Stack-Fenster getippt wird.
 *
 * Bewusst nur ein Textfeld: hier wird eingetippt, was zu sehen sein soll.
 * Die Einfärbung (Kommentare, Texte, Schlüsselwörter) übernimmt die Website
 * anhand der gewählten Sprache – im Studio ist dafür nichts zu markieren.
 * Leerzeilen im Text bleiben auch auf der Website Leerzeilen.
 */
export const codeSnippet = defineType({
  name: 'codeSnippet',
  title: 'Code-Ausschnitt',
  type: 'object',
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Sprache',
      type: 'string',
      description: 'Steuert ausschließlich die Einfärbung.',
      options: {
        list: [
          {title: 'JavaScript / TypeScript', value: 'js'},
          {title: 'CSS', value: 'css'},
          {title: 'YAML / Konfiguration', value: 'yaml'},
          {title: 'Ohne Einfärbung', value: 'plain'},
        ],
      },
      initialValue: 'js',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 12,
      description:
        'Eine Zeile pro Zeile. Zu lange Zeilen brechen im Fenster nicht um – ' +
        'etwa 60 Zeichen sind das Maximum.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caret',
      title: 'Blinkender Cursor am Ende',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {language: 'language', code: 'code'},
    prepare({language, code}) {
      return {title: String(code || 'Leer').split('\n')[0], subtitle: language}
    },
  },
})
