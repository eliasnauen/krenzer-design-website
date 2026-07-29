import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

/**
 * Ein Referenzprojekt. Anders als die Startseiten-Abschnitte gibt es hiervon
 * mehrere – deshalb ein normaler Dokumenttyp mit eigener Liste im Menü.
 * Welche Projekte auf der Startseite erscheinen, wird unter
 * „Startseite → Arbeiten“ ausgewählt.
 */
export const project = defineType({
  name: 'project',
  title: 'Projekt',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'client',
      title: 'Kunde',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'string',
      description: 'Eine Zeile, z. B. „B2B-Plattform · Relaunch & Design-System“.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kpi',
      title: 'Ergebnis',
      type: 'string',
      description: 'Die hervorgehobene Zahl, z. B. „+118% Traffic“.',
    }),
    defineField({
      name: 'year',
      title: 'Jahr',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Verlinkung',
      type: 'string',
      description: 'Optional. Leer lassen, wenn die Zeile (noch) nirgendwohin führt.',
    }),
  ],
  orderings: [
    {title: 'Jahr, neueste zuerst', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'client', description: 'description', year: 'year'},
    prepare: ({title, description, year}) => ({
      title,
      subtitle: [year, description].filter(Boolean).join(' · '),
    }),
  },
})
