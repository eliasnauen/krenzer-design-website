import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons/BlockElement'

/**
 * Eine Leistungs-Karte. Die Nummerierung (01, 02, …) entsteht automatisch
 * aus der Reihenfolge in der Liste — einfach per Drag & Drop sortieren.
 */
export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Leistung',
  type: 'object',
  icon: BlockElementIcon,
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
      description: 'Die kleinen Chips unter dem Text. Zwei bis vier funktionieren am besten.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text'},
  },
})
