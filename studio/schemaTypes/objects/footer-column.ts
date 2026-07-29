import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThListIcon} from '@sanity/icons/ThList'

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer-Spalte',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'title', links: 'links'},
    prepare({title, links}) {
      const count = Array.isArray(links) ? links.length : 0
      return {title, subtitle: `${count} ${count === 1 ? 'Link' : 'Links'}`}
    },
  },
})
