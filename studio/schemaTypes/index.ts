import {codeSnippet, link} from './shared'
import {siteSettings} from './siteSettings'
import {
  hero,
  sectionLogos,
  sectionLeistungen,
  sectionStack,
  sectionArbeiten,
  sectionProzess,
  sectionStimmen,
  sectionKontakt,
} from './sections'
import {project} from './project'

/** Alle im Studio bekannten Inhaltstypen. */
export const schemaTypes = [
  // Bausteine
  link,
  codeSnippet,
  // Stammdaten
  siteSettings,
  // Startseiten-Abschnitte (Reihenfolge = Reihenfolge auf der Seite)
  hero,
  sectionLogos,
  sectionLeistungen,
  sectionStack,
  sectionArbeiten,
  sectionProzess,
  sectionStimmen,
  sectionKontakt,
  // Referenzen
  project,
]
