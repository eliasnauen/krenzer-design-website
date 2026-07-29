import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const processStep = defineType({
  name: 'processStep',
  title: 'Prozess-Schritt',
  type: 'object',
  icon: CalendarIcon,
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
      description: 'Setzt die helle Linie über dem Schritt. Üblicherweise nur beim ersten.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'label'},
  },
})
