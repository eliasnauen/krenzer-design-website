/* Inhalte aus Sanity in das bestehende Markup schreiben.

   Grundsatz: index.html bleibt vollständig und gültig — die eingecheckte Fassung ist der
   letzte bekannte Stand und damit das, was Netlify ausliefert, bevor der Abruf da ist.
   Geschrieben wird nur, was sich tatsächlich unterscheidet (`setText`/`setHtml`/`setAttr`
   vergleichen vorher). Dadurch startet z. B. die Tipp-Animation der Code-Fenster nicht
   neu, wenn der CMS-Stand dem ausgelieferten Markup entspricht. */

import {buildCodeHtml} from './highlight.js'
import {escapeAttr, escapeText} from './html.js'

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

/* --- kleine Schreibhelfer ------------------------------------------------- */

function setText(element, value) {
  if (!element || value == null) return
  const next = String(value)
  if (element.textContent !== next) element.textContent = next
}

function setHtml(element, html) {
  if (!element || html == null) return
  if (element.innerHTML !== html) element.innerHTML = html
}

function setAttr(element, name, value) {
  if (!element || value == null) return
  const next = String(value)
  if (element.getAttribute(name) !== next) element.setAttribute(name, next)
}

/** Zeilenumbrüche aus einem Textfeld werden zu <br>. */
function multiline(value) {
  return escapeText(value).replace(/\n/g, '<br>')
}

function setLink(element, link) {
  if (!element || !link) return
  setText(element, link.label)
  setAttr(element, 'href', link.href)
}

/** 0 → "01" */
function ordinal(index) {
  return String(index + 1).padStart(2, '0')
}

function tagsHtml(tags) {
  if (!Array.isArray(tags)) return ''
  return tags.map((tag) => `<span class="tag">${escapeText(tag)}</span>`).join('')
}

/* --- Kopfbereich des Dokuments -------------------------------------------- */

function renderHead(settings) {
  if (settings.seoTitle && document.title !== settings.seoTitle) {
    document.title = settings.seoTitle
  }
  setAttr($('meta[name="description"]'), 'content', settings.seoDescription)
  setAttr($('meta[property="og:title"]'), 'content', settings.shareTitle)
  setAttr($('meta[property="og:description"]'), 'content', settings.shareDescription)
}

/* --- Kopfzeile & Navigation ----------------------------------------------- */

function renderChrome(settings) {
  $$('.brand__mark').forEach((element) => setText(element, settings.brandInitial))
  $$('.brand__name').forEach((element) => setText(element, settings.brandName))

  if (Array.isArray(settings.mainNav)) {
    setHtml(
      $('#nav'),
      settings.mainNav
        .map(
          (item) =>
            `<a href="${escapeAttr(item.href)}">${escapeText(item.label)}` +
            '<span class="nav__bar"></span></a>',
        )
        .join(''),
    )
  }

  setLink($('.header__actions .link-quiet'), settings.headerSecondaryLink)
  setLink($('.header__actions .btn'), settings.headerCta)
}

/* --- 1 · Einstieg ---------------------------------------------------------- */

function renderHero(home) {
  if (home.heroBadge) {
    setHtml(
      $('.badge'),
      '<span class="badge__dot"><span class="badge__ring"></span></span>' +
        escapeText(home.heroBadge),
    )
  }

  setHtml($('.display'), multiline(home.heroHeading))
  setText($('.hero__lead'), home.heroLead)
  setLink($('.hero__actions .btn--primary'), home.heroPrimaryCta)
  setLink($('.hero__actions .btn--ghost'), home.heroSecondaryCta)

  setText($('.window__title'), home.showcaseTitle)
  setText($('.pill-live'), home.showcaseStatus)

  const snippet = home.showcaseSnippet
  if (snippet?.code) {
    setHtml($('.code--split'), buildCodeHtml(snippet.code, snippet.language, snippet.caret))
  }

  setText($('.metrics__label'), home.metricsLabel)

  if (Array.isArray(home.metrics)) {
    setHtml(
      $('.metrics__list'),
      home.metrics
        .map((metric, index) => {
          // Die Balken laufen versetzt an, damit sie nicht wie eine Wand wirken.
          const delay = (0.45 + index * 0.35).toFixed(2)
          const duration = (2.8 + index * 0.3).toFixed(1)
          const fill = Math.max(0, Math.min(100, Number(metric.fill) || 0))
          return (
            '<div class="metric">' +
            `<div class="metric__head"><span>${escapeText(metric.label)}</span>` +
            `<span class="mono">${escapeText(metric.value)}</span></div>` +
            '<div class="meter"><span class="meter__fill" ' +
            `style="--w:${fill}%;--delay:${delay}s;--dur:${duration}s"></span></div>` +
            '</div>'
          )
        })
        .join(''),
    )
  }

  setHtml($('.metrics__foot'), multiline(home.metricsFootnote))
}

/* --- 2 · Kundenlogos ------------------------------------------------------- */

function renderLogos(home) {
  setText($('.marquee-section__label'), home.logosLabel)

  if (!Array.isArray(home.logos) || home.logos.length === 0) return

  // Das Laufband braucht die Liste doppelt: die Animation schiebt um exakt 50 %.
  const pass = (hidden) =>
    home.logos
      .map(
        (logo) =>
          `<span class="logo logo--${escapeAttr(logo.style || 'a')}"` +
          `${hidden ? ' aria-hidden="true"' : ''}>${escapeText(logo.name)}</span>`,
      )
      .join('')

  setHtml($('.marquee__track'), pass(false) + pass(true))
}

/* --- 3 · Leistungen -------------------------------------------------------- */

function renderServices(home) {
  setText($('#leistungen .eyebrow'), home.servicesEyebrow)
  setHtml($('#leistungen .h2'), multiline(home.servicesHeading))
  setText($('#leistungen .section__lead'), home.servicesLead)

  if (!Array.isArray(home.services)) return

  setHtml(
    $('#leistungen .cards'),
    home.services
      .map(
        (service, index) =>
          '<article class="card reveal">' +
          `<div class="card__num">${ordinal(index)}</div>` +
          `<h3 class="card__title">${escapeText(service.title)}</h3>` +
          `<p class="card__text">${escapeText(service.text)}</p>` +
          `<div class="tags">${tagsHtml(service.tags)}</div>` +
          '</article>',
      )
      .join(''),
  )
}

/* --- 4 · Unter der Haube --------------------------------------------------- */

function paneHtml(tab, active) {
  const snippet = tab.snippet || {}
  return (
    `<div class="viewer__pane${active ? ' is-active' : ''}" ` +
    `data-pane="${escapeAttr(tab._key)}" ` +
    `data-file-name="${escapeAttr(tab.fileName)}" ` +
    `data-file-meta="${escapeAttr(tab.fileMeta || '')}">` +
    `<pre class="code">${buildCodeHtml(snippet.code, snippet.language, snippet.caret)}</pre>` +
    `<div class="viewer__tags">${tagsHtml(tab.tags)}</div>` +
    '</div>'
  )
}

function renderStack(home) {
  setText($('#stack .eyebrow'), home.stackEyebrow)
  setHtml($('#stack .h2'), multiline(home.stackHeading))

  const tabs = home.stackTabs
  if (!Array.isArray(tabs) || tabs.length === 0) return

  setHtml(
    $('.stack__side'),
    tabs
      .map((tab, index) => {
        const active = index === 0
        return (
          `<button class="tab${active ? ' is-active' : ''}" type="button" ` +
          `data-tab="${escapeAttr(tab._key)}" aria-selected="${active}">` +
          `<div class="tab__head"><span class="tab__num">${ordinal(index)}</span>` +
          `<span class="tab__title">${escapeText(tab.title)}</span></div>` +
          `<div class="tab__text">${escapeText(tab.summary)}</div>` +
          '</button>'
        )
      })
      .join('') + `<div class="stack__meta">${multiline(home.stackMeta)}</div>`,
  )

  const viewer = $('.stack__viewer')
  if (!viewer) return

  const panes = $$('.viewer__pane', viewer)
  const sameStructure =
    panes.length === tabs.length && panes.every((pane, i) => pane.dataset.pane === tabs[i]._key)

  if (sameStructure) {
    // Gleiche Reiter wie im Markup: nur die Inhalte nachziehen, Elemente bleiben stehen.
    panes.forEach((pane, index) => {
      const tab = tabs[index]
      const snippet = tab.snippet || {}
      setAttr(pane, 'data-file-name', tab.fileName)
      setAttr(pane, 'data-file-meta', tab.fileMeta || '')
      setHtml($('.code', pane), buildCodeHtml(snippet.code, snippet.language, snippet.caret))
      setHtml($('.viewer__tags', pane), tagsHtml(tab.tags))
    })
  } else {
    panes.forEach((pane) => pane.remove())
    viewer.insertAdjacentHTML(
      'beforeend',
      tabs.map((tab, index) => paneHtml(tab, index === 0)).join(''),
    )
  }

  setText($('#fileName'), tabs[0].fileName)
  setText($('#fileMeta'), tabs[0].fileMeta || '')
}

/* --- 5 · Arbeiten ---------------------------------------------------------- */

function renderWork(home) {
  setText($('#arbeiten .eyebrow'), home.workEyebrow)
  setHtml($('#arbeiten .h2'), multiline(home.workHeading))
  setLink($('#arbeiten .link-underline'), home.workLink)

  const projects = home.featuredProjects
  if (!Array.isArray(projects)) return

  setHtml(
    $('#cases'),
    projects
      .map(
        (project, index) =>
          `<a class="case" href="${escapeAttr(project.href || '#arbeiten')}">` +
          `<span class="case__num">${ordinal(index)}</span>` +
          `<span class="case__name">${escapeText(project.client)}</span>` +
          `<span class="case__desc">${escapeText(project.description)}</span>` +
          `<span class="case__kpi">${escapeText(project.kpi || '')}</span>` +
          `<span class="case__year">${escapeText(project.year)}` +
          '<span class="case__arrow">↗</span></span>' +
          '</a>',
      )
      .join(''),
  )
}

/* --- 6 · Prozess ----------------------------------------------------------- */

function renderProcess(home) {
  setText($('#prozess .eyebrow'), home.processEyebrow)
  setHtml($('#prozess .h2'), multiline(home.processHeading))

  if (!Array.isArray(home.processSteps)) return

  setHtml(
    $('#prozess .steps'),
    home.processSteps
      .map(
        (step) =>
          `<div class="step${step.highlighted ? ' step--active' : ''}">` +
          `<div class="step__label">${escapeText(step.label)}</div>` +
          `<h4 class="step__title">${escapeText(step.title)}</h4>` +
          `<p class="step__text">${escapeText(step.text)}</p>` +
          '</div>',
      )
      .join(''),
  )
}

/* --- 7 · Stimmen ----------------------------------------------------------- */

function quoteHtml(quote, accent) {
  const text = String(quote ?? '')
  if (!accent) return escapeText(text)

  const start = text.indexOf(accent)
  if (start === -1) return escapeText(text)

  return (
    escapeText(text.slice(0, start)) +
    `<span class="accent">${escapeText(accent)}</span>` +
    escapeText(text.slice(start + accent.length))
  )
}

function renderTestimonial(home) {
  setHtml($('.quote p'), quoteHtml(home.quote, home.quoteAccent))
  setText($('.avatar'), home.quoteInitials)

  if (home.quoteAuthor) {
    setHtml(
      $('.quote__author'),
      `${escapeText(home.quoteAuthor)}<br><span>${escapeText(home.quoteRole || '')}</span>`,
    )
  }

  if (!Array.isArray(home.kpis)) return

  setHtml(
    $('.kpis'),
    home.kpis
      .map(
        (kpi) =>
          '<div class="kpi">' +
          `<div class="kpi__value">${escapeText(kpi.value)}</div>` +
          `<div class="kpi__label">${escapeText(kpi.label)}</div>` +
          '</div>',
      )
      .join(''),
  )
}

/* --- 8 · Kontakt ----------------------------------------------------------- */

function renderCta(home) {
  setText($('#kontakt .eyebrow'), home.ctaEyebrow)
  setHtml($('#kontakt .h2'), multiline(home.ctaHeading))
  setText($('.cta__lead'), home.ctaLead)
  setLink($('.cta__actions .btn--primary'), home.ctaPrimary)
  setLink($('.cta__actions .btn--mono'), home.ctaSecondary)
}

/* --- Footer ---------------------------------------------------------------- */

function renderFooter(settings) {
  setText($('.footer__about'), settings.footerAbout)

  const grid = $('.footer__grid')
  if (grid && Array.isArray(settings.footerColumns)) {
    const columns = settings.footerColumns
      .map(
        (column) =>
          '<div class="footer__col">' +
          `<div class="footer__label">${escapeText(column.title)}</div>` +
          (column.links || [])
            .map((link) => `<a href="${escapeAttr(link.href)}">${escapeText(link.label)}</a>`)
            .join('') +
          '</div>',
      )
      .join('')

    const current = $$('.footer__col', grid)
    if (current.map((column) => column.outerHTML).join('') !== columns) {
      current.forEach((column) => column.remove())
      grid.insertAdjacentHTML('beforeend', columns)
    }
  }

  const bottom = $$('.footer__bottom span')
  setText(bottom[0], settings.footerCopyright)
  setText(bottom[1], settings.footerNote)
}

/* --- öffentlicher Einstieg -------------------------------------------------- */

/** Schreibt einen kompletten CMS-Stand in die Seite. */
export function applyContent(content) {
  const settings = content?.settings ?? {}
  const home = content?.home ?? {}

  renderHead(settings)
  renderChrome(settings)
  renderHero(home)
  renderLogos(home)
  renderServices(home)
  renderStack(home)
  renderWork(home)
  renderProcess(home)
  renderTestimonial(home)
  renderCta(home)
  renderFooter(settings)
}
