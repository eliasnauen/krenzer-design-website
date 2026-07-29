/* Escaping für zusammengebautes Markup.

   Die Regeln entsprechen exakt dem, was der Browser beim Serialisieren
   (innerHTML/outerHTML) ausgibt. Nur so lässt sich erzeugtes Markup mit dem
   bestehenden vergleichen, um unnötige Schreibvorgänge zu vermeiden. */

/** Für Textknoten. */
export function escapeText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Für Werte in doppelten Anführungszeichen: attr="…". */
export function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
}
