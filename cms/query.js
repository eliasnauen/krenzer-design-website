/* Eine einzige GROQ-Abfrage holt alles, was die Seite braucht — ein Request pro Aufruf.

   Jeder Abschnitt der Startseite ist im Studio ein eigenes Dokument mit fester ID
   (siehe studio/structure.ts). Hier werden sie unter sprechenden Namen gebündelt. */

export const CONTENT_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    brandInitial,
    brandName,
    mainNav[]{_key, label, href},
    headerSecondaryLink{label, href},
    headerCta{label, href},
    footerAbout,
    footerColumns[]{_key, title, links[]{_key, label, href}},
    footerCopyright,
    footerNote,
    seoTitle,
    seoDescription,
    shareTitle,
    shareDescription
  },
  "hero": *[_id == "hero"][0]{
    badge,
    heading,
    lead,
    primaryCta{label, href},
    secondaryCta{label, href},
    showcase{
      title,
      status,
      snippet{language, code, caret},
      metricsLabel,
      metrics[]{_key, label, value, fill},
      metricsFootnote
    }
  },
  "logos": *[_id == "sectionLogos"][0]{
    label,
    logos[]{_key, name, style}
  },
  "leistungen": *[_id == "sectionLeistungen"][0]{
    eyebrow,
    heading,
    lead,
    items[]{_key, title, text, tags}
  },
  "stack": *[_id == "sectionStack"][0]{
    eyebrow,
    heading,
    meta,
    tabs[]{_key, title, summary, fileName, fileMeta, tags, snippet{language, code, caret}}
  },
  "arbeiten": *[_id == "sectionArbeiten"][0]{
    eyebrow,
    heading,
    link{label, href},
    projects[]->{_id, client, description, kpi, year, href}
  },
  "prozess": *[_id == "sectionProzess"][0]{
    eyebrow,
    heading,
    steps[]{_key, label, title, text, highlighted}
  },
  "stimmen": *[_id == "sectionStimmen"][0]{
    quote,
    accent,
    initials,
    author,
    role,
    kpis[]{_key, value, label}
  },
  "kontakt": *[_id == "sectionKontakt"][0]{
    eyebrow,
    heading,
    lead,
    primaryCta{label, href},
    secondaryCta{label, href}
  }
}`
