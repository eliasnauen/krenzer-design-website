/* Code-Ausschnitte aus dem CMS in die getippte Fenster-Darstellung übersetzen.

   Im Studio wird nur reiner Text gepflegt. Hier entsteht daraus
   - die Einfärbung (dieselben Klassen wie in styles.css: c-com, c-key, c-fn, c-attr, c-str)
   - und die Tipp-Animation (--s = Zeichen, --dur = Dauer, --d = Startverzögerung). */

import {escapeText} from './html.js'

/** Dauer einer Zeile, abgeleitet aus ihrer Länge. */
const SECONDS_PER_CHAR = 0.0129
const MIN_DURATION = 0.16

/** Die nächste Zeile startet, bevor die vorherige fertig ist — das wirkt flüssiger. */
const OVERLAP = 0.72

/**
 * Ein Muster pro Sprache. Jede Alternative ist genau eine Gruppe; die Position der
 * Gruppe bestimmt über `classes`, welche CSS-Klasse gesetzt wird.
 * Reihenfolge = Vorrang: Kommentare und Strings zuerst, damit Schlüsselwörter
 * darin nicht mehr eingefärbt werden.
 */
const LANGUAGES = {
  js: {
    pattern: new RegExp(
      [
        /(\/\/[^\n]*)/, // 1 Kommentar
        /('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)/, // 2 String
        /([A-Za-z_$][\w$]*)(?=\s*:)/, // 3 Objekt-Schlüssel
        /\b(export|default|function|return|const|let|var|import|from|new|class|extends|async|await|type|interface|if|else|for|in|of|typeof)\b/, // 4 Schlüsselwort
        /(?<=<\/?)([A-Za-z][\w.]*)/, // 5 Element-Name
        /([A-Za-z_$][\w$]*)(?=\s*\()/, // 6 Funktionsaufruf
        /([A-Za-z][\w-]*)(?==(?!=))/, // 7 JSX-Attribut
      ]
        .map((re) => re.source)
        .join('|'),
      'g',
    ),
    classes: ['c-com', 'c-str', 'c-attr', 'c-key', 'c-fn', 'c-fn', 'c-attr'],
  },

  css: {
    pattern: new RegExp(
      [
        /(\/\*[\s\S]*?\*\/|\/\*[^\n]*)/, // 1 Kommentar
        /("[^"]*"|'[^']*')/, // 2 String
        /^([^{};]*[^{};\s])(?=\s*\{)/, // 3 Selektor
        /([-\w]+)(?=\s*:)/, // 4 Eigenschaft
        /([a-zA-Z-]+)(?=\()/, // 5 Funktion
        /(#[0-9a-fA-F]{3,8}\b|-?\d+(?:\.\d+)?[a-z%]*)/, // 6 Wert
      ]
        .map((re) => re.source)
        .join('|'),
      'g',
    ),
    classes: ['c-com', 'c-str', 'c-fn', 'c-attr', 'c-key', 'c-str'],
  },

  yaml: {
    pattern: new RegExp(
      [
        /(#[^\n]*)/, // 1 Kommentar
        /("[^"]*"|'[^']*')/, // 2 String
        /^([\w.-]+)(?=\s*:)/, // 3 Schlüssel auf oberster Ebene
        /([\w.-]+)(?=\s*:)/, // 4 verschachtelter Schlüssel
        /\b(\d+)\b/, // 5 Zahl
        /([A-Za-z][\w.-]*)/, // 6 Wert
      ]
        .map((re) => re.source)
        .join('|'),
      'g',
    ),
    classes: ['c-com', 'c-str', 'c-fn', 'c-attr', 'c-attr', 'c-str'],
  },
}

function highlightLine(line, language) {
  const spec = LANGUAGES[language]
  if (!spec) return escapeText(line)

  const pattern = new RegExp(spec.pattern.source, 'g')
  let out = ''
  let cursor = 0
  let match

  while ((match = pattern.exec(line)) !== null) {
    if (match[0] === '') {
      pattern.lastIndex += 1
      continue
    }

    if (match.index > cursor) out += escapeText(line.slice(cursor, match.index))

    let className = null
    for (let group = 1; group < match.length; group += 1) {
      if (match[group] !== undefined) {
        className = spec.classes[group - 1]
        break
      }
    }

    const text = escapeText(match[0])
    out += className ? `<span class="${className}">${text}</span>` : text
    cursor = match.index + match[0].length
  }

  return out + escapeText(line.slice(cursor))
}

/**
 * Baut die Zeilenstruktur für ein <pre class="code">.
 * @param {string} code      Roher Text aus dem CMS, eine Zeile pro Zeile.
 * @param {string} language  'js' | 'css' | 'yaml' | 'plain'
 * @param {boolean} caret    Blinkender Cursor hinter der letzten gefüllten Zeile.
 */
export function buildCodeHtml(code, language = 'plain', caret = false) {
  const lines = String(code ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')

  let caretLine = -1
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].trim()) {
      caretLine = i
      break
    }
  }

  let delay = 0

  return lines
    .map((line, index) => {
      if (!line.trim()) return '<span class="cl cl--gap"></span>'

      const steps = Math.max(1, line.length)
      const duration = Math.max(MIN_DURATION, steps * SECONDS_PER_CHAR)
      const style = `--s:${steps};--dur:${duration.toFixed(2)}s;--d:${delay.toFixed(2)}s`
      delay += duration * OVERLAP

      const cursor = caret && index === caretLine ? '<span class="caret"></span>' : ''
      return `<span class="cl"><span class="tw" style="${style}">${highlightLine(line, language)}${cursor}</span></span>`
    })
    .join('')
}
