import {defineCliConfig} from 'sanity/cli'

/**
 * Konfiguration für die Sanity-Kommandozeile (sanity dev / build / deploy).
 * Projekt-ID und Dataset stehen zentral hier – dieselben Werte nutzt auch
 * das Frontend (siehe ../cms/config.js).
 */
export default defineCliConfig({
  api: {
    projectId: 'fohvltfb',
    dataset: 'production',
  },
  /** Name der gehosteten Studio-URL: https://krenzer-design.sanity.studio */
  studioHost: 'krenzer-design',
  deployment: {
    appId: 'twc55j659ot90ivaqqu7pkeg',
    autoUpdates: true,
  },
})
