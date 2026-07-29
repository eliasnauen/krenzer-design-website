import {homePage} from './documents/home-page'
import {project} from './documents/project'
import {siteSettings} from './documents/site-settings'

import {codeSnippet} from './objects/code-snippet'
import {footerColumn} from './objects/footer-column'
import {kpi} from './objects/kpi'
import {link} from './objects/link'
import {logo} from './objects/logo'
import {metric} from './objects/metric'
import {processStep} from './objects/process-step'
import {serviceCard} from './objects/service-card'
import {stackTab} from './objects/stack-tab'

export const schemaTypes = [
  // Dokumente
  homePage,
  siteSettings,
  project,

  // Bausteine
  link,
  footerColumn,
  logo,
  metric,
  kpi,
  serviceCard,
  processStep,
  codeSnippet,
  stackTab,
]
