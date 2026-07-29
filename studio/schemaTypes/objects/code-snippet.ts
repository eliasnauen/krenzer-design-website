import {defineField, defineType} from 'sanity'
import {CodeBlockIcon} from '@sanity/icons/CodeBlock'

/**
 * Ein Code-Ausschnitt, wie er im Hero-Fenster und im Stack-Viewer getippt wird.
 *
 * Bewusst als einfaches Textfeld: hier wird nur getippt, was zu sehen sein soll.
 * Die Einfärbung (Kommentare, Strings, Schlüsselwörter) macht die Website selbst
 * anhand der gewählten Sprache — im Studio muss dafür nichts markiert werden.
 * Leerzeilen im Text werden auch auf der Website zu Leerzeilen.
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
      description: 'Steuert nur die Einfärbung.',
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
        'Eine Zeile pro Zeile. Zu lange Zeilen brechen im Fenster nicht um — ' +
        'ca. 60 Zeichen sind das Maximum.',
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
      const firstLine = String(code || '').split('\n')[0] || 'Leer'
      return {title: firstLine, subtitle: language}
    },
  },
})
