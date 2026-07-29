import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

/**
 * Eine Zeile im Messwert-Panel des Hero-Fensters:
 * Beschriftung, angezeigter Wert und die Füllung des Balkens.
 */
export const metric = defineType({
  name: 'metric',
  title: 'Messwert',
  type: 'object',
  icon: BarChartIcon,
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
      description: 'Wie weit der Balken läuft — 0 bis 100.',
      initialValue: 100,
      validation: (rule) => rule.required().min(0).max(100),
    }),
  ],
  preview: {
    select: {title: 'label', value: 'value', fill: 'fill'},
    prepare({title, value, fill}) {
      return {title, subtitle: `${value} · ${fill}%`}
    },
  },
})
