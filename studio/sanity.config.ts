import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

/** Dokumente, von denen es genau eines gibt — „Erstellen“ und „Löschen“ werden ausgeblendet. */
const SINGLETONS = new Set(['homePage', 'siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Krenzer Design',

  projectId: 'fohvltfb',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Singletons nicht im "Neu erstellen"-Menü anbieten
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(
            ({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action),
          )
        : actions,
  },
})
