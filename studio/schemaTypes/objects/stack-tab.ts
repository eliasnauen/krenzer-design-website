import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitVerticalIcon} from '@sanity/icons/SplitVertical'

/**
 * Ein Reiter im Abschnitt „Unter der Haube“: links Titel + Erklärung,
 * rechts der zugehörige Datei-Ausschnitt.
 */
export const stackTab = defineType({
  name: 'stackTab',
  title: 'Stack-Reiter',
  type: 'object',
  icon: SplitVerticalIcon,
  groups: [
    {name: 'tab', title: 'Reiter', default: true},
    {name: 'viewer', title: 'Ansicht rechts'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'tab',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 2,
      group: 'tab',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fileName',
      title: 'Dateiname',
      type: 'string',
      group: 'viewer',
      description: 'Steht in der Kopfzeile der Ansicht, z. B. „styles/tokens.css“.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fileMeta',
      title: 'Zusatz in der Kopfzeile',
      type: 'string',
      group: 'viewer',
      description: 'Rechts neben dem Dateinamen, z. B. „auto-generiert · 04:12“.',
    }),
    defineField({
      name: 'snippet',
      title: 'Code',
      type: 'codeSnippet',
      group: 'viewer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Schlagworte',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      group: 'viewer',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'fileName'},
  },
})
