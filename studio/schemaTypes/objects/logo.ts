import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'

/**
 * Kundenname im Logo-Laufband. Die Logos sind reine Wortmarken —
 * "Schriftbild" wählt aus, wie der Name gesetzt wird.
 */
export const logo = defineType({
  name: 'logo',
  title: 'Wortmarke',
  type: 'object',
  icon: BookIcon,
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
      description: 'Nur Optik — damit das Laufband nicht nach einer einzigen Schrift aussieht.',
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
  preview: {
    select: {title: 'name', subtitle: 'style'},
  },
})
