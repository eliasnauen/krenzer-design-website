import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {BookIcon} from '@sanity/icons/Book'
import {BlockElementIcon} from '@sanity/icons/BlockElement'
import {SplitVerticalIcon} from '@sanity/icons/SplitVertical'
import {RocketIcon} from '@sanity/icons/Rocket'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {CommentIcon} from '@sanity/icons/Comment'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/**
 * Baut die linke Navigation im Studio. Statt einer technischen Typenliste sieht
 * die Redaktion eine Gliederung, die dem Aufbau der Website entspricht.
 *
 * „Singletons“ (Einzelstücke) öffnen direkt das eine vorhandene Dokument –
 * niemand kann versehentlich einen zweiten Kopfbereich anlegen.
 */

// Hilfsfunktion: ein Einzelstück-Eintrag (feste Dokument-ID = Typname).
const singleton = (S: any, typeName: string, title: string, icon?: any) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Inhalte')
    .items([
      singleton(S, 'siteSettings', 'Website-Einstellungen', CogIcon),
      S.divider(),
      S.listItem()
        .title('Startseite')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Startseite – Abschnitte')
            .items([
              singleton(S, 'hero', 'Kopfbereich', HomeIcon),
              singleton(S, 'sectionLogos', 'Kundenlogos', BookIcon),
              singleton(S, 'sectionLeistungen', 'Leistungen', BlockElementIcon),
              singleton(S, 'sectionStack', 'Unter der Haube', SplitVerticalIcon),
              singleton(S, 'sectionArbeiten', 'Arbeiten', RocketIcon),
              singleton(S, 'sectionProzess', 'Prozess', CalendarIcon),
              singleton(S, 'sectionStimmen', 'Stimmen', CommentIcon),
              singleton(S, 'sectionKontakt', 'Kontakt', EnvelopeIcon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Projekte')
        .icon(RocketIcon)
        .child(S.documentTypeList('project').title('Projekte')),
    ])
