import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

/**
 * Ein einzelner Link (Navigation, Button, Footer).
 * `href` bleibt bewusst ein freies Textfeld, damit auch Sprungmarken (#kontakt),
 * E-Mail (mailto:) und Telefon (tel:) eingetragen werden können.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
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
        'Sprungmarke auf dieser Seite (z. B. #kontakt), vollständige URL (https://…), ' +
        'E-Mail (mailto:hallo@krenzer.design) oder Telefon (tel:+4993112345).',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
