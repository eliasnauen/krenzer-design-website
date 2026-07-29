import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {RocketIcon} from '@sanity/icons/Rocket'

/** Dokumenttypen, die es nur einmal gibt — sie tauchen nicht in der Auto-Liste auf. */
const SINGLETONS = ['homePage', 'siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Inhalte')
    .items([
      S.listItem()
        .title('Startseite')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Startseite')),

      S.divider(),

      S.documentTypeListItem('project').title('Projekte').icon(RocketIcon),

      S.divider(),

      S.listItem()
        .title('Website-Einstellungen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website-Einstellungen'),
        ),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? ![...SINGLETONS, 'project'].includes(id) : false
      }),
    ])
