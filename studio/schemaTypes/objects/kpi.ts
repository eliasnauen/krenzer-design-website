import {defineField, defineType} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'

export const kpi = defineType({
  name: 'kpi',
  title: 'Kennzahl',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'value',
      title: 'Zahl',
      type: 'string',
      description: 'z. B. „+118%“, „0,8 s“, „6 Wo.“',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Beschriftung',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'value', subtitle: 'label'},
  },
})
