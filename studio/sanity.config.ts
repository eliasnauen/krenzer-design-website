import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

/**
 * Zentrale Studio-Konfiguration.
 *
 * Das Studio ist die Redaktionsoberfläche: Hier werden alle Texte, Links und
 * Kennzahlen der Krenzer-Design-Website gepflegt. Die Inhalte lädt die
 * öffentliche Website (index.html) anschließend direkt aus Sanity.
 *
 * Lokal starten:   npm run dev      →  http://localhost:3333
 * Live stellen:    npm run deploy   →  https://krenzer-design.sanity.studio
 */
export default defineConfig({
  name: 'default',
  title: 'Krenzer Design – Redaktion',

  projectId: 'fohvltfb',
  dataset: 'production',

  plugins: [
    // Aufgeräumte, deutschsprachige Seitenleiste statt einer langen Typenliste.
    structureTool({structure, title: 'Inhalte'}),
    // GROQ-Abfragen live ausprobieren (nur für Entwickler:innen relevant).
    visionTool({defaultApiVersion: '2026-07-01'}),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Über den globalen „+"-Knopf lassen sich nur Projekte neu anlegen.
    // Alle Einzelstücke (Abschnitte, Einstellungen …) gibt es genau einmal.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => item.templateId === 'project')
      }
      return prev
    },
  },
})
